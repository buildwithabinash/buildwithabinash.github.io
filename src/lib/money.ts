// The maths behind every calculator, as plain functions.
//
// Kept away from the inputs and the markup on purpose: this is the part
// that has to be right, so it should be readable and checkable on its own.
// Rates and slabs live in named constants near the top so they can be
// updated once a year without hunting through the file.

/* ── Rates that go stale ───────────────────────────────────────── */

/** The tax year these slabs belong to. Shown in the UI. */
export const TAX_YEAR = "FY 2025-26 (AY 2026-27)";
/** When the slabs below were last checked against the department site. */
export const TAX_CHECKED = "10 Oct 2026";

type Slab = { upTo: number; rate: number };

/** New regime, after Budget 2025. */
const NEW_SLABS: Slab[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];

/** Old regime, for anyone under 60. */
const OLD_SLABS: Slab[] = [
  { upTo: 250000, rate: 0 },
  { upTo: 500000, rate: 0.05 },
  { upTo: 1000000, rate: 0.2 },
  { upTo: Infinity, rate: 0.3 },
];

const NEW_STANDARD_DEDUCTION = 75000;
const OLD_STANDARD_DEDUCTION = 50000;
/** Below this taxable income the 87A rebate wipes the bill out. */
const NEW_REBATE_LIMIT = 1200000;
const OLD_REBATE_LIMIT = 500000;
const OLD_REBATE_CAP = 12500;
const CESS = 0.04;

/** The EPF statutory wage ceiling, a month. 12% of this is ₹1,800. */
export const EPF_WAGE_CEILING = 15000;

/** Public Provident Fund, for the current quarter. */
export const PPF_RATE = 7.1;
export const PPF_YEARS = 15;
export const PPF_MAX_YEARLY = 150000;

/* ── Small helpers ─────────────────────────────────────────────── */

const monthlyRate = (annualPct: number) => annualPct / 100 / 12;
const pos = (n: number) => (n > 0 ? n : 0);

function slabTax(income: number, slabs: Slab[]) {
  let tax = 0;
  let last = 0;
  for (const s of slabs) {
    if (income <= last) break;
    tax += (Math.min(income, s.upTo) - last) * s.rate;
    last = s.upTo;
  }
  return tax;
}

/** Surcharge on high incomes. The new regime caps it at 25%. */
function surchargeRate(income: number, regime: "new" | "old") {
  if (income > 50000000 && regime === "old") return 0.37;
  if (income > 20000000) return 0.25;
  if (income > 10000000) return 0.15;
  if (income > 5000000) return 0.1;
  return 0;
}

/* ── Income tax ────────────────────────────────────────────────── */

export type TaxBreakdown = {
  /** Salary after the standard deduction and any other deductions. */
  taxable: number;
  /** Tax from the slabs, before any rebate. */
  beforeRebate: number;
  rebate: number;
  surcharge: number;
  cess: number;
  /** What you actually pay. */
  total: number;
};

/**
 * Tax on a salary.
 *
 * `deductions` only applies to the old regime; the new regime allows
 * almost none of them, which is the whole point of the comparison.
 */
export function incomeTax(salary: number, regime: "new" | "old", deductions = 0): TaxBreakdown {
  const sd = regime === "new" ? NEW_STANDARD_DEDUCTION : OLD_STANDARD_DEDUCTION;
  const taxable = pos(salary - sd - (regime === "old" ? deductions : 0));
  const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;

  const beforeRebate = slabTax(taxable, slabs);

  let rebate = 0;
  if (regime === "new" && taxable <= NEW_REBATE_LIMIT) rebate = beforeRebate;
  if (regime === "old" && taxable <= OLD_REBATE_LIMIT) rebate = Math.min(beforeRebate, OLD_REBATE_CAP);

  let afterRebate = beforeRebate - rebate;

  // Marginal relief: just past the rebate limit, the tax cannot exceed
  // the income that took you over it. Without this, one extra rupee of
  // income can cost tens of thousands.
  if (regime === "new" && taxable > NEW_REBATE_LIMIT) {
    afterRebate = Math.min(afterRebate, taxable - NEW_REBATE_LIMIT);
  }

  const surcharge = afterRebate * surchargeRate(taxable, regime);
  const cess = (afterRebate + surcharge) * CESS;

  return { taxable, beforeRebate, rebate, surcharge, cess, total: afterRebate + surcharge + cess };
}

/**
 * What each deduction is capped at, whatever you actually spend.
 *
 * The caps are the point: someone putting ₹3 lakh into 80C instruments
 * still only gets ₹1.5 lakh off their income.
 */
export const DEDUCTION_CAPS = {
  s80C: 150000,
  s80D: 100000,
  nps: 50000,
  homeLoan: 200000,
} as const;

export type Deductions = {
  /** PF, ELSS, life insurance, PPF, home loan principal, tuition fees. */
  s80C: number;
  /** Health insurance premiums, yours and your parents'. */
  s80D: number;
  /** The exempt part of your HRA. Depends on rent, basic and city. */
  hra: number;
  /** NPS under 80CCD(1B), on top of 80C. */
  nps: number;
  /** Interest on a home loan, section 24(b). */
  homeLoan: number;
  /** Employer's NPS under 80CCD(2) — the one deduction both regimes allow. */
  employerNps: number;
};

export const noDeductions: Deductions = {
  s80C: 0,
  s80D: 0,
  hra: 0,
  nps: 0,
  homeLoan: 0,
  employerNps: 0,
};

/** What the old regime actually lets you take off, caps applied. */
function oldRegimeDeductions(d: Deductions) {
  return (
    Math.min(d.s80C, DEDUCTION_CAPS.s80C) +
    Math.min(d.s80D, DEDUCTION_CAPS.s80D) +
    Math.min(d.nps, DEDUCTION_CAPS.nps) +
    Math.min(d.homeLoan, DEDUCTION_CAPS.homeLoan) +
    d.hra
  );
}

/** Anything you entered above a cap, which does nothing for you. */
function wastedDeductions(d: Deductions) {
  return (
    pos(d.s80C - DEDUCTION_CAPS.s80C) +
    pos(d.s80D - DEDUCTION_CAPS.s80D) +
    pos(d.nps - DEDUCTION_CAPS.nps) +
    pos(d.homeLoan - DEDUCTION_CAPS.homeLoan)
  );
}

/** Which regime costs less, and by how much. */
export function compareRegimes(salary: number, d: Deductions) {
  // 80CCD(2) comes off before either regime is applied.
  const base = pos(salary - d.employerNps);
  const claimed = oldRegimeDeductions(d);
  const newRegime = incomeTax(base, "new");
  const oldRegime = incomeTax(base, "old", claimed);
  return {
    newRegime,
    oldRegime,
    claimed,
    wasted: wastedDeductions(d),
    better: newRegime.total <= oldRegime.total ? ("new" as const) : ("old" as const),
    saving: Math.abs(newRegime.total - oldRegime.total),
  };
}

/* ── What actually reaches your account ────────────────────────── */

/**
 * PF is 12%, but employers differ on what of.
 *
 * "basic" applies it to your whole basic pay. "ceiling" applies it to
 * the statutory wage of ₹15,000 a month, which caps it at ₹1,800 — the
 * legal minimum, and what a lot of employers stick to.
 */
export type PfBase = "basic" | "ceiling";

export function takeHome(
  ctc: number,
  basicPct: number,
  regime: "new" | "old",
  deductions = 0,
  pfBase: PfBase = "basic",
  professionalTaxYearly = 2400,
) {
  const basic = ctc * (basicPct / 100);
  const pfOn = pfBase === "ceiling" ? Math.min(basic, EPF_WAGE_CEILING * 12) : basic;
  const employerPf = pfOn * 0.12;
  // Gratuity is worked out on full basic either way; the ceiling is a PF rule.
  const gratuity = basic * 0.0481;
  // CTC includes what the employer puts in. Your gross does not.
  const gross = pos(ctc - employerPf - gratuity);
  const employeePf = pfOn * 0.12;
  const professionalTax = professionalTaxYearly;

  const tax = incomeTax(gross, regime, deductions);
  const annual = pos(gross - employeePf - professionalTax - tax.total);

  return {
    basic,
    gross,
    employerPf,
    gratuity,
    employeePf,
    professionalTax,
    tax: tax.total,
    annual,
    perMonth: annual / 12,
  };
}

/* ── Saving and investing ──────────────────────────────────────── */

/** A monthly investment, paid at the start of each month. */
export function sip(amount: number, years: number, ratePct: number) {
  const n = Math.round(years * 12);
  const i = monthlyRate(ratePct);
  const invested = amount * n;
  const future = i === 0 ? invested : amount * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  return { invested, future, gain: future - invested };
}

/** A SIP you raise by a fixed percentage every year. */
export function stepUpSip(amount: number, years: number, ratePct: number, stepPct: number) {
  const i = monthlyRate(ratePct);
  let future = 0;
  let invested = 0;
  let current = amount;
  for (let y = 0; y < Math.round(years); y++) {
    for (let m = 0; m < 12; m++) {
      future = (future + current) * (1 + i);
      invested += current;
    }
    current *= 1 + stepPct / 100;
  }
  return { invested, future, gain: future - invested, finalMonthly: current };
}

/** One amount, left alone, compounded once a year. */
export function lumpsum(amount: number, years: number, ratePct: number) {
  const future = amount * Math.pow(1 + ratePct / 100, years);
  return { invested: amount, future, gain: future - amount };
}

/** The monthly investment a target needs. */
export function goalSip(target: number, years: number, ratePct: number, haveAlready = 0) {
  const n = Math.round(years * 12);
  const i = monthlyRate(ratePct);
  const fromExisting = haveAlready * Math.pow(1 + i, n);
  const needed = pos(target - fromExisting);
  const perMonth = i === 0 ? needed / n : needed / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  return { target, fromExisting, needed, perMonth, invested: perMonth * n };
}

/** A fixed deposit, compounded quarterly as banks do. */
export function fd(principal: number, years: number, ratePct: number) {
  const future = principal * Math.pow(1 + ratePct / 100 / 4, years * 4);
  return { invested: principal, future, gain: future - principal };
}

/** PPF: a deposit at the start of every year, compounded annually. */
export function ppf(yearly: number, ratePct = PPF_RATE, years = PPF_YEARS) {
  let balance = 0;
  for (let y = 0; y < years; y++) balance = (balance + yearly) * (1 + ratePct / 100);
  const invested = yearly * years;
  return { invested, future: balance, gain: balance - invested };
}

/** The rate that turns one amount into another. */
export function cagr(start: number, end: number, years: number) {
  if (start <= 0 || years <= 0) return { rate: 0, multiple: 0 };
  return { rate: (Math.pow(end / start, 1 / years) - 1) * 100, multiple: end / start };
}

/** What today's money costs later, and what it will be worth. */
export function inflation(amount: number, years: number, ratePct: number) {
  const costLater = amount * Math.pow(1 + ratePct / 100, years);
  const worthLater = amount / Math.pow(1 + ratePct / 100, years);
  return { costLater, worthLater, lost: amount - worthLater };
}

/** Drawing a monthly income from a corpus. */
export function swp(corpus: number, withdrawal: number, ratePct: number, inflationPct = 0) {
  const i = monthlyRate(ratePct);
  let balance = corpus;
  let draw = withdrawal;
  let totalDrawn = 0;
  const cap = 60 * 12;
  for (let m = 1; m <= cap; m++) {
    balance = balance * (1 + i) - draw;
    if (balance <= 0) return { months: m, lasts: false, totalDrawn, endBalance: 0 };
    totalDrawn += draw;
    if (m % 12 === 0) draw *= 1 + inflationPct / 100;
  }
  return { months: cap, lasts: true, totalDrawn, endBalance: balance };
}

/* ── Safety net and protection ─────────────────────────────────── */

export function emergencyFund(monthlyExpenses: number, months: number, saved: number, savingPerMonth: number) {
  const target = monthlyExpenses * months;
  const short = pos(target - saved);
  const monthsToGo = savingPerMonth > 0 ? Math.ceil(short / savingPerMonth) : Infinity;
  return { target, short, monthsToGo, done: short === 0 };
}

/**
 * Term cover, by income replacement.
 *
 * What the people who depend on you would need: years of expenses, plus
 * what you owe and what you still have to pay for, less what already
 * exists to cover it.
 */
export function termCover(opts: {
  monthlyExpenses: number;
  yearsOfSupport: number;
  loans: number;
  futureGoals: number;
  savings: number;
  existingCover: number;
}) {
  const { monthlyExpenses, yearsOfSupport, loans, futureGoals, savings, existingCover } = opts;
  const replaceIncome = monthlyExpenses * 12 * yearsOfSupport;
  const need = replaceIncome + loans + futureGoals;
  const have = savings + existingCover;
  return { replaceIncome, need, have, gap: pos(need - have) };
}

/* ── Borrowing ─────────────────────────────────────────────────── */

export function emi(principal: number, years: number, ratePct: number) {
  const n = Math.round(years * 12);
  const i = monthlyRate(ratePct);
  const amount = i === 0 ? principal / n : (principal * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
  const total = amount * n;
  return { monthly: amount, total, interest: total - principal, months: n };
}

/** How long a balance takes to clear, and what it costs to get there. */
export function payoff(balance: number, ratePct: number, payment: number) {
  const i = monthlyRate(ratePct);
  // If the payment does not cover the interest, the balance never falls.
  if (payment <= balance * i) return { months: Infinity, interest: Infinity, total: Infinity, never: true };
  let owed = balance;
  let interest = 0;
  let m = 0;
  while (owed > 0 && m < 1200) {
    const charge = owed * i;
    interest += charge;
    owed = owed + charge - payment;
    m++;
  }
  return { months: m, interest, total: balance + interest, never: false };
}

/**
 * Paying only the minimum, which is a share of the balance and so falls
 * as the balance does. This is the trap: the payment shrinks just fast
 * enough to keep you there.
 */
export function minimumOnly(balance: number, ratePct: number, minPct: number, floor = 200) {
  const i = monthlyRate(ratePct);
  let owed = balance;
  let interest = 0;
  let m = 0;
  while (owed > 1 && m < 1200) {
    const charge = owed * i;
    const pay = Math.max(owed * (minPct / 100), floor);
    if (pay <= charge) return { months: Infinity, interest: Infinity, never: true };
    interest += charge;
    owed = owed + charge - Math.min(pay, owed + charge);
    m++;
  }
  return { months: m, interest, never: false };
}

/** What paying extra saves: a bit more each month, a lump sum, or both. */
export function prepay(
  outstanding: number,
  ratePct: number,
  remainingYears: number,
  extra: number,
  lump = 0,
) {
  const base = emi(outstanding, remainingYears, ratePct);
  const after = pos(outstanding - lump);
  const withExtra = after === 0 ? { months: 0, interest: 0, never: false } : payoff(after, ratePct, base.monthly + extra);
  const never = withExtra.never;
  return {
    emi: base.monthly,
    baseMonths: base.months,
    baseInterest: base.interest,
    newMonths: never ? base.months : withExtra.months,
    newInterest: never ? base.interest : withExtra.interest,
    monthsSaved: never ? 0 : base.months - withExtra.months,
    interestSaved: never ? 0 : base.interest - withExtra.interest,
  };
}

/** Interest after tax, at your slab. FDs look very different here. */
export function afterTax(gain: number, slabPct: number) {
  const tax = gain * (slabPct / 100);
  return { tax, net: gain - tax };
}

/** Today's buying power of a future amount. */
export function realValue(future: number, years: number, inflationPct: number) {
  return future / Math.pow(1 + inflationPct / 100, years);
}

/**
 * Renting against buying, compared on what you are worth at the end.
 *
 * The buyer's wealth is the house minus what is still owed. The renter
 * invests the deposit, and every month invests whatever the buyer pays
 * above their rent. Run month by month so the rent can rise.
 */
export function rentVsBuy(opts: {
  price: number;
  downPct: number;
  loanRatePct: number;
  loanYears: number;
  rent: number;
  rentRisePct: number;
  appreciationPct: number;
  returnPct: number;
  maintenancePct: number;
  years: number;
  /** Stamp duty, registration and brokerage, as a share of the price. */
  buyingCostsPct: number;
}) {
  const { price, downPct, loanRatePct, loanYears, rent, rentRisePct } = opts;
  const { appreciationPct, returnPct, maintenancePct, years, buyingCostsPct } = opts;

  const buyingCosts = price * (buyingCostsPct / 100);
  const down = price * (downPct / 100);
  const loanInfo = emi(price - down, loanYears, loanRatePct);
  const li = monthlyRate(loanRatePct);
  const ri = monthlyRate(returnPct);
  const monthlyMaintenance = (price * (maintenancePct / 100)) / 12;

  let owed = price - down;
  // The renter invests the deposit and the buying costs, which the buyer
  // hands over to the state and never sees again.
  let portfolio = down + buyingCosts;
  let currentRent = rent;
  let rentPaid = 0;
  let interestPaid = 0;
  const months = Math.round(years * 12);

  for (let m = 1; m <= months; m++) {
    if (owed > 0 && m <= loanInfo.months) {
      const charge = owed * li;
      interestPaid += charge;
      owed = pos(owed + charge - loanInfo.monthly);
    }
    // The renter invests the gap between owning and renting, when there is one.
    const owningCost = (m <= loanInfo.months ? loanInfo.monthly : 0) + monthlyMaintenance;
    const gap = owningCost - currentRent;
    portfolio = portfolio * (1 + ri) + pos(gap);
    rentPaid += currentRent;
    if (m % 12 === 0) currentRent *= 1 + rentRisePct / 100;
  }

  const houseValue = price * Math.pow(1 + appreciationPct / 100, years);
  const buyerWorth = houseValue - owed;

  return {
    buyerWorth,
    renterWorth: portfolio,
    houseValue,
    owed,
    interestPaid,
    rentPaid,
    buyingCosts,
    emi: loanInfo.monthly,
    better: buyerWorth >= portfolio ? ("buy" as const) : ("rent" as const),
    difference: Math.abs(buyerWorth - portfolio),
  };
}

/** The corpus that covers your spending, and how long it takes to build. */
export function fire(opts: {
  monthlyExpenses: number;
  currentCorpus: number;
  monthlyInvestment: number;
  returnPct: number;
  inflationPct: number;
  withdrawalPct: number;
}) {
  const { monthlyExpenses, currentCorpus, monthlyInvestment } = opts;
  const { returnPct, inflationPct, withdrawalPct } = opts;
  const target = withdrawalPct > 0 ? (monthlyExpenses * 12 * 100) / withdrawalPct : Infinity;

  // Real return per month: discount by inflation so the target stays in
  // today's rupees rather than being inflated separately.
  const realAnnual = (1 + returnPct / 100) / (1 + inflationPct / 100) - 1;
  const i = Math.pow(1 + realAnnual, 1 / 12) - 1;

  if (currentCorpus >= target) return { target, months: 0, reachable: true, corpus: currentCorpus };

  let corpus = currentCorpus;
  const cap = 80 * 12;
  for (let m = 1; m <= cap; m++) {
    corpus = corpus * (1 + i) + monthlyInvestment;
    if (corpus >= target) return { target, months: m, reachable: true, corpus };
  }
  return { target, months: cap, reachable: false, corpus };
}

/* ── Formatting ────────────────────────────────────────────────── */

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** Indian grouping, with the rupee sign. */
export function rupees(n: number) {
  if (!Number.isFinite(n)) return "—";
  return `₹${inr.format(Math.round(n))}`;
}

/** Lakhs and crores, for headline numbers. */
export function rupeesShort(n: number) {
  if (!Number.isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return rupees(n);
}

export function yearsAndMonths(months: number) {
  if (!Number.isFinite(months)) return "—";
  const y = Math.floor(months / 12);
  const m = Math.round(months % 12);
  if (y === 0) return `${m} ${m === 1 ? "month" : "months"}`;
  if (m === 0) return `${y} ${y === 1 ? "year" : "years"}`;
  return `${y} ${y === 1 ? "yr" : "yrs"} ${m} ${m === 1 ? "mo" : "mos"}`;
}
