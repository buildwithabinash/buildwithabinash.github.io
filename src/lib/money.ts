// The maths behind every calculator, as plain functions.
//
// Kept away from the inputs and the markup on purpose: this is the part
// that has to be right, so it should be readable and checkable on its own.
// Rates and slabs live in named constants near the top so they can be
// updated once a year without hunting through the file.

/* ── Rates that go stale ───────────────────────────────────────── */

/**
 * The first calendar year of the tax year the slabs belong to. Bump it
 * every April after checking the slabs; the tests fail once it is stale.
 */
export const TAX_YEAR_START = 2026;
/**
 * Shown in the UI. Under the Income-tax Act, 2025 "tax year" replaces the
 * old financial year and assessment year pair.
 */
export const TAX_YEAR = `tax year ${TAX_YEAR_START}-${String(TAX_YEAR_START + 1).slice(2)} (April ${TAX_YEAR_START} to March ${TAX_YEAR_START + 1})`;
/** When the slabs below were last checked against the department site. */
export const TAX_CHECKED = "10 Oct 2026";

type Slab = { upTo: number; rate: number };

/** New regime, after Budget 2025. Budget 2026 left the slabs unchanged. */
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

/** Small savings rates, for the current quarter. Reset every three months. */
export const SMALL_SAVINGS_CHECKED = "Oct–Dec 2026";
export const SSY_RATE = 8.2;
export const SSY_MAX_YEARLY = 150000;
export const EPF_RATE = 8.25;
/** The pension scheme's share, capped at 8.33% of ₹15,000 a month. */
export const EPS_MAX_MONTHLY = 1250;
/** Gratuity above this is taxed, however long you served. */
export const GRATUITY_TAX_FREE = 2000000;
/** Long-term gains on listed equity up to this, a year, are tax free. */
export const LTCG_EQUITY_EXEMPT = 125000;

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
  return taxOnIncome(salary - sd - (regime === "old" ? deductions : 0), regime);
}

/**
 * Tax on an income that is already net of every deduction: slabs, the
 * rebate, marginal relief, surcharge and cess.
 *
 * The rebate is for residents only. A non-resident with ₹10 lakh of
 * Indian income pays tax on it where a resident would pay nothing.
 */
export function taxOnIncome(income: number, regime: "new" | "old", resident = true): TaxBreakdown {
  const taxable = pos(income);
  const slabs = regime === "new" ? NEW_SLABS : OLD_SLABS;

  const beforeRebate = slabTax(taxable, slabs);

  let rebate = 0;
  if (resident && regime === "new" && taxable <= NEW_REBATE_LIMIT) rebate = beforeRebate;
  if (resident && regime === "old" && taxable <= OLD_REBATE_LIMIT) rebate = Math.min(beforeRebate, OLD_REBATE_CAP);

  let afterRebate = beforeRebate - rebate;

  // Marginal relief: just past the rebate limit, the tax cannot exceed
  // the income that took you over it. Without this, one extra rupee of
  // income can cost tens of thousands.
  if (resident && regime === "new" && taxable > NEW_REBATE_LIMIT) {
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

/* ── Salary extras ─────────────────────────────────────────────── */

/**
 * The exempt part of HRA: the smallest of what you were paid, rent above
 * a tenth of basic, and half of basic (40% outside the metros). Only the
 * old regime lets you claim it.
 */
export function hraExemption(basic: number, hra: number, rent: number, metro: boolean) {
  const overTenth = pos(rent - basic * 0.1);
  const share = basic * (metro ? 0.5 : 0.4);
  const exempt = Math.min(hra, overTenth, share);
  const limitedBy =
    exempt === hra ? ("hra" as const) : exempt === overTenth ? ("rent" as const) : ("share" as const);
  return { exempt, taxable: pos(hra - exempt), overTenth, share, limitedBy };
}

/**
 * Gratuity. Under the Act it is 15 days' pay for every year, on a 26-day
 * month, and a final part-year of more than six months counts as a year.
 * Outside it, a 30-day month and completed years only.
 */
export function gratuity(monthlyPay: number, years: number, months: number, covered: boolean) {
  const countedYears = covered ? years + (months > 6 ? 1 : 0) : years;
  const amount = (monthlyPay * 15 * countedYears) / (covered ? 26 : 30);
  return {
    amount,
    countedYears,
    taxFree: Math.min(amount, GRATUITY_TAX_FREE),
    taxable: pos(amount - GRATUITY_TAX_FREE),
  };
}

/**
 * Tax on a capital gain, under the rates from 23 July 2024.
 *
 * Listed equity and equity funds are long term after a year: 12.5% above
 * the yearly exemption, 20% if sold sooner. Property, gold and most other
 * assets are long term after two years at 12.5% with no indexation, and
 * taxed at your slab if sold sooner. Cess on top; surcharge is left out.
 */
export function capitalGains(opts: {
  asset: "equity" | "other";
  bought: number;
  sold: number;
  monthsHeld: number;
  slabPct: number;
  exemptionUsed: number;
}) {
  const { asset, bought, sold, monthsHeld, slabPct, exemptionUsed } = opts;
  const gain = sold - bought;
  const longTerm = monthsHeld > (asset === "equity" ? 12 : 24);
  if (gain <= 0) return { gain, longTerm, exempt: 0, taxable: 0, rate: 0, tax: 0 };

  let exempt = 0;
  let rate: number;
  if (asset === "equity") {
    rate = longTerm ? 12.5 : 20;
    if (longTerm) exempt = Math.min(gain, pos(LTCG_EQUITY_EXEMPT - exemptionUsed));
  } else {
    rate = longTerm ? 12.5 : slabPct;
  }
  const taxable = gain - exempt;
  const tax = taxable * (rate / 100) * (1 + CESS);
  return { gain, longTerm, exempt, taxable, rate, tax };
}

/* ── Government schemes ────────────────────────────────────────── */

/**
 * EPF, run month by month. Interest is worked out monthly on the running
 * balance and credited once a year, which is how EPFO does it. Of the
 * employer's 12%, up to ₹1,250 a month goes to the pension scheme and
 * never reaches this balance.
 */
export function epf(opts: {
  monthlyBasic: number;
  age: number;
  retireAge: number;
  balance: number;
  raisePct: number;
  ratePct: number;
  pfBase: PfBase;
}) {
  const { age, retireAge, balance, raisePct, ratePct, pfBase } = opts;
  const i = ratePct / 100 / 12;
  let basic = opts.monthlyBasic;
  let total = balance;
  let mine = 0;
  let employer = 0;
  const years = pos(Math.round(retireAge - age));

  for (let y = 0; y < years; y++) {
    const wage = pfBase === "ceiling" ? Math.min(basic, EPF_WAGE_CEILING) : basic;
    const eps = Math.min(Math.min(basic, EPF_WAGE_CEILING) * 0.0833, EPS_MAX_MONTHLY);
    const fromYou = wage * 0.12;
    const fromThem = pos(wage * 0.12 - eps);
    let interest = 0;
    for (let m = 0; m < 12; m++) {
      total += fromYou + fromThem;
      interest += total * i;
    }
    total += interest;
    mine += fromYou * 12;
    employer += fromThem * 12;
    basic *= 1 + raisePct / 100;
  }
  const invested = balance + mine + employer;
  return { future: total, mine, employer, opening: balance, interest: total - invested, years };
}

/**
 * NPS: a monthly contribution until 60, then part of the corpus buys an
 * annuity that pays the pension, and the rest can be taken as a lump sum.
 */
export function nps(opts: {
  monthly: number;
  age: number;
  retireAge: number;
  balance: number;
  returnPct: number;
  annuityPct: number;
  annuityRatePct: number;
}) {
  const { monthly, age, retireAge, balance, returnPct, annuityPct, annuityRatePct } = opts;
  const years = pos(retireAge - age);
  const grown = sip(monthly, years, returnPct);
  const corpus = grown.future + balance * Math.pow(1 + returnPct / 100, years);
  const annuity = corpus * (annuityPct / 100);
  return {
    years,
    corpus,
    invested: grown.invested + balance,
    lumpSum: corpus - annuity,
    annuity,
    pension: (annuity * (annuityRatePct / 100)) / 12,
  };
}

/**
 * Sukanya Samriddhi. Deposits for the first fifteen years, then the
 * balance keeps earning until the account is 21 years old.
 */
export function ssy(yearly: number, ratePct = SSY_RATE) {
  let balance = 0;
  for (let y = 1; y <= 21; y++) balance = (balance + (y <= 15 ? yearly : 0)) * (1 + ratePct / 100);
  const invested = yearly * 15;
  return { invested, future: balance, gain: balance - invested };
}

export type PostOfficeScheme = "mis" | "scss" | "nsc" | "kvp" | "td";

/** The post office schemes, at this quarter's rates. */
export const POST_OFFICE: Record<
  PostOfficeScheme,
  { name: string; rate: number; years: number; max: number; pays: "monthly" | "quarterly" | "yearly" | "maturity" }
> = {
  mis: { name: "Monthly Income Scheme", rate: 7.4, years: 5, max: 900000, pays: "monthly" },
  scss: { name: "Senior Citizens Savings Scheme", rate: 8.2, years: 5, max: 3000000, pays: "quarterly" },
  nsc: { name: "National Savings Certificate", rate: 7.7, years: 5, max: Infinity, pays: "maturity" },
  kvp: { name: "Kisan Vikas Patra", rate: 7.5, years: 115 / 12, max: Infinity, pays: "maturity" },
  td: { name: "5-year Time Deposit", rate: 7.5, years: 5, max: Infinity, pays: "yearly" },
};

/**
 * What a post office scheme pays. MIS, SCSS and the time deposit pay the
 * interest out and hand the deposit back at the end; the time deposit
 * works it out quarterly but pays it once a year. NSC compounds yearly
 * to maturity, and KVP doubles on a fixed date.
 */
export function postOffice(scheme: PostOfficeScheme, amount: number, ratePct: number) {
  const s = POST_OFFICE[scheme];
  if (s.pays !== "maturity") {
    const perYear =
      s.pays === "yearly" ? amount * (Math.pow(1 + ratePct / 400, 4) - 1) : amount * (ratePct / 100);
    const payout = s.pays === "monthly" ? perYear / 12 : s.pays === "quarterly" ? perYear / 4 : perYear;
    const interest = perYear * s.years;
    return { years: s.years, payout, interest, future: amount + interest };
  }
  const future = scheme === "kvp" ? amount * 2 : amount * Math.pow(1 + ratePct / 100, s.years);
  return { years: s.years, payout: 0, interest: future - amount, future };
}

/* ── More saving and borrowing ─────────────────────────────────── */

/**
 * A recurring deposit: a fixed amount every month, compounded quarterly
 * the way banks do it, each instalment for the months it was in.
 */
export function rd(monthly: number, years: number, ratePct: number) {
  const n = Math.round(years * 12);
  let future = 0;
  for (let k = 1; k <= n; k++) future += monthly * Math.pow(1 + ratePct / 400, k / 3);
  const invested = monthly * n;
  return { invested, future, gain: future - invested };
}

/**
 * Moving a loan to a cheaper lender, for the same remaining tenure.
 * The fees are paid up front, so the saving has to clear them first.
 */
export function balanceTransfer(
  outstanding: number,
  remainingYears: number,
  oldRatePct: number,
  newRatePct: number,
  fees: number,
) {
  const before = emi(outstanding, remainingYears, oldRatePct);
  const after = emi(outstanding, remainingYears, newRatePct);
  const emiSaved = before.monthly - after.monthly;
  const saving = before.interest - after.interest - fees;
  const breakEven = emiSaved > 0 ? Math.ceil(fees / emiSaved) : Infinity;
  return {
    oldEmi: before.monthly,
    newEmi: after.monthly,
    oldInterest: before.interest,
    newInterest: after.interest,
    emiSaved,
    saving,
    breakEven,
    worth: saving > 0,
  };
}

/* ── More tax ──────────────────────────────────────────────────── */

/** The year advance tax is being paid for: the same year as the slabs. */
export const ADVANCE_TAX_YEAR = TAX_YEAR;
/** Below this much tax left after TDS, advance tax is not required. */
export const ADVANCE_TAX_THRESHOLD = 10000;

/** Cumulative share of the year's tax due by each date. */
export const ADVANCE_TAX_DATES: { date: string; iso: string; share: number; monthsLate: number }[] = [
  { date: `15 June ${TAX_YEAR_START}`, iso: `${TAX_YEAR_START}-06-15`, share: 0.15, monthsLate: 3 },
  { date: `15 September ${TAX_YEAR_START}`, iso: `${TAX_YEAR_START}-09-15`, share: 0.45, monthsLate: 3 },
  { date: `15 December ${TAX_YEAR_START}`, iso: `${TAX_YEAR_START}-12-15`, share: 0.75, monthsLate: 3 },
  { date: `15 March ${TAX_YEAR_START + 1}`, iso: `${TAX_YEAR_START + 1}-03-15`, share: 1, monthsLate: 1 },
];

/**
 * Advance tax: what is due, by when, and roughly what skipping it costs.
 *
 * Salary gets the standard deduction; other income (interest, rent after
 * its 30%, freelance profit) is added as it is. If you pay nothing until
 * you file, interest is 1% a month on each missed instalment for three
 * months (one for March), plus 1% a month on the whole shortfall from
 * April until you pay. That second part is counted to 31 July here.
 */
export function advanceTax(opts: {
  salary: number;
  other: number;
  regime: "new" | "old";
  deductions: number;
  tds: number;
  presumptive: boolean;
}) {
  const { salary, other, regime, deductions, tds, presumptive } = opts;
  const sd = salary > 0 ? Math.min(salary, regime === "new" ? NEW_STANDARD_DEDUCTION : OLD_STANDARD_DEDUCTION) : 0;
  const tax = taxOnIncome(salary - sd + other - (regime === "old" ? deductions : 0), regime);
  const net = pos(tax.total - tds);
  const due = net >= ADVANCE_TAX_THRESHOLD;

  const schedule = presumptive
    ? [{ ...ADVANCE_TAX_DATES[3], amount: net }]
    : ADVANCE_TAX_DATES.map((d) => ({ ...d, amount: net * d.share }));

  // What paying nothing until 31 July costs.
  const missed = presumptive
    ? net * 0.01
    : ADVANCE_TAX_DATES.reduce((sum, d) => sum + net * d.share * 0.01 * d.monthsLate, 0);
  const shortfall = net * 0.01 * 4;
  return { tax, net, due, schedule, interestIfSkipped: due ? missed + shortfall : 0 };
}

/** Receipts up to this qualify for presumptive tax if almost all come by bank. */
export const PRESUMPTIVE_LIMIT = 7500000;
/** The lower limit, when more than 5% of receipts come in cash. */
export const PRESUMPTIVE_LIMIT_CASH = 5000000;

/**
 * A freelancer's or professional's tax, two ways: declaring half the
 * receipts as profit under the presumptive scheme (the old 44ADA), or
 * keeping books and paying on actual profit.
 */
export function freelanceTax(opts: {
  receipts: number;
  expenses: number;
  regime: "new" | "old";
  deductions: number;
  mostlyBank: boolean;
}) {
  const { receipts, expenses, regime, deductions, mostlyBank } = opts;
  const less = regime === "old" ? deductions : 0;
  const eligible = receipts <= (mostlyBank ? PRESUMPTIVE_LIMIT : PRESUMPTIVE_LIMIT_CASH);
  const presumptiveProfit = receipts / 2;
  const actualProfit = pos(receipts - expenses);
  const presumptive = taxOnIncome(presumptiveProfit - less, regime);
  const books = taxOnIncome(actualProfit - less, regime);
  return {
    eligible,
    presumptiveProfit,
    actualProfit,
    presumptive,
    books,
    better: eligible && presumptive.total <= books.total ? ("presumptive" as const) : ("books" as const),
  };
}

export type Residency = "ROR" | "RNOR" | "NR";

/**
 * Residential status for a tax year, from days spent in India.
 *
 * Resident if in India 182 days or more, or 60 days plus 365 across the
 * previous four years. For an Indian citizen or person of Indian origin
 * living abroad, that 60 becomes 182, or 120 when Indian income is above
 * ₹15 lakh. A citizen with Indian income above ₹15 lakh who pays tax
 * nowhere else is deemed resident. Residents who were non-resident in 9
 * of the last 10 years, or spent 729 days or fewer here in the last 7,
 * are "not ordinarily resident" and taxed only on Indian income.
 */
export function residency(opts: {
  days: number;
  daysLast4: number;
  indian: boolean;
  indianIncome: number;
  taxedAbroad: boolean;
  nrYearsOf10: number;
  daysLast7: number;
}) {
  const { days, daysLast4, indian, indianIncome, taxedAbroad, nrYearsOf10, daysLast7 } = opts;
  const highIncome = indianIncome > 1500000;
  const secondTest = indian ? (highIncome ? 120 : 182) : 60;

  const byDays = days >= 182 || (days >= secondTest && daysLast4 >= 365);
  const deemed = !byDays && indian && highIncome && !taxedAbroad;
  const via120 = byDays && days < 182 && indian && highIncome;

  let status: Residency = "NR";
  let reason = "";
  if (byDays) {
    const notOrdinarily = nrYearsOf10 >= 9 || daysLast7 <= 729 || via120;
    status = notOrdinarily ? "RNOR" : "ROR";
    reason =
      days >= 182
        ? `${days} days in India is 182 or more.`
        : `${days} days this year plus ${daysLast4} in the last four years.`;
    if (notOrdinarily) {
      reason += via120
        ? " Resident through the 120-day rule, which makes you not ordinarily resident."
        : nrYearsOf10 >= 9
          ? " You were non-resident in 9 of the last 10 years, so not ordinarily resident."
          : " You spent 729 days or fewer here in the last 7 years, so not ordinarily resident.";
    }
  } else if (deemed) {
    status = "RNOR";
    reason = "Indian income above ₹15 lakh and no tax paid where you live, so you are deemed resident.";
  } else {
    reason =
      days >= secondTest
        ? `Fewer than 365 days in India over the last four years, so ${days} days is not enough.`
        : secondTest === 182
          ? `${days} days is below 182.`
          : `${days} days is below both the 182-day test and the ${secondTest}-day test.`;
  }

  // Indian income only, under the new regime. Non-residents get no rebate.
  const tax = taxOnIncome(indianIncome, "new", status !== "NR");
  return { status, reason, secondTest, tax };
}

/**
 * Booking long-term equity gains each year up to the tax-free limit, and
 * buying straight back. The gain is the same; the tax on it later is not.
 */
export function taxHarvest(unrealised: number, booked: number, years: number) {
  const room = pos(LTCG_EQUITY_EXEMPT - booked);
  const book = Math.min(pos(unrealised), room);
  const savedNow = book * 0.125 * (1 + CESS);
  return { room, book, savedNow, savedOverYears: LTCG_EQUITY_EXEMPT * 0.125 * (1 + CESS) * years };
}

/** GST added to a price, or taken back out of one that includes it. */
export function gst(amount: number, ratePct: number, mode: "add" | "remove") {
  const base = mode === "add" ? amount : amount / (1 + ratePct / 100);
  const tax = base * (ratePct / 100);
  return { base, tax, total: base + tax };
}

/* ── Atal Pension Yojana ───────────────────────────────────────── */

/**
 * The official monthly contribution chart: one row per joining age, 18 to
 * 40, one column per pension of ₹1,000 to ₹5,000 a month.
 */
const APY_CHART: number[][] = [
  [42, 84, 126, 168, 210],
  [46, 92, 138, 183, 228],
  [50, 100, 150, 198, 248],
  [54, 108, 162, 215, 269],
  [59, 117, 177, 234, 292],
  [64, 127, 192, 254, 318],
  [70, 139, 208, 277, 346],
  [76, 151, 226, 301, 376],
  [82, 164, 246, 327, 409],
  [90, 178, 268, 356, 446],
  [97, 194, 292, 388, 485],
  [106, 212, 318, 423, 529],
  [116, 231, 347, 462, 577],
  [126, 252, 379, 504, 630],
  [138, 276, 414, 551, 689],
  [151, 302, 453, 602, 752],
  [165, 330, 495, 659, 824],
  [181, 362, 543, 722, 902],
  [198, 396, 594, 792, 990],
  [218, 436, 654, 870, 1087],
  [240, 480, 720, 957, 1196],
  [264, 528, 792, 1054, 1318],
  [291, 582, 873, 1164, 1454],
];

/** What the nominee gets back, per ₹1,000 of monthly pension. */
const APY_CORPUS_PER_1000 = 170000;

export function apy(age: number, pension: number) {
  const a = Math.min(40, Math.max(18, Math.round(age)));
  const col = Math.min(5, Math.max(1, Math.round(pension / 1000))) - 1;
  const monthly = APY_CHART[a - 18][col];
  const years = 60 - a;
  const paid = monthly * 12 * years;
  const corpus = (col + 1) * APY_CORPUS_PER_1000;
  // The same money in PPF instead, to show what the guarantee costs.
  const elsewhere = sip(monthly, years, PPF_RATE).future;
  return { monthly, years, paid, corpus, elsewhere, pension: (col + 1) * 1000 };
}

/* ── Returns on irregular money ────────────────────────────────── */

export type Flow = { date: string; amount: number };

/**
 * The yearly return on money that went in and out on different dates.
 * Payments in are negative and money back is positive, as in a
 * spreadsheet. Solved by bisection, which is slower than Newton's method
 * but cannot fly off on awkward cash flows.
 */
export function xirr(flows: Flow[]) {
  const dated = flows
    .map((f) => ({ t: new Date(f.date).getTime(), amount: f.amount }))
    .filter((f) => Number.isFinite(f.t) && f.amount !== 0);
  if (dated.length < 2 || !dated.some((f) => f.amount > 0) || !dated.some((f) => f.amount < 0)) return NaN;

  const t0 = Math.min(...dated.map((f) => f.t));
  const npv = (r: number) =>
    dated.reduce((sum, f) => sum + f.amount / Math.pow(1 + r, (f.t - t0) / (365 * 86400000)), 0);

  let lo = -0.9999;
  let hi = 10;
  if (npv(lo) * npv(hi) > 0) return NaN;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (npv(lo) * npv(mid) <= 0) hi = mid;
    else lo = mid;
  }
  return ((lo + hi) / 2) * 100;
}

/* ── Loans, in more detail ─────────────────────────────────────── */

/** Interest and principal paid in each year of a loan. */
export function amortise(principal: number, years: number, ratePct: number) {
  const { monthly, months } = emi(principal, years, ratePct);
  const i = monthlyRate(ratePct);
  const rows: { year: number; interest: number; principal: number; balance: number }[] = [];
  let balance = principal;
  for (let m = 0; m < months; m++) {
    if (m % 12 === 0) rows.push({ year: m / 12 + 1, interest: 0, principal: 0, balance });
    const interest = balance * i;
    const row = rows[rows.length - 1];
    row.interest += interest;
    row.principal += monthly - interest;
    balance -= monthly - interest;
    row.balance = pos(balance);
  }
  return rows;
}

/** Interest on a self-occupied home you can claim in the old regime. */
export const HOME_LOAN_INTEREST_CAP = 200000;

/** A home loan, with what the old regime gives back in the first year. */
export function homeLoan(opts: { price: number; downPct: number; years: number; ratePct: number; slabPct: number }) {
  const { price, downPct, years, ratePct, slabPct } = opts;
  const loan = price * (1 - downPct / 100);
  const e = emi(loan, years, ratePct);
  const first = amortise(loan, years, ratePct)[0];
  const deductible = Math.min(first.interest, HOME_LOAN_INTEREST_CAP) + Math.min(first.principal, PPF_MAX_YEARLY);
  const taxSaved = deductible * (slabPct / 100) * (1 + CESS);
  return { loan, ...e, first, taxSaved };
}

/**
 * A car loan. Dealers often quote a flat rate, charged on the whole
 * amount for the whole term even as you pay it down; this finds the
 * reducing rate that flat rate really is.
 */
export function carLoan(opts: { price: number; down: number; years: number; ratePct: number; flat: boolean }) {
  const { price, down, years, ratePct, flat } = opts;
  const loan = pos(price - down);
  const months = Math.round(years * 12);
  let monthly: number;
  let interest: number;
  if (flat) {
    interest = loan * (ratePct / 100) * years;
    monthly = (loan + interest) / months;
  } else {
    const e = emi(loan, years, ratePct);
    monthly = e.monthly;
    interest = e.interest;
  }
  // The reducing rate that gives this EMI.
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (emi(loan, years, mid).monthly < monthly) lo = mid;
    else hi = mid;
  }
  return { loan, monthly, interest, months, effectiveRate: flat ? (lo + hi) / 2 : ratePct };
}

/* ── Strategies ────────────────────────────────────────────────── */

/**
 * A SIP split between a cheap index core and a satellite of active or
 * thematic picks, against putting all of it in the core.
 */
export function coreSatellite(opts: {
  monthly: number;
  years: number;
  corePct: number;
  coreReturn: number;
  satelliteReturn: number;
}) {
  const { monthly, years, corePct, coreReturn, satelliteReturn } = opts;
  const core = sip(monthly * (corePct / 100), years, coreReturn).future;
  const satellite = sip(monthly * (1 - corePct / 100), years, satelliteReturn).future;
  const allCore = sip(monthly, years, coreReturn).future;
  return { core, satellite, total: core + satellite, allCore, difference: core + satellite - allCore };
}

/**
 * Splitting a retirement corpus into three buckets: cash for the next
 * few years, steady debt for the years after, and equity for the rest,
 * which has a decade to grow before it is needed.
 */
export function threeBuckets(opts: {
  corpus: number;
  monthlySpend: number;
  inflationPct: number;
  cashYears: number;
  debtYears: number;
  debtReturn: number;
  equityReturn: number;
}) {
  const { corpus, monthlySpend, inflationPct, cashYears, debtYears, debtReturn, equityReturn } = opts;
  const yearSpend = (y: number) => monthlySpend * 12 * Math.pow(1 + inflationPct / 100, y);
  let cash = 0;
  for (let y = 0; y < cashYears; y++) cash += yearSpend(y);
  let debt = 0;
  for (let y = cashYears; y < cashYears + debtYears; y++) {
    debt += yearSpend(y) / Math.pow(1 + debtReturn / 100, y - cashYears + 1);
  }
  const equity = corpus - cash - debt;
  const untouched = cashYears + debtYears;
  return {
    cash,
    debt,
    equity,
    enough: equity > 0,
    untouched,
    equityLater: pos(equity) * Math.pow(1 + equityReturn / 100, untouched),
  };
}

/**
 * Buying and leaving it, against switching to something else every few
 * months. Each switch pays tax on the gain so far plus costs, so less is
 * left compounding; the holder pays tax once, at the end. Switching
 * within a year is short-term, at 20%. The ₹1.25 lakh yearly exemption is
 * left out of both, since it is shared with everything else you sell.
 */
export function coffeeCan(opts: { amount: number; years: number; ratePct: number; costPct: number; switchMonths: number }) {
  const { amount, years, ratePct, costPct, switchMonths } = opts;
  const taxRate = (switchMonths > 12 ? 0.125 : 0.2) * (1 + CESS);

  const held = amount * Math.pow(1 + ratePct / 100, years);
  const heldAfterTax = held - pos(held - amount) * 0.125 * (1 + CESS);

  const rounds = Math.floor((years * 12) / switchMonths);
  const perRound = Math.pow(1 + ratePct / 100, switchMonths / 12);
  let churned = amount;
  let taxPaid = 0;
  let costs = 0;
  for (let i = 0; i < rounds; i++) {
    const grown = churned * perRound;
    const tax = pos(grown - churned) * taxRate;
    const cost = grown * (costPct / 100);
    taxPaid += tax;
    costs += cost;
    churned = grown - tax - cost;
  }
  // Any months left over after the last switch just grow, then pay tax on exit.
  const tail = Math.pow(1 + ratePct / 100, (years * 12 - rounds * switchMonths) / 12);
  const end = churned * tail;
  const churnedAfterTax = end - pos(end - churned) * taxRate;
  return { held, heldAfterTax, churned: churnedAfterTax, taxPaid, costs, gap: heldAfterTax - churnedAfterTax, rounds };
}

/**
 * A factor (smart beta) index fund against a plain index fund. Returns
 * are before costs; the factor fund has to beat the plain index by more
 * than the extra it charges just to break even.
 */
export function factorVsIndex(opts: {
  monthly: number;
  years: number;
  indexReturn: number;
  indexCost: number;
  factorEdge: number;
  factorCost: number;
}) {
  const { monthly, years, indexReturn, indexCost, factorEdge, factorCost } = opts;
  const plain = sip(monthly, years, indexReturn - indexCost).future;
  const factor = sip(monthly, years, indexReturn + factorEdge - factorCost).future;
  return { plain, factor, difference: factor - plain, breakEvenEdge: factorCost - indexCost };
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
