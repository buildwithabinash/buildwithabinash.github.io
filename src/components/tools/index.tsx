"use client";

import { useState } from "react";
import * as money from "@/lib/money";
import {
  ADVANCE_TAX_YEAR,
  EPF_RATE,
  EPF_WAGE_CEILING,
  PPF_MAX_YEARLY,
  PPF_RATE,
  PPF_YEARS,
  SMALL_SAVINGS_CHECKED,
  SSY_MAX_YEARLY,
  SSY_RATE,
  TAX_CHECKED,
  TAX_YEAR,
  rupees,
  rupeesShort,
  yearsAndMonths,
} from "@/lib/money";
import type { ToolSlug } from "@/lib/tools";
import { Choice, Compare, Field, HowItWorks, Panel, Picks, Result, TextField } from "./ui";

/* ── Step 1: what you earn ─────────────────────────────────────── */

function TakeHomeSalary() {
  const [period, setPeriod] = useState<"year" | "month">("year");
  const [amount, setAmount] = useState(1200000);
  const [basicPct, setBasicPct] = useState(50);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [deductions, setDeductions] = useState(150000);
  const [pfBase, setPfBase] = useState<money.PfBase>("basic");
  const [profTax, setProfTax] = useState(2400);

  const yearly = period === "year";
  const ctc = yearly ? amount : amount * 12;
  const r = money.takeHome(ctc, basicPct, regime, deductions, pfBase, profTax);

  // Carry the figure across when the period switches, so the number on
  // screen still means something.
  const switchTo = (p: "year" | "month") => {
    if (p === period) return;
    setAmount(p === "month" ? Math.round(amount / 12000) * 1000 : Math.round((amount * 12) / 10000) * 10000);
    setPeriod(p);
  };

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Your CTC, a year", value: rupees(ctc) },
            { op: "−", label: "Employer's PF and gratuity", value: rupees(r.employerPf + r.gratuity) },
            { op: "=", label: "Gross pay", value: rupees(r.gross) },
            { op: "−", label: "Your PF", value: rupees(r.employeePf) },
            { op: "−", label: "Professional tax", value: rupees(r.professionalTax) },
            { op: "−", label: "Income tax", value: rupees(r.tax) },
            { op: "=", label: "Take-home, a year", value: rupees(r.annual) },
            { op: "÷", label: "12, so a month", value: rupees(r.perMonth) },
          ]}
        />
      }
      inputs={
        <>
          <Choice
            label="I know my CTC as"
            value={period}
            set={switchTo}
            options={[
              { value: "year", label: "A year" },
              { value: "month", label: "A month" },
            ]}
          />
          <Field
            label={yearly ? "My CTC, a year" : "My CTC, a month"}
            presets={yearly ? [600000, 1000000, 1500000, 2500000] : [50000, 80000, 125000, 200000]}
            value={amount}
            set={setAmount}
            min={yearly ? 200000 : 15000}
            max={yearly ? 10000000 : 850000}
            step={yearly ? 10000 : 1000}
            prefix="₹"
            hint={yearly ? undefined : `That is ${rupees(ctc)} a year.`}
          />
          <Field
            label="Basic pay is"
            presets={[40, 45, 50]}
            value={basicPct}
            set={setBasicPct}
            min={30}
            max={60}
            suffix="% of CTC"
            hint="Look at your slip. Most companies set basic between 40% and 50%."
          />
          <Choice
            label="PF is worked out on"
            value={pfBase}
            set={setPfBase}
            options={[
              { value: "basic", label: "Full basic" },
              { value: "ceiling", label: `${rupees(EPF_WAGE_CEILING)} ceiling` },
            ]}
          />
          <p className="-mt-3 text-[13px] leading-relaxed text-muted">
            12% either way, but of different amounts. Plenty of employers stop at the statutory wage of{" "}
            {rupees(EPF_WAGE_CEILING)} a month, which caps PF at {rupees(EPF_WAGE_CEILING * 0.12)}. Your slip will say.
          </p>
          <Field
            label="Professional tax, a year"
            value={profTax}
            set={setProfTax}
            min={0}
            max={2500}
            step={100}
            prefix="₹"
            hint="Set by your state, not the centre. Around ₹2,400 in Karnataka and Maharashtra, nil in Delhi, Haryana and a few others."
          />
          <Choice
            label="Tax regime"
            value={regime}
            set={setRegime}
            options={[
              { value: "new", label: "New" },
              { value: "old", label: "Old" },
            ]}
          />
          {regime === "old" && (
            <Field label="Deductions I claim" value={deductions} set={setDeductions} min={0} max={500000} step={10000} prefix="₹" />
          )}

          {/* The income tax row below comes off the statutory slabs, so say
              which year's, the same as the regime comparison does. Slabs move
              with each Budget and an undated figure quietly goes wrong. */}
          <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
            Slabs for {TAX_YEAR}, last checked {TAX_CHECKED}. For someone under 60, on salary income.
          </p>
        </>
      }
      result={
        <Result
          caption="Lands in your account"
          headline={rupees(r.perMonth)}
          sub={`A month, from a ${rupeesShort(ctc)} CTC. Over a year that is ${rupees(r.annual)}.`}
          rows={[
            { label: "Gross, a month", value: rupees(r.gross / 12) },
            { label: "Your PF", value: `− ${rupees(r.employeePf / 12)}` },
            { label: "Professional tax", value: `− ${rupees(r.professionalTax / 12)}` },
            { label: "Income tax", value: `− ${rupees(r.tax / 12)}` },
            { label: "Take-home, a month", value: rupees(r.perMonth) },
            { label: "Take-home, a year", value: rupees(r.annual) },
          ]}
        />
      }
    />
  );
}

function TaxRegime() {
  const [salary, setSalary] = useState(1500000);
  const [d, setD] = useState<money.Deductions>({ ...money.noDeductions, s80C: 150000, s80D: 25000 });
  const c = money.compareRegimes(salary, d);
  const newWins = c.better === "new";
  const w = newWins ? c.newRegime : c.oldRegime;
  const caps = money.DEDUCTION_CAPS;
  const on = (k: keyof money.Deductions) => (v: number) => setD((prev) => ({ ...prev, [k]: v }));

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Salary", value: rupees(salary) },
            { op: "−", label: newWins ? "Standard deduction, employer NPS" : "Standard deduction, your claims", value: rupees(salary - w.taxable) },
            { op: "=", label: "Taxable income", value: rupees(w.taxable) },
            { op: "→", label: "Tax from the slabs", value: rupees(w.beforeRebate) },
            { op: "−", label: "Rebate and relief", value: rupees(w.beforeRebate - (w.total - w.surcharge - w.cess)) },
            { op: "+", label: "Surcharge and 4% cess", value: rupees(w.surcharge + w.cess) },
            { op: "=", label: `Tax, ${newWins ? "new" : "old"} regime`, value: rupees(w.total) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="My salary, a year" presets={[800000, 1200000, 1500000, 2000000, 3000000]} value={salary} set={setSalary} min={300000} max={10000000} step={25000} prefix="₹" />

          <p className="kicker border-t border-line pt-6 text-green">What I would claim</p>

          <Field
            label="80C"
            value={d.s80C}
            set={on("s80C")}
            min={0}
            max={caps.s80C}
            step={5000}
            prefix="₹"
            hint={`PF, ELSS, life insurance, PPF, home loan principal, tuition fees. Capped at ${rupees(caps.s80C)} however much you put in.`}
          />
          <Field
            label="80D, health premiums"
            value={d.s80D}
            set={on("s80D")}
            min={0}
            max={caps.s80D}
            step={1000}
            prefix="₹"
            hint={`${rupees(25000)} for you and your family, another ${rupees(50000)} if you pay for parents over 60.`}
          />
          <Field
            label="HRA exemption"
            value={d.hra}
            set={on("hra")}
            min={0}
            max={600000}
            step={5000}
            prefix="₹"
            hint="Not your whole HRA. It is the lowest of the three HRA rules, and it is zero if you do not pay rent."
          />
          <Field
            label="NPS, 80CCD(1B)"
            value={d.nps}
            set={on("nps")}
            min={0}
            max={caps.nps}
            step={5000}
            prefix="₹"
            hint={`Up to ${rupees(caps.nps)}, on top of 80C.`}
          />
          <Field
            label="Home loan interest"
            value={d.homeLoan}
            set={on("homeLoan")}
            min={0}
            max={caps.homeLoan}
            step={10000}
            prefix="₹"
            hint={`Section 24(b), capped at ${rupees(caps.homeLoan)} on a home you live in.`}
          />
          <Field
            label="Employer's NPS, 80CCD(2)"
            value={d.employerNps}
            set={on("employerNps")}
            min={0}
            max={500000}
            step={5000}
            prefix="₹"
            hint="The one deduction both regimes allow, so it comes off either way. Only counts if your employer actually pays into NPS for you."
          />

          <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
            Slabs for {TAX_YEAR}, last checked {TAX_CHECKED}. For someone under 60, on salary income.
          </p>
        </>
      }
      result={
        <Compare
          verdict={newWins ? "The new regime." : "The old regime."}
          detail={
            c.saving < 1
              ? "They cost you the same. Take the new one for the simpler paperwork."
              : newWins
                ? `It saves you ${rupees(c.saving)} a year. You are claiming ${rupees(c.claimed)}; the old regime only catches up at about ${rupees(breakEvenDeductions(salary - d.employerNps))}.`
                : `It saves you ${rupees(c.saving)} a year, because you claim ${rupees(c.claimed)}. Stop claiming any of it and the new regime wins again.`
          }
          left={{
            title: "New regime",
            value: rupees(c.newRegime.total),
            won: newWins,
            rows: [
              { label: "Taxable income", value: rupees(c.newRegime.taxable) },
              { label: "Deductions allowed", value: rupees(d.employerNps) },
              { label: "Rebate", value: rupees(c.newRegime.rebate) },
            ],
          }}
          right={{
            title: "Old regime",
            value: rupees(c.oldRegime.total),
            won: !newWins,
            rows: [
              { label: "Taxable income", value: rupees(c.oldRegime.taxable) },
              { label: "Deductions allowed", value: rupees(c.claimed + d.employerNps) },
              { label: "Rebate", value: rupees(c.oldRegime.rebate) },
            ],
          }}
        />
      }
    />
  );
}

/** Roughly what the old regime needs claimed before it wins. */
function breakEvenDeductions(salary: number) {
  const target = money.incomeTax(salary, "new").total;
  for (let d = 0; d <= 1000000; d += 5000) {
    if (money.incomeTax(salary, "old", d).total <= target) return d;
  }
  return 1000000;
}

/* ── Step 2: the safety net ────────────────────────────────────── */

function EmergencyFund() {
  const [expenses, setExpenses] = useState(40000);
  const [months, setMonths] = useState(6);
  const [saved, setSaved] = useState(50000);
  const [saving, setSaving] = useState(10000);
  const r = money.emergencyFund(expenses, months, saved, saving);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You spend a month", value: rupees(expenses) },
            { op: "×", label: "Months to cover", value: `${months}` },
            { op: "=", label: "The fund you need", value: rupees(r.target) },
            { op: "−", label: "Already set aside", value: rupees(Math.min(saved, r.target)) },
            { op: "=", label: "Still to save", value: rupees(r.short) },
            ...(r.done ? [] : [{ op: "÷" as const, label: `${rupees(saving)} a month, so`, value: yearsAndMonths(r.monthsToGo) }]),
          ]}
        />
      }
      inputs={
        <>
          <Field label="I spend each month" presets={[20000, 40000, 60000, 100000]} value={expenses} set={setExpenses} min={5000} max={300000} step={1000} prefix="₹" />
          <Field
            label="Months I want covered"
            presets={[3, 6, 9, 12]}
            value={months}
            set={setMonths}
            min={1}
            max={12}
            suffix="mo"
            hint="Three if your income is steady and secure. Six or more if it is not, or if others depend on it."
          />
          <Field label="I have set aside" value={saved} set={setSaved} min={0} max={5000000} step={5000} prefix="₹" />
          <Field label="I can add each month" value={saving} set={setSaving} min={0} max={200000} step={1000} prefix="₹" />
        </>
      }
      result={
        <Result
          caption="Your fund should be"
          headline={rupeesShort(r.target)}
          sub={
            r.done
              ? "You are there. Leave it alone and move to the next step."
              : `You are ${rupees(r.short)} short. At this pace that is ${yearsAndMonths(r.monthsToGo)} away.`
          }
          split={r.done ? undefined : { aLabel: "Already saved", a: saved, bLabel: "Still to go", b: r.short }}
          rows={[
            { label: "Target", value: rupees(r.target) },
            { label: "Still to go", value: rupees(r.short) },
            { label: "Time to get there", value: r.done ? "Done" : yearsAndMonths(r.monthsToGo) },
          ]}
        />
      }
    />
  );
}

/* ── Step 3: protection ────────────────────────────────────────── */

function TermCover() {
  const [expenses, setExpenses] = useState(40000);
  const [years, setYears] = useState(20);
  const [loans, setLoans] = useState(2000000);
  const [goals, setGoals] = useState(2000000);
  const [savings, setSavings] = useState(500000);
  const [cover, setCover] = useState(0);
  const r = money.termCover({
    monthlyExpenses: expenses,
    yearsOfSupport: years,
    loans,
    futureGoals: goals,
    savings,
    existingCover: cover,
  });

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: `Spending for ${years} years`, value: rupees(r.replaceIncome) },
            { op: "+", label: "Loans outstanding", value: rupees(loans) },
            { op: "+", label: "Big things still to pay for", value: rupees(goals) },
            { op: "=", label: "What your family would need", value: rupees(r.need) },
            { op: "−", label: "Savings and cover you have", value: rupees(r.have) },
            { op: "=", label: "Cover you are short by", value: rupees(r.gap) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Household spends each month" presets={[30000, 50000, 80000, 120000]} value={expenses} set={setExpenses} min={5000} max={300000} step={1000} prefix="₹" />
          <Field
            label="Years they would need support"
            value={years}
            set={setYears}
            min={1}
            max={40}
            suffix="yrs"
            hint="Until the youngest dependant can earn, or your partner reaches retirement."
          />
          <Field label="Loans outstanding" value={loans} set={setLoans} min={0} max={50000000} step={100000} prefix="₹" />
          <Field label="Big things still to pay for" value={goals} set={setGoals} min={0} max={50000000} step={100000} prefix="₹" />
          <Field label="Savings and investments" value={savings} set={setSavings} min={0} max={50000000} step={100000} prefix="₹" />
          <Field label="Cover I already have" value={cover} set={setCover} min={0} max={50000000} step={500000} prefix="₹" />
        </>
      }
      result={
        <Result
          caption="Cover you are short by"
          headline={rupeesShort(r.gap)}
          sub={
            r.gap === 0
              ? "What you have already covers it."
              : `Term cover is the cheap kind. It pays only if you die, which is why ${rupeesShort(r.gap)} of it costs so little.`
          }
          rows={[
            { label: "Replacing income", value: rupees(r.replaceIncome) },
            { label: "Total needed", value: rupees(r.need) },
            { label: "Already covered", value: rupees(r.have) },
            { label: "The gap", value: rupees(r.gap) },
          ]}
        />
      }
    />
  );
}

/* ── Step 4: what you owe ──────────────────────────────────────── */

function EmiCalculator() {
  const [amount, setAmount] = useState(1000000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(9);
  const r = money.emi(amount, years, rate);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You borrow", value: rupees(amount) },
            { op: "+", label: `Interest at ${rate}% for ${years} yrs`, value: rupees(r.interest) },
            { op: "=", label: "You repay in all", value: rupees(r.total) },
            { op: "÷", label: `${r.months} months, so each EMI`, value: rupees(r.monthly) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I borrow" presets={[100000, 500000, 1000000, 2500000, 5000000]} value={amount} set={setAmount} min={10000} max={20000000} step={10000} prefix="₹" />
          <Field label="Over" presets={[3, 5, 10, 15, 20]} value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="Interest rate" presets={[8, 9, 10, 12, 15]} value={rate} set={setRate} min={1} max={24} step={0.1} suffix="%" />
        </>
      }
      result={
        <Result
          caption="Every month you pay"
          headline={rupees(r.monthly)}
          sub={`Over ${r.months} payments you hand over ${rupees(r.interest)} in interest.`}
          split={{
            aLabel: "What you borrowed",
            a: amount,
            bLabel: "Interest",
            b: r.interest,
            byYear: money.amortise(amount, years, rate).map((y) => ({ a: y.principal, b: y.interest })),
            yearLabels: ["Loan repaid", "Interest"],
          }}
          rows={[
            { label: "Monthly instalment", value: rupees(r.monthly) },
            { label: "Total interest", value: rupees(r.interest) },
            { label: "Total you repay", value: rupees(r.total) },
          ]}
        />
      }
    />
  );
}

function CreditCardPayoff() {
  const [balance, setBalance] = useState(100000);
  const [rate, setRate] = useState(42);
  const [payment, setPayment] = useState(5000);
  const [minPct, setMinPct] = useState(5);
  const r = money.payoff(balance, rate, payment);
  const min = money.minimumOnly(balance, rate, minPct);

  return (
    <Panel
      how={
        r.never ? (
          <HowItWorks
            note="Your payment does not cover the interest, so the balance never falls."
            steps={[
              { label: "Balance on the card", value: rupees(balance) },
              { op: "×", label: `${rate}% a year adds, each month`, value: rupees((balance * rate) / 1200) },
              { op: "→", label: "You pay each month", value: rupees(payment) },
              { op: "=", label: "Paid off", value: "Never" },
            ]}
          />
        ) : (
          <HowItWorks
            steps={[
              { label: "Balance on the card", value: rupees(balance) },
              { op: "+", label: "Interest while you pay it off", value: rupees(r.interest) },
              { op: "=", label: "You pay in all", value: rupees(r.total) },
              { op: "÷", label: `${rupees(payment)} a month, so`, value: yearsAndMonths(r.months) },
            ]}
          />
        )
      }
      inputs={
        <>
          <Field label="Balance on the card" presets={[25000, 50000, 100000, 200000]} value={balance} set={setBalance} min={1000} max={2000000} step={1000} prefix="₹" />
          <Field
            label="Interest rate"
            value={rate}
            set={setRate}
            min={12}
            max={50}
            step={0.5}
            suffix="%"
            hint="Cards quote 3–4% a month. That is 36–48% a year."
          />
          <Field label="I pay each month" value={payment} set={setPayment} min={500} max={200000} step={500} prefix="₹" />
          <Field
            label="The card's minimum due is"
            value={minPct}
            set={setMinPct}
            min={1}
            max={10}
            step={0.5}
            suffix="% of balance"
            hint="Shown below so you can see what paying only the minimum would cost instead."
          />
        </>
      }
      result={
        r.never ? (
          <Result
            tone="rose"
            caption="This never clears"
            headline="Never"
            sub="Your payment is smaller than the interest charged each month, so the balance grows no matter how long you keep paying. Raise the payment."
            rows={[{ label: "Interest charged monthly", value: rupees((balance * rate) / 100 / 12) }]}
          />
        ) : (
          <Result
            caption="Clear in"
            headline={yearsAndMonths(r.months)}
            sub={`Along the way you pay ${rupees(r.interest)} in interest on a ${rupees(balance)} balance.`}
            split={{ aLabel: "The balance", a: balance, bLabel: "Interest", b: r.interest }}
            rows={[
              { label: "Months to clear", value: String(r.months) },
              { label: "Interest paid", value: rupees(r.interest) },
              { label: "Total paid", value: rupees(r.total) },
              {
                label: `If you paid only the ${minPct}% minimum`,
                value: min.never ? "Never clears" : yearsAndMonths(min.months),
              },
              {
                label: "Interest that way",
                value: min.never ? "—" : rupees(min.interest),
              },
            ]}
          />
        )
      }
    />
  );
}

function LoanPrepayment() {
  const [outstanding, setOutstanding] = useState(2500000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(18);
  const [extra, setExtra] = useState(5000);
  const [lump, setLump] = useState(0);
  const r = money.prepay(outstanding, rate, years, extra, lump);

  return (
    <Panel
      how={
        <HowItWorks
          note={r.monthsSaved > 0 ? `And the loan ends ${yearsAndMonths(r.monthsSaved)} sooner.` : undefined}
          steps={[
            { label: "Interest, as things are", value: rupees(r.baseInterest) },
            { op: "−", label: "Interest if you pay extra", value: rupees(r.newInterest) },
            { op: "=", label: "Interest you save", value: rupees(r.interestSaved) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Still owed" value={outstanding} set={setOutstanding} min={50000} max={20000000} step={50000} prefix="₹" />
          <Field label="Interest rate" value={rate} set={setRate} min={1} max={24} step={0.1} suffix="%" />
          <Field label="Years left" value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="Extra I pay each month" presets={[2000, 5000, 10000, 20000]} value={extra} set={setExtra} min={0} max={200000} step={500} prefix="₹" />
          <Field
            label="One-off amount I pay now"
            value={lump}
            set={setLump}
            min={0}
            max={Math.max(50000, outstanding)}
            step={25000}
            prefix="₹"
            hint="A bonus or maturity amount put straight against the principal. Early in a loan this does far more than later."
          />
        </>
      }
      result={
        <Result
          caption="Interest you save"
          headline={rupeesShort(r.interestSaved)}
          sub={
            r.monthsSaved > 0
              ? `Clears the loan ${yearsAndMonths(r.monthsSaved)} early${lump > 0 ? `, with ${rupees(lump)} up front` : ""}.`
              : "Add an extra payment or a one-off amount to see the effect."
          }
          rows={[
            { label: "Your EMI now", value: rupees(r.emi) },
            { label: "Interest as it stands", value: rupees(r.baseInterest) },
            { label: "Interest if you pay extra", value: rupees(r.newInterest) },
            { label: "Time saved", value: r.monthsSaved > 0 ? yearsAndMonths(r.monthsSaved) : "—" },
          ]}
        />
      }
    />
  );
}

/* ── Step 5: big purchases ─────────────────────────────────────── */

function RentVsBuy() {
  const [price, setPrice] = useState(8000000);
  const [rent, setRent] = useState(25000);
  const [downPct, setDownPct] = useState(20);
  const [loanRate, setLoanRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [appreciation, setAppreciation] = useState(6);
  const [returnPct, setReturnPct] = useState(12);
  const [rentRise, setRentRise] = useState(7);
  const [maintenance, setMaintenance] = useState(1);
  const [buyingCosts, setBuyingCosts] = useState(7);

  const r = money.rentVsBuy({
    price,
    downPct,
    loanRatePct: loanRate,
    loanYears: 20,
    rent,
    rentRisePct: rentRise,
    appreciationPct: appreciation,
    returnPct,
    maintenancePct: maintenance,
    years,
    buyingCostsPct: buyingCosts,
  });
  const buyWins = r.better === "buy";

  return (
    <Panel
      how={
        <Picks
          rule={`What each leaves you with after ${years} years`}
          pick="max"
          options={[
            { label: "Buy", value: r.buyerWorth, detail: `A home worth ${rupeesShort(r.houseValue)}, less ${rupeesShort(r.owed)} still owed` },
            { label: "Rent and invest", value: r.renterWorth, detail: "The down payment and the monthly difference, invested" },
          ]}
        />
      }
      inputs={
        <>
          <Field label="The place costs" value={price} set={setPrice} min={1000000} max={100000000} step={500000} prefix="₹" />
          <Field label="Renting it costs" value={rent} set={setRent} min={3000} max={500000} step={1000} prefix="₹" suffix="/mo" />
          <Field label="I put down" value={downPct} set={setDownPct} min={10} max={100} suffix="%" />
          <Field label="Home loan rate" value={loanRate} set={setLoanRate} min={5} max={15} step={0.1} suffix="%" />
          <Field label="I stay" value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field
            label="Property rises"
            value={appreciation}
            set={setAppreciation}
            min={0}
            max={15}
            step={0.5}
            suffix="%/yr"
            hint="This is the number everyone guesses high. Over long periods Indian housing has often trailed equity."
          />
          <Field label="Investments return" value={returnPct} set={setReturnPct} min={1} max={20} step={0.5} suffix="%/yr" />
          <Field label="Rent rises" value={rentRise} set={setRentRise} min={0} max={15} step={0.5} suffix="%/yr" />
          <Field
            label="Upkeep and society dues"
            value={maintenance}
            set={setMaintenance}
            min={0}
            max={4}
            step={0.25}
            suffix="% of price/yr"
            hint="Repairs, society charges and property tax. A landlord pays these, you would not."
          />
          <Field
            label="Stamp duty and registration"
            value={buyingCosts}
            set={setBuyingCosts}
            min={0}
            max={15}
            step={0.5}
            suffix="% of price"
            hint="Paid once, to the state, and never recovered. Usually 5–8% depending on where you buy."
          />
        </>
      }
      result={
        <Compare
          verdict={buyWins ? "Buying, at these numbers." : "Renting, at these numbers."}
          detail={`After ${years} years you would be about ${rupeesShort(r.difference)} better off. Change the rate property rises at and the answer often flips, which tells you how much that one guess decides.`}
          left={{
            title: "Buy",
            value: rupeesShort(r.buyerWorth),
            won: buyWins,
            rows: [
              { label: "EMI", value: rupees(r.emi) },
              { label: "Place worth", value: rupeesShort(r.houseValue) },
              { label: "Still owed", value: rupeesShort(r.owed) },
              { label: "Interest paid", value: rupeesShort(r.interestPaid) },
              { label: "Stamp duty etc", value: rupeesShort(r.buyingCosts) },
            ],
          }}
          right={{
            title: "Rent and invest",
            value: rupeesShort(r.renterWorth),
            won: !buyWins,
            rows: [
              { label: "Rent paid", value: rupeesShort(r.rentPaid) },
              { label: "Portfolio", value: rupeesShort(r.renterWorth) },
            ],
          }}
        />
      }
    />
  );
}

/* ── Step 6: investing ─────────────────────────────────────────── */

function SipCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const r = money.sip(monthly, years, rate);
  const real = money.realValue(r.future, years, 6);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Every month", value: rupees(monthly) },
            { op: "×", label: `${years * 12} months, you put in`, value: rupees(r.invested) },
            { op: "+", label: `Growth at ${rate}%`, value: rupees(r.gain) },
            { op: "=", label: "You end up with", value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Every month I invest" presets={[1000, 2500, 5000, 10000, 25000]} value={monthly} set={setMonthly} min={500} max={200000} step={500} prefix="₹" />
          <Field label="For" presets={[5, 10, 15, 20, 25]} value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field
            label="Expected return"
            presets={[8, 10, 12, 14]}
            value={rate}
            set={setRate}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
            hint="Equity funds have historically done 10–13% over long periods. Nothing guarantees it."
          />
        </>
      }
      result={
        <Result
          caption="After that time"
          headline={rupeesShort(r.future)}
          sub={`${rupees(r.invested)} of your money, ${rupees(r.gain)} from growth.`}
          split={{
            aLabel: "You put in",
            a: r.invested,
            bLabel: "Growth",
            b: r.gain,
            byYear: Array.from({ length: Math.round(years) }, (_, i) => {
              const y = money.sip(monthly, i + 1, rate);
              return { a: y.invested, b: y.gain };
            }),
          }}
          rows={[
            { label: "You put in", value: rupees(r.invested) },
            { label: "Growth adds", value: rupees(r.gain) },
            { label: "You end up with", value: rupees(r.future) },
            { label: "Worth in today’s money", value: rupeesShort(real) },
          ]}
        />
      }
    />
  );
}

function StepUpSip() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [step, setStep] = useState(10);
  const r = money.stepUpSip(monthly, years, rate, step);
  const flat = money.sip(monthly, years, rate);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "The first month", value: rupees(monthly) },
            { op: "→", label: `Up ${step}% a year, the last month`, value: rupees(r.finalMonthly / (1 + step / 100)) },
            { op: "=", label: "You put in", value: rupees(r.invested) },
            { op: "+", label: `Growth at ${rate}%`, value: rupees(r.gain) },
            { op: "=", label: "You end up with", value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Starting each month with" presets={[1000, 5000, 10000, 25000]} value={monthly} set={setMonthly} min={500} max={200000} step={500} prefix="₹" />
          <Field
            label="Raised every year by"
            presets={[5, 10, 15]}
            value={step}
            set={setStep}
            min={0}
            max={25}
            suffix="%"
            hint="Match it to your raise. Even 10% a year changes the ending enormously."
          />
          <Field label="For" presets={[10, 15, 20, 25]} value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="Expected return" presets={[8, 10, 12, 14]} value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
        </>
      }
      result={
        <Result
          caption="After that time"
          headline={rupeesShort(r.future)}
          sub={`Against ${rupeesShort(flat.future)} if you never raised it. By the last year you would be investing ${rupees(r.finalMonthly)} a month.`}
          split={{
            aLabel: "You put in",
            a: r.invested,
            bLabel: "Growth",
            b: r.gain,
            byYear: Array.from({ length: Math.round(years) }, (_, i) => {
              const y = money.stepUpSip(monthly, i + 1, rate, step);
              return { a: y.invested, b: y.gain };
            }),
          }}
          rows={[
            { label: "You put in", value: rupees(r.invested) },
            { label: "Growth adds", value: rupees(r.gain) },
            { label: "Without raising it", value: rupeesShort(flat.future) },
            { label: "The difference", value: rupeesShort(r.future - flat.future) },
          ]}
        />
      }
    />
  );
}

function GoalPlanner() {
  const [target, setTarget] = useState(2000000);
  const [years, setYears] = useState(7);
  const [rate, setRate] = useState(12);
  const [have, setHave] = useState(0);
  const [inflationPct, setInflationPct] = useState(6);
  // What the goal will actually cost by the time you get there.
  const futureTarget = target * Math.pow(1 + inflationPct / 100, years);
  const r = money.goalSip(futureTarget, years, rate, have);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "The goal, in today's money", value: rupees(target) },
            { op: "+", label: `${inflationPct}% inflation for ${years} yrs`, value: rupees(futureTarget - target) },
            { op: "=", label: "The goal, when you need it", value: rupees(futureTarget) },
            { op: "−", label: "What you have grows to", value: rupees(r.fromExisting) },
            { op: "=", label: "Still to build", value: rupees(r.needed) },
            { op: "→", label: `Over ${years * 12} months at ${rate}%`, value: `${rupees(r.perMonth)}/mo` },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I need" presets={[500000, 1000000, 2500000, 5000000, 10000000]} value={target} set={setTarget} min={50000} max={100000000} step={50000} prefix="₹" />
          <Field label="In" presets={[3, 5, 10, 15]} value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="I have towards it" value={have} set={setHave} min={0} max={50000000} step={10000} prefix="₹" />
          <Field
            label="Expected return"
            presets={[8, 10, 12]}
            value={rate}
            set={setRate}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
            hint="For goals under five years, use something safe and a lower number. Equity needs time."
          />
          <Field
            label="Costs rise by"
            value={inflationPct}
            set={setInflationPct}
            min={0}
            max={15}
            step={0.5}
            suffix="%/yr"
            hint="A goal priced today costs more by the time you reach it. Set this to zero if your target is already a future figure."
          />
        </>
      }
      result={
        <Result
          caption="Invest every month"
          headline={rupees(r.perMonth)}
          sub={
            inflationPct > 0
              ? `${rupeesShort(target)} today will cost about ${rupeesShort(futureTarget)} in ${years} years. That is the number this aims at.`
              : `Over ${years} years you would put in ${rupeesShort(r.invested)} to reach ${rupeesShort(target)}.`
          }
          rows={[
            { label: "Monthly amount", value: rupees(r.perMonth) },
            { label: "What it will really cost", value: rupees(futureTarget) },
            ...(have > 0 ? [{ label: "What you have grows to", value: rupees(r.fromExisting) }] : []),
            { label: "You would put in", value: rupees(r.invested) },
          ]}
        />
      }
    />
  );
}

function LumpsumCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const r = money.lumpsum(amount, years, rate);
  const real = money.realValue(r.future, years, 6);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You invest once", value: rupees(amount) },
            { op: "+", label: `Growth at ${rate}% for ${years} yrs`, value: rupees(r.gain) },
            { op: "=", label: `You end up with, ${(r.future / r.invested).toFixed(1)}×`, value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I invest once" presets={[50000, 100000, 500000, 1000000]} value={amount} set={setAmount} min={1000} max={10000000} step={1000} prefix="₹" />
          <Field label="And leave it for" presets={[5, 10, 15, 20]} value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="Expected return" presets={[8, 10, 12, 14]} value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
        </>
      }
      result={
        <Result
          caption="It becomes"
          headline={rupeesShort(r.future)}
          sub={`That is ${(r.future / r.invested).toFixed(1)}× what you started with, worth about ${rupeesShort(real)} in today’s money.`}
          split={{
            aLabel: "You put in",
            a: r.invested,
            bLabel: "Growth",
            b: r.gain,
            byYear: Array.from({ length: Math.round(years) }, (_, i) => {
              const y = money.lumpsum(amount, i + 1, rate);
              return { a: y.invested, b: y.gain };
            }),
          }}
          rows={[
            { label: "You put in", value: rupees(r.invested) },
            { label: "Growth adds", value: rupees(r.gain) },
            { label: "You end up with", value: rupees(r.future) },
          ]}
        />
      }
    />
  );
}

function FdCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);
  const [slab, setSlab] = useState(30);
  const r = money.fd(amount, years, rate);
  const taxed = money.afterTax(r.gain, slab);
  const afterInflation = money.realValue(r.invested + taxed.net, years, 6);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You deposit", value: rupees(amount) },
            { op: "+", label: `Interest at ${rate}%`, value: rupees(r.gain) },
            { op: "−", label: `Tax at your ${slab}% slab`, value: rupees(taxed.tax) },
            { op: "=", label: "You keep", value: rupees(amount + taxed.net) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I deposit" presets={[100000, 500000, 1000000]} value={amount} set={setAmount} min={1000} max={10000000} step={1000} prefix="₹" />
          <Field label="For" presets={[1, 3, 5]} value={years} set={setYears} min={1} max={10} step={0.5} suffix="yrs" />
          <Field label="Interest rate" presets={[6.5, 7, 7.5]} value={rate} set={setRate} min={1} max={12} step={0.1} suffix="%" />
          <Field
            label="My tax slab"
            value={slab}
            set={setSlab}
            min={0}
            max={30}
            step={5}
            suffix="%"
            hint="FD interest is taxed at your slab every year, whether or not you withdraw it. This is what separates an FD from most other options."
          />
        </>
      }
      result={
        <Result
          caption="It matures to"
          headline={rupeesShort(r.future)}
          sub={`After ${slab}% tax you keep ${rupees(taxed.net)} of the interest, and 6% inflation leaves that worth about ${rupeesShort(afterInflation)} in today's money.`}
          split={{ aLabel: "You deposited", a: r.invested, bLabel: "Interest", b: r.gain }}
          rows={[
            { label: "You deposited", value: rupees(r.invested) },
            { label: "Interest earned", value: rupees(r.gain) },
            { label: "Tax on it", value: `− ${rupees(taxed.tax)}` },
            { label: "After tax", value: rupees(r.invested + taxed.net) },
            { label: "Worth in today's money", value: rupeesShort(afterInflation) },
          ]}
        />
      }
    />
  );
}

function PpfCalculator() {
  const [yearly, setYearly] = useState(150000);
  const [rate, setRate] = useState(PPF_RATE);
  const r = money.ppf(yearly, rate);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Every year", value: rupees(yearly) },
            { op: "×", label: `${PPF_YEARS} years, you put in`, value: rupees(r.invested) },
            { op: "+", label: `Interest at ${rate}%, tax free`, value: rupees(r.gain) },
            { op: "=", label: "At maturity", value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field
            label="I deposit each year"
            presets={[50000, 100000, 150000]}
            value={yearly}
            set={setYearly}
            min={500}
            max={PPF_MAX_YEARLY}
            step={500}
            prefix="₹"
            hint={`The yearly cap is ${rupees(PPF_MAX_YEARLY)}.`}
          />
          <Field
            label="Interest rate"
            value={rate}
            set={setRate}
            min={4}
            max={12}
            step={0.1}
            suffix="%"
            hint={`Currently ${PPF_RATE}%, reset every quarter.`}
          />
        </>
      }
      result={
        <Result
          caption={`After ${PPF_YEARS} years`}
          headline={rupeesShort(r.future)}
          sub="Tax free going in, while it grows, and coming out. Few things in Indian finance are."
          split={{ aLabel: "You deposited", a: r.invested, bLabel: "Interest", b: r.gain }}
          rows={[
            { label: "You deposited", value: rupees(r.invested) },
            { label: "Interest earned", value: rupees(r.gain) },
            { label: "Maturity amount", value: rupees(r.future) },
          ]}
        />
      }
    />
  );
}

function CagrCalculator() {
  const [start, setStart] = useState(100000);
  const [end, setEnd] = useState(250000);
  const [years, setYears] = useState(5);
  const r = money.cagr(start, end, years);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "It started at", value: rupees(start) },
            { op: "→", label: `After ${years} yrs`, value: rupees(end) },
            { op: "=", label: "It grew", value: `${r.multiple.toFixed(2)}×` },
            { op: "=", label: "Each year, compounded", value: `${r.rate.toFixed(2)}%` },
          ]}
        />
      }
      inputs={
        <>
          <Field label="It started at" value={start} set={setStart} min={1000} max={50000000} step={1000} prefix="₹" />
          <Field label="It is now" value={end} set={setEnd} min={1000} max={100000000} step={1000} prefix="₹" />
          <Field label="Over" value={years} set={setYears} min={0.5} max={40} step={0.5} suffix="yrs" />
        </>
      }
      result={
        <Result
          caption="That is a yearly return of"
          headline={`${r.rate.toFixed(1)}%`}
          sub={`The money grew ${r.multiple.toFixed(2)}× in total. Spread across ${years} years, that is what it earned each year.`}
          rows={[
            { label: "Total growth", value: `${r.multiple.toFixed(2)}×` },
            { label: "Gain", value: rupees(end - start) },
            { label: "Yearly return", value: `${r.rate.toFixed(2)}%` },
          ]}
        />
      }
    />
  );
}

function InflationCalculator() {
  const [amount, setAmount] = useState(100000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(6);
  const r = money.inflation(amount, years, rate);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Costs today", value: rupees(amount) },
            { op: "+", label: `${rate}% a year for ${years} yrs`, value: rupees(r.costLater - amount) },
            { op: "=", label: "Costs then", value: rupees(r.costLater) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Something costs today" value={amount} set={setAmount} min={100} max={100000000} step={1000} prefix="₹" />
          <Field label="In" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field
            label="Inflation"
            presets={[4, 6, 8]}
            value={rate}
            set={setRate}
            min={1}
            max={15}
            step={0.5}
            suffix="%"
            hint="India has averaged around 6%. Education and healthcare have run well above it."
          />
        </>
      }
      result={
        <Result
          caption={`The same thing in ${years} years`}
          headline={rupeesShort(r.costLater)}
          sub={`Put the other way: ${rupees(amount)} kept in cash would buy what ${rupees(r.worthLater)} buys today. That is the cost of not investing.`}
          rows={[
            { label: "Costs today", value: rupees(amount) },
            { label: `Costs in ${years} years`, value: rupees(r.costLater) },
            { label: "What your cash would be worth", value: rupees(r.worthLater) },
          ]}
        />
      }
    />
  );
}

function SwpCalculator() {
  const [corpus, setCorpus] = useState(10000000);
  const [withdrawal, setWithdrawal] = useState(50000);
  const [rate, setRate] = useState(9);
  const [inflationPct, setInflationPct] = useState(6);
  const r = money.swp(corpus, withdrawal, rate, inflationPct);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You start with", value: rupees(corpus) },
            { op: "+", label: `Growth at ${rate}%`, value: rupees(r.endBalance + r.totalDrawn - corpus) },
            { op: "−", label: "You draw", value: rupees(r.totalDrawn) },
            (r.lasts ? { op: "=" as const, label: `Left after ${yearsAndMonths(r.months)}`, value: rupees(r.endBalance) } : { op: "=" as const, label: "It runs out after", value: yearsAndMonths(r.months) }),
          ]}
        />
      }
      inputs={
        <>
          <Field label="I have invested" presets={[2500000, 5000000, 10000000]} value={corpus} set={setCorpus} min={100000} max={200000000} step={100000} prefix="₹" />
          <Field label="I draw each month" presets={[25000, 50000, 100000]} value={withdrawal} set={setWithdrawal} min={1000} max={1000000} step={1000} prefix="₹" />
          <Field label="It returns" value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
          <Field
            label="I raise the draw by"
            value={inflationPct}
            set={setInflationPct}
            min={0}
            max={12}
            step={0.5}
            suffix="%/yr"
            hint="Your costs rise in retirement too. Drawing a flat amount quietly means spending less each year."
          />
        </>
      }
      result={
        r.lasts ? (
          <Result
            caption="It lasts"
            headline="60 years or more"
            sub={`You would still have about ${rupeesShort(r.endBalance)} left after sixty years. At this rate the corpus is earning more than you take out.`}
            rows={[
              { label: "Drawn over 60 years", value: rupeesShort(r.totalDrawn) },
              { label: "Still left", value: rupeesShort(r.endBalance) },
            ]}
          />
        ) : (
          <Result
            tone={r.months < 240 ? "rose" : "mint"}
            caption="It runs out in"
            headline={yearsAndMonths(r.months)}
            sub={`You would draw ${rupeesShort(r.totalDrawn)} in total before it empties.`}
            rows={[
              { label: "How long it lasts", value: yearsAndMonths(r.months) },
              { label: "Total drawn", value: rupeesShort(r.totalDrawn) },
            ]}
          />
        )
      }
    />
  );
}

function FireCalculator() {
  const [expenses, setExpenses] = useState(50000);
  const [corpus, setCorpus] = useState(500000);
  const [investment, setInvestment] = useState(50000);
  const [rate, setRate] = useState(12);
  const [inflationPct, setInflationPct] = useState(6);
  const [withdrawal, setWithdrawal] = useState(4);

  const r = money.fire({
    monthlyExpenses: expenses,
    currentCorpus: corpus,
    monthlyInvestment: investment,
    returnPct: rate,
    inflationPct,
    withdrawalPct: withdrawal,
  });

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You spend a year", value: rupees(expenses * 12) },
            { op: "÷", label: `A ${withdrawal}% safe draw, so you need`, value: rupees(r.target) },
            { op: "−", label: "You have already", value: rupees(corpus) },
            { op: "→", label: `Adding ${rupees(investment)} a month`, value: r.reachable ? yearsAndMonths(r.months) : "Not in 80 yrs" },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I spend each month" presets={[40000, 75000, 100000, 150000]} value={expenses} set={setExpenses} min={5000} max={500000} step={1000} prefix="₹" />
          <Field label="I have invested already" value={corpus} set={setCorpus} min={0} max={50000000} step={50000} prefix="₹" />
          <Field label="I add every month" value={investment} set={setInvestment} min={0} max={500000} step={1000} prefix="₹" />
          <Field label="Expected return" value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
          <Field label="Inflation" value={inflationPct} set={setInflationPct} min={0} max={12} step={0.5} suffix="%" />
          <Field
            label="Withdrawal rate"
            value={withdrawal}
            set={setWithdrawal}
            min={2}
            max={8}
            step={0.25}
            suffix="%"
            hint="The share of your corpus you spend each year. 4% is the usual starting point, and it is debated."
          />
        </>
      }
      result={
        <Result
          caption="You need invested"
          headline={rupeesShort(r.target)}
          sub={
            r.months === 0
              ? "You are already there."
              : r.reachable
                ? `At this pace you get there in about ${yearsAndMonths(r.months)}.`
                : "At this pace you do not get there within 80 years. Spend less, invest more, or expect less."
          }
          rows={[
            { label: "Your number", value: rupees(r.target) },
            { label: "Time to reach it", value: r.reachable ? yearsAndMonths(r.months) : "Over 80 years" },
            { label: "A year of spending", value: rupees(expenses * 12) },
          ]}
        />
      }
    />
  );
}

/* ── Salary and tax, more ──────────────────────────────────────── */

function HraCalculator() {
  const [basic, setBasic] = useState(50000);
  const [hra, setHra] = useState(25000);
  const [rent, setRent] = useState(20000);
  const [metro, setMetro] = useState<"yes" | "no">("yes");
  const r = money.hraExemption(basic * 12, hra * 12, rent * 12, metro === "yes");
  const why = {
    hra: "Your whole HRA is exempt: it is the smallest of the three.",
    rent: "Your rent is what holds it down. Only rent above a tenth of your basic counts.",
    share: `It is capped at ${metro === "yes" ? "half" : "40%"} of your basic, however much rent you pay.`,
  }[r.limitedBy];

  return (
    <Panel
      how={
        <Picks
          rule={"Tax free: the smallest of these three, for the year"}
          pick="min"
          options={[
            { label: "HRA you are paid", value: hra * 12 },
            { label: "Rent paid, less 10% of basic", value: r.overTenth },
            { label: `${metro === "yes" ? 50 : 40}% of basic`, value: r.share, detail: metro === "yes" ? "For a metro" : "Outside the four metros" },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Basic pay, a month" presets={[25000, 50000, 75000, 100000]} value={basic} set={setBasic} min={5000} max={1000000} step={1000} prefix="₹" hint="Add DA if you get it and it counts towards retirement benefits." />
          <Field label="HRA I am paid, a month" value={hra} set={setHra} min={0} max={500000} step={500} prefix="₹" />
          <Field label="Rent I pay, a month" presets={[10000, 20000, 30000, 50000]} value={rent} set={setRent} min={0} max={500000} step={500} prefix="₹" />
          <Choice
            label="I live in Delhi, Mumbai, Kolkata or Chennai"
            value={metro}
            set={setMetro}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
            Only the old regime allows this. In the new regime all of your HRA is taxed.
          </p>
        </>
      }
      result={
        <Result
          caption="Tax-free HRA, a year"
          headline={rupees(r.exempt)}
          sub={why}
          split={{ aLabel: "Exempt", a: r.exempt, bLabel: "Taxed", b: r.taxable }}
          rows={[
            { label: "HRA paid", value: rupees(hra * 12) },
            { label: "Rent above 10% of basic", value: rupees(r.overTenth) },
            { label: `${metro === "yes" ? "50" : "40"}% of basic`, value: rupees(r.share) },
            { label: "Exempt (the smallest)", value: rupees(r.exempt) },
            { label: "Still taxed", value: rupees(r.taxable) },
          ]}
        />
      }
    />
  );
}

function GratuityCalculator() {
  const [pay, setPay] = useState(60000);
  const [years, setYears] = useState(7);
  const [months, setMonths] = useState(8);
  const [covered, setCovered] = useState<"yes" | "no">("yes");
  const r = money.gratuity(pay, years, months, covered === "yes");

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Last basic + DA, a month", value: rupees(pay) },
            { op: "×", label: covered === "yes" ? "15 days' pay (of 26), a year" : "15 days' pay (of 30), a year", value: rupees((pay * 15) / (covered === "yes" ? 26 : 30)) },
            { op: "×", label: "Years counted", value: `${r.countedYears}` },
            { op: "=", label: "Gratuity", value: rupees(r.amount) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Last basic + DA, a month" value={pay} set={setPay} min={5000} max={1000000} step={1000} prefix="₹" />
          <Field label="Years worked" presets={[5, 10, 15, 20]} value={years} set={setYears} min={0} max={45} suffix="yrs" />
          <Field label="Plus months" value={months} set={setMonths} min={0} max={11} suffix="mo" hint="Under the Act, more than six months rounds up to a full year." />
          <Choice
            label="My employer is covered by the Gratuity Act"
            value={covered}
            set={setCovered}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <p className="-mt-3 text-[13px] text-muted">Any business with ten or more employees is. If unsure, pick yes.</p>
        </>
      }
      result={
        <Result
          tone={years < 5 ? "rose" : "mint"}
          caption="Gratuity you are owed"
          headline={rupees(r.amount)}
          sub={
            years < 5
              ? "Most employees need five years of service to qualify, so this may be zero for you. Fixed-term staff qualify after one year."
              : `${r.countedYears} years counted, at 15 days' pay for each, on a ${covered === "yes" ? "26" : "30"}-day month.`
          }
          rows={[
            { label: "Years counted", value: String(r.countedYears) },
            { label: "Tax free", value: rupees(r.taxFree) },
            { label: "Taxed at your slab", value: rupees(r.taxable) },
          ]}
        />
      }
    />
  );
}

function CapitalGains() {
  const [asset, setAsset] = useState<"equity" | "other">("equity");
  const [bought, setBought] = useState(500000);
  const [sold, setSold] = useState(800000);
  const [held, setHeld] = useState(30);
  const [slab, setSlab] = useState(30);
  const [used, setUsed] = useState(0);
  const r = money.capitalGains({ asset, bought, sold, monthsHeld: held, slabPct: slab, exemptionUsed: used });
  const threshold = asset === "equity" ? 12 : 24;

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You sold for", value: rupees(sold) },
            { op: "−", label: "You paid", value: rupees(bought) },
            { op: "=", label: r.gain < 0 ? "A loss" : `${r.longTerm ? "Long" : "Short"}-term gain`, value: rupees(r.gain) },
            ...(r.gain > 0 && r.exempt > 0 ? [{ op: "−" as const, label: "Tax-free part", value: rupees(r.exempt) }] : []),
            ...(r.gain > 0 ? [{ op: "×" as const, label: `${r.rate}% plus 4% cess`, value: rupees(r.tax) }] : []),
          ]}
        />
      }
      inputs={
        <>
          <Choice
            label="What I sold"
            value={asset}
            set={setAsset}
            options={[
              { value: "equity", label: "Shares, equity funds" },
              { value: "other", label: "Property, gold, other" },
            ]}
          />
          <Field label="I paid" value={bought} set={setBought} min={1000} max={100000000} step={1000} prefix="₹" />
          <Field label="I sold for" value={sold} set={setSold} min={1000} max={200000000} step={1000} prefix="₹" hint="After brokerage and transfer costs." />
          <Field label="I held it for" value={held} set={setHeld} min={1} max={480} suffix="mo" hint={`Long term after ${threshold} months for this kind of asset.`} />
          {asset === "equity" ? (
            r.longTerm && (
              <Field
                label="Equity gains already booked this year"
                value={used}
                set={setUsed}
                min={0}
                max={2000000}
                step={5000}
                prefix="₹"
                hint={`The first ${rupees(money.LTCG_EQUITY_EXEMPT)} of long-term equity gains a year are tax free, across everything you sell.`}
              />
            )
          ) : (
            !r.longTerm && <Field label="My tax slab" value={slab} set={setSlab} min={0} max={30} step={5} suffix="%" />
          )}
        </>
      }
      result={
        <Result
          tone={r.gain < 0 ? "rose" : "mint"}
          caption={r.gain < 0 ? "A loss, so no tax" : `${r.longTerm ? "Long" : "Short"}-term gain. Tax due`}
          headline={rupees(r.tax)}
          sub={
            r.gain < 0
              ? `You lost ${rupees(-r.gain)}. A capital loss can be set off against gains and carried forward eight years, if you file on time.`
              : `${rupees(r.taxable)} taxed at ${r.rate}% plus 4% cess. You keep ${rupees(r.gain - r.tax)} of the ${rupees(r.gain)} gain.`
          }
          rows={
            r.gain < 0
              ? []
              : [
                  { label: "Gain", value: rupees(r.gain) },
                  ...(r.exempt > 0 ? [{ label: "Tax-free part", value: rupees(r.exempt) }] : []),
                  { label: "Taxed at", value: `${r.rate}%` },
                  { label: "Tax with cess", value: rupees(r.tax) },
                  { label: "You keep", value: rupees(r.gain - r.tax) },
                ]
          }
        />
      }
    />
  );
}

/* ── Government schemes ────────────────────────────────────────── */

function EpfCalculator() {
  const [basic, setBasic] = useState(30000);
  const [age, setAge] = useState(28);
  const [balance, setBalance] = useState(200000);
  const [raise, setRaise] = useState(7);
  const [rate, setRate] = useState(EPF_RATE);
  const [pfBase, setPfBase] = useState<money.PfBase>("basic");
  const r = money.epf({ monthlyBasic: basic, age, retireAge: 58, balance, raisePct: raise, ratePct: rate, pfBase });
  const real = money.realValue(r.future, r.years, 6);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Balance today", value: rupees(r.opening) },
            { op: "+", label: "Your 12%, every month", value: rupees(r.mine) },
            { op: "+", label: "Your employer's share", value: rupees(r.employer) },
            { op: "+", label: `Interest at ${rate}%`, value: rupees(r.interest) },
            { op: "=", label: `At 58, in ${r.years} yrs`, value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Basic + DA, a month" presets={[15000, 25000, 50000, 75000]} value={basic} set={setBasic} min={5000} max={500000} step={1000} prefix="₹" />
          <Field label="My age" value={age} set={setAge} min={18} max={57} suffix="yrs" hint="EPF matures at 58." />
          <Field label="EPF balance today" value={balance} set={setBalance} min={0} max={20000000} step={10000} prefix="₹" />
          <Field label="Basic rises by" value={raise} set={setRaise} min={0} max={15} step={0.5} suffix="%/yr" />
          <Field label="EPF interest rate" value={rate} set={setRate} min={5} max={10} step={0.05} suffix="%" hint={`Declared every year. ${EPF_RATE}% is the latest.`} />
          <Choice
            label="PF is worked out on"
            value={pfBase}
            set={setPfBase}
            options={[
              { value: "basic", label: "My whole basic" },
              { value: "ceiling", label: `₹${(EPF_WAGE_CEILING / 1000).toFixed(0)}k cap` },
            ]}
          />
        </>
      }
      result={
        <Result
          caption={`At 58, in ${r.years} years`}
          headline={rupeesShort(r.future)}
          sub={`About ${rupeesShort(real)} in today's money, at 6% inflation. Tax free at maturity once you have five years of service.`}
          split={{ aLabel: "Paid in", a: r.mine + r.employer + r.opening, bLabel: "Interest", b: r.interest }}
          rows={[
            { label: "You put in", value: rupeesShort(r.mine) },
            { label: "Your employer puts in", value: rupeesShort(r.employer) },
            ...(r.opening > 0 ? [{ label: "Balance today", value: rupeesShort(r.opening) }] : []),
            { label: "Interest adds", value: rupeesShort(r.interest) },
          ]}
        />
      }
    />
  );
}

function NpsCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [age, setAge] = useState(30);
  const [balance, setBalance] = useState(0);
  const [rate, setRate] = useState(10);
  const [annuityPct, setAnnuityPct] = useState(40);
  const [annuityRate, setAnnuityRate] = useState(6);
  const r = money.nps({ monthly, age, retireAge: 60, balance, returnPct: rate, annuityPct, annuityRatePct: annuityRate });

  return (
    <Panel
      how={
        <HowItWorks
          note={`The annuity then pays about ${rupees(r.pension)} a month, for life.`}
          steps={[
            { label: "You put in, in all", value: rupees(r.invested) },
            { op: "+", label: `Growth at ${rate}%`, value: rupees(r.corpus - r.invested) },
            { op: "=", label: "Corpus at 60", value: rupees(r.corpus) },
            { op: "−", label: `${annuityPct}% buys an annuity`, value: rupees(r.annuity) },
            { op: "=", label: "Lump sum to you", value: rupees(r.lumpSum) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I put in each month" presets={[2000, 5000, 10000]} value={monthly} set={setMonthly} min={500} max={200000} step={500} prefix="₹" />
          <Field label="My age" value={age} set={setAge} min={18} max={59} suffix="yrs" />
          <Field label="NPS balance today" value={balance} set={setBalance} min={0} max={20000000} step={10000} prefix="₹" />
          <Field label="Expected return" value={rate} set={setRate} min={4} max={14} step={0.5} suffix="%" hint="Depends on how much is in equity. 8 to 10% is a fair range for a mixed allocation." />
          <Field
            label="Share used for an annuity"
            value={annuityPct}
            set={setAnnuityPct}
            min={20}
            max={100}
            step={5}
            suffix="%"
            hint="At least 20% for most private-sector subscribers since December 2025, 40% for government employees."
          />
          <Field label="Annuity rate" value={annuityRate} set={setAnnuityRate} min={4} max={9} step={0.25} suffix="%" />
        </>
      }
      result={
        <Result
          caption={`At 60, in ${r.years} years`}
          headline={rupeesShort(r.corpus)}
          sub={`${rupeesShort(r.lumpSum)} you can take as a lump sum, and a pension of about ${rupees(r.pension)} a month from the rest.`}
          split={{ aLabel: "Lump sum", a: r.lumpSum, bLabel: "Buys the pension", b: r.annuity }}
          rows={[
            { label: "You put in", value: rupeesShort(r.invested) },
            { label: "Corpus at 60", value: rupeesShort(r.corpus) },
            { label: "Lump sum", value: rupeesShort(r.lumpSum) },
            { label: "Pension, a month", value: rupees(r.pension) },
          ]}
        />
      }
    />
  );
}

function SsyCalculator() {
  const [yearly, setYearly] = useState(150000);
  const [age, setAge] = useState(2);
  const [rate, setRate] = useState(SSY_RATE);
  const r = money.ssy(yearly, rate);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Every year, for 15 years", value: rupees(yearly) },
            { op: "=", label: "You put in", value: rupees(r.invested) },
            { op: "+", label: `Interest at ${rate}%, tax free`, value: rupees(r.gain) },
            { op: "=", label: "At 21", value: rupees(r.future) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I deposit each year" presets={[12000, 50000, 100000, 150000]} value={yearly} set={setYearly} min={250} max={SSY_MAX_YEARLY} step={250} prefix="₹" hint={`Between ₹250 and ${rupees(SSY_MAX_YEARLY)}, for the first 15 years.`} />
          <Field label="My daughter's age now" value={age} set={setAge} min={0} max={10} suffix="yrs" hint="The account can be opened until she turns ten." />
          <Field label="Interest rate" value={rate} set={setRate} min={5} max={10} step={0.1} suffix="%" hint={`${SSY_RATE}% for ${SMALL_SAVINGS_CHECKED}, reset every quarter.`} />
        </>
      }
      result={
        <Result
          caption={`When she is ${age + 21}`}
          headline={rupeesShort(r.future)}
          sub={`Deposits stop when she is ${age + 15}; the account keeps earning until it is 21 years old. Up to half can be taken out at 18 for her education.`}
          split={{ aLabel: "You deposited", a: r.invested, bLabel: "Interest", b: r.gain }}
          rows={[
            { label: "You deposited", value: rupees(r.invested) },
            { label: "Interest earned", value: rupees(r.gain) },
            { label: "Maturity amount", value: rupees(r.future) },
          ]}
        />
      }
    />
  );
}

function PostOfficeSchemes() {
  const [scheme, setScheme] = useState<money.PostOfficeScheme>("mis");
  const [amount, setAmount] = useState(500000);
  const s = money.POST_OFFICE[scheme];
  const [rates, setRates] = useState(() =>
    Object.fromEntries(Object.entries(money.POST_OFFICE).map(([k, v]) => [k, v.rate])) as Record<money.PostOfficeScheme, number>,
  );
  const rate = rates[scheme];
  const capped = Math.min(amount, s.max);
  const r = money.postOffice(scheme, capped, rate);
  const pays = s.pays !== "maturity";
  const every = { monthly: "month", quarterly: "quarter", yearly: "year", maturity: "" }[s.pays];
  const perYear = { monthly: 12, quarterly: 4, yearly: 1, maturity: 0 }[s.pays];

  return (
    <Panel
      how={
        pays ? (
          <HowItWorks
            steps={[
              { label: "You invest", value: rupees(capped) },
              { op: "×", label: `${rate}% a year, paid each ${every}`, value: rupees(r.payout) },
              { op: "=", label: `Interest over ${r.years} yrs`, value: rupees(r.interest) },
              { op: "+", label: "And your money back", value: rupees(capped + r.interest) },
            ]}
          />
        ) : (
          <HowItWorks
            steps={[
              { label: "You invest", value: rupees(capped) },
              { op: "+", label: `Interest at ${rate}%`, value: rupees(r.interest) },
              { op: "=", label: `After ${yearsAndMonths(Math.round(r.years * 12))}`, value: rupees(r.future) },
            ]}
          />
        )
      }
      inputs={
        <>
          <div>
            <label htmlFor="po-scheme" className="text-sm font-medium text-soft md:text-[15px]">
              Scheme
            </label>
            <select
              id="po-scheme"
              value={scheme}
              onChange={(e) => setScheme(e.target.value as money.PostOfficeScheme)}
              className="mt-2.5 w-full rounded-xl border border-line bg-surface px-3 py-3 text-[15px] font-semibold text-ink outline-none focus:border-green"
            >
              {(Object.keys(money.POST_OFFICE) as money.PostOfficeScheme[]).map((k) => (
                <option key={k} value={k}>
                  {money.POST_OFFICE[k].name}
                </option>
              ))}
            </select>
          </div>
          <Field
            label="I invest"
            value={amount}
            set={setAmount}
            min={1000}
            max={10000000}
            step={1000}
            prefix="₹"
            hint={Number.isFinite(s.max) ? `The most one person can hold is ${rupees(s.max)}${scheme === "mis" ? " (₹15 lakh in a joint account)" : ""}.` : "No upper limit."}
          />
          <Field
            label="Interest rate"
            value={rate}
            set={(v) => setRates((prev) => ({ ...prev, [scheme]: v }))}
            min={4}
            max={10}
            step={0.1}
            suffix="%"
            hint={`${s.rate}% for ${SMALL_SAVINGS_CHECKED}. ${scheme === "kvp" ? "KVP doubles in 115 months at this rate." : "Locked in for the whole term once you invest."}`}
          />
        </>
      }
      result={
        pays ? (
          <Result
            caption={`Paid to you every ${every}`}
            headline={rupees(r.payout)}
            sub={`For ${s.years} years, then your ${rupeesShort(capped)} comes back.${capped < amount ? ` Only ${rupeesShort(capped)} fits under the cap.` : ""}`}
            rows={[
              { label: "A year", value: rupees(r.payout * perYear) },
              { label: `Interest over ${s.years} years`, value: rupees(r.interest) },
              { label: "Deposit back at the end", value: rupees(capped) },
            ]}
          />
        ) : (
          <Result
            caption={`Matures in ${yearsAndMonths(Math.round(r.years * 12))} to`}
            headline={rupeesShort(r.future)}
            sub={`Nothing is paid out along the way; it all comes at the end. Interest is taxable at your slab${scheme === "nsc" ? ", but the deposit counts for 80C in the old regime" : ""}.`}
            split={{ aLabel: "You invest", a: capped, bLabel: "Interest", b: r.interest }}
            rows={[
              { label: "You invest", value: rupees(capped) },
              { label: "Interest earned", value: rupees(r.interest) },
              { label: "Maturity amount", value: rupees(r.future) },
            ]}
          />
        )
      }
    />
  );
}

/* ── Investing and loans, more ─────────────────────────────────── */

function RdCalculator() {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(7);
  const [slab, setSlab] = useState(30);
  const r = money.rd(monthly, years, rate);
  const taxed = money.afterTax(r.gain, slab);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Every month", value: rupees(monthly) },
            { op: "×", label: `${years * 12} months, you put in`, value: rupees(r.invested) },
            { op: "+", label: `Interest at ${rate}%`, value: rupees(r.gain) },
            { op: "−", label: `Tax at your ${slab}% slab`, value: rupees(taxed.tax) },
            { op: "=", label: "You keep", value: rupees(r.invested + taxed.net) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I deposit each month" presets={[1000, 5000, 10000]} value={monthly} set={setMonthly} min={100} max={500000} step={100} prefix="₹" />
          <Field label="For" presets={[1, 3, 5]} value={years} set={setYears} min={0.5} max={10} step={0.5} suffix="yrs" />
          <Field label="Interest rate" value={rate} set={setRate} min={1} max={12} step={0.1} suffix="%" />
          <Field label="My tax slab" value={slab} set={setSlab} min={0} max={30} step={5} suffix="%" />
        </>
      }
      result={
        <Result
          caption="It matures to"
          headline={rupeesShort(r.future)}
          sub={`After ${slab}% tax you keep ${rupees(taxed.net)} of the ${rupees(r.gain)} interest.`}
          split={{ aLabel: "You deposited", a: r.invested, bLabel: "Interest", b: r.gain }}
          rows={[
            { label: "You deposited", value: rupees(r.invested) },
            { label: "Interest earned", value: rupees(r.gain) },
            { label: "Tax on it", value: `− ${rupees(taxed.tax)}` },
            { label: "After tax", value: rupees(r.invested + taxed.net) },
          ]}
        />
      }
    />
  );
}

function BalanceTransfer() {
  const [outstanding, setOutstanding] = useState(3000000);
  const [years, setYears] = useState(15);
  const [oldRate, setOldRate] = useState(9.5);
  const [newRate, setNewRate] = useState(8.5);
  const [fees, setFees] = useState(25000);
  const r = money.balanceTransfer(outstanding, years, oldRate, newRate, fees);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Interest if you stay", value: rupees(r.oldInterest) },
            { op: "−", label: "Interest if you switch", value: rupees(r.newInterest) },
            { op: "−", label: "Cost of switching", value: rupees(fees) },
            { op: "=", label: r.saving >= 0 ? "You save" : "You lose", value: rupees(Math.abs(r.saving)) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I still owe" value={outstanding} set={setOutstanding} min={50000} max={50000000} step={50000} prefix="₹" />
          <Field label="Years left" value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="My rate now" value={oldRate} set={setOldRate} min={5} max={20} step={0.05} suffix="%" />
          <Field label="The new lender's rate" value={newRate} set={setNewRate} min={5} max={20} step={0.05} suffix="%" />
          <Field
            label="Total cost of switching"
            value={fees}
            set={setFees}
            min={0}
            max={500000}
            step={1000}
            prefix="₹"
            hint="Processing fee, legal and valuation charges, stamp duty on the new agreement. Floating-rate home loans have no foreclosure charge."
          />
        </>
      }
      result={
        <Compare
          verdict={r.worth ? "Switch." : "Stay where you are."}
          detail={
            r.worth
              ? `You save ${rupees(r.saving)} after fees, and the lower EMI pays the fees back in ${yearsAndMonths(r.breakEven)}. Ask your bank to match the rate first.`
              : "The fees eat the saving. Ask your current lender to lower your rate instead; many will, for a small fee or none."
          }
          left={{
            title: "Stay",
            value: `${rupees(r.oldEmi)}/mo`,
            won: !r.worth,
            rows: [
              { label: "Rate", value: `${oldRate}%` },
              { label: "Interest left", value: rupeesShort(r.oldInterest) },
            ],
          }}
          right={{
            title: "Switch",
            value: `${rupees(r.newEmi)}/mo`,
            won: r.worth,
            rows: [
              { label: "Rate", value: `${newRate}%` },
              { label: "Interest left", value: rupeesShort(r.newInterest) },
              { label: "Plus fees", value: rupees(fees) },
            ],
          }}
        />
      }
    />
  );
}

/* ── More tax ──────────────────────────────────────────────────── */

const regimeOptions: { value: "new" | "old"; label: string }[] = [
  { value: "new", label: "New regime" },
  { value: "old", label: "Old regime" },
];

function AdvanceTax() {
  const [salary, setSalary] = useState(1800000);
  const [other, setOther] = useState(400000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [deductions, setDeductions] = useState(200000);
  const [tds, setTds] = useState(150000);
  const [presumptive, setPresumptive] = useState<"no" | "yes">("no");
  const r = money.advanceTax({ salary, other, regime, deductions, tds, presumptive: presumptive === "yes" });
  const today = new Date().toISOString().slice(0, 10);
  const next = r.schedule.find((d) => d.iso >= today);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Tax for the year", value: rupees(r.tax.total) },
            { op: "−", label: "TDS", value: rupees(Math.min(tds, r.tax.total)) },
            { op: "=", label: "Left to pay", value: rupees(r.net) },
            ...(r.due ? r.schedule.map((d) => ({ op: "→" as const, label: `${Math.round(d.share * 100)}% by ${d.date}`, value: rupees(d.amount) })) : []),
          ]}
        />
      }
      inputs={
        <>
          <Field label="Salary this year" presets={[0, 1000000, 1800000, 3000000]} value={salary} set={setSalary} min={0} max={20000000} step={25000} prefix="₹" />
          <Field
            label="Other income this year"
            value={other}
            set={setOther}
            min={0}
            max={20000000}
            step={10000}
            prefix="₹"
            hint="FD and savings interest, rent after its 30% deduction, freelance profit, short-term gains. Your best guess for the whole year."
          />
          <Choice label="I file under" value={regime} set={setRegime} options={regimeOptions} />
          {regime === "old" && (
            <Field label="Deductions I claim" value={deductions} set={setDeductions} min={0} max={1000000} step={5000} prefix="₹" hint="80C, 80D, NPS, home loan interest, HRA exemption." />
          )}
          <Field
            label="TDS for the year"
            value={tds}
            set={setTds}
            min={0}
            max={10000000}
            step={5000}
            prefix="₹"
            hint="What your employer and bank will deduct in total. Your payslip and Form 26AS show it."
          />
          <Choice
            label="My other income is under the presumptive scheme"
            value={presumptive}
            set={setPresumptive}
            options={[
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
            ]}
          />
          <p className="border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
            Slabs for {ADVANCE_TAX_YEAR}, for someone under 60.
          </p>
        </>
      }
      result={
        <Result
          caption={r.due ? "Advance tax for the year" : "No advance tax needed"}
          headline={rupees(r.net)}
          sub={
            r.due
              ? `${next ? `Next: ${rupees(next.amount)} in total paid by ${next.date}. ` : ""}Pay nothing until you file and the interest comes to about ${rupees(r.interestIfSkipped)}.`
              : `Your tax after TDS is under ${rupees(money.ADVANCE_TAX_THRESHOLD)}, so you can settle it when you file. Your tax for the year is ${rupees(r.tax.total)}.`
          }
          rows={
            r.due
              ? [
                  { label: "Tax for the year", value: rupees(r.tax.total) },
                  { label: "Less TDS", value: `– ${rupees(Math.min(tds, r.tax.total))}` },
                  ...r.schedule.map((d) => ({
                    label: `${r.schedule.length > 1 ? `${Math.round(d.share * 100)}% by ` : "All by "}${d.date}`,
                    value: rupees(d.amount),
                  })),
                ]
              : [{ label: "Tax for the year", value: rupees(r.tax.total) }]
          }
        />
      }
    />
  );
}

function FreelanceTax() {
  const [receipts, setReceipts] = useState(3000000);
  const [expenses, setExpenses] = useState(500000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [deductions, setDeductions] = useState(150000);
  const [bank, setBank] = useState<"yes" | "no">("yes");
  const r = money.freelanceTax({ receipts, expenses, regime, deductions, mostlyBank: bank === "yes" });
  const limit = bank === "yes" ? money.PRESUMPTIVE_LIMIT : money.PRESUMPTIVE_LIMIT_CASH;
  const presumptiveWins = r.better === "presumptive";

  return (
    <Panel
      how={
        <Picks
          rule={"Your tax each way, for the year: the lower one wins"}
          pick="min"
          options={[
            { label: "Declare half as profit", value: r.presumptive.total, detail: `Profit declared ${rupeesShort(r.presumptiveProfit)}, no books`, disabled: !r.eligible },
            { label: "Keep books", value: r.books.total, detail: `Profit declared ${rupeesShort(r.actualProfit)}` },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I receive in a year" presets={[1000000, 2000000, 5000000, 7500000]} value={receipts} set={setReceipts} min={100000} max={20000000} step={50000} prefix="₹" />
          <Field
            label="My real business expenses"
            value={expenses}
            set={setExpenses}
            min={0}
            max={20000000}
            step={10000}
            prefix="₹"
            hint="Laptop and software, rent for a workspace, internet, travel for work. Only what you could prove with bills."
          />
          <Choice
            label="At least 95% comes by bank, UPI or card"
            value={bank}
            set={setBank}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <Choice label="I file under" value={regime} set={setRegime} options={regimeOptions} />
          {regime === "old" && (
            <Field label="Deductions I claim" value={deductions} set={setDeductions} min={0} max={1000000} step={5000} prefix="₹" hint="80C, 80D, NPS and the rest." />
          )}
        </>
      }
      result={
        <Compare
          verdict={!r.eligible ? "Keep books." : presumptiveWins ? "Declare half as profit." : "Keep books."}
          detail={
            !r.eligible
              ? `Receipts above ${rupeesShort(limit)} cannot use the presumptive scheme, so you pay on actual profit and keep proper accounts.`
              : presumptiveWins
                ? `It saves ${rupees(r.books.total - r.presumptive.total)} a year with no books to keep. Set aside about ${rupees(r.presumptive.total / 12)} a month, and pay it as advance tax by 15 March.`
                : `Your expenses are above half your receipts, so paying on actual profit costs ${rupees(r.presumptive.total - r.books.total)} less. You will need books and, above certain limits, an audit.`
          }
          left={{
            title: "Presumptive",
            value: r.eligible ? rupees(r.presumptive.total) : "Not allowed",
            won: r.eligible && presumptiveWins,
            rows: [
              { label: "Profit declared", value: rupees(r.presumptiveProfit) },
              { label: "Books needed", value: "No" },
            ],
          }}
          right={{
            title: "Actual profit",
            value: rupees(r.books.total),
            won: !r.eligible || !presumptiveWins,
            rows: [
              { label: "Profit declared", value: rupees(r.actualProfit) },
              { label: "Books needed", value: "Yes" },
            ],
          }}
        />
      }
    />
  );
}

const statusName: Record<money.Residency, string> = {
  ROR: "Resident.",
  RNOR: "Resident, not ordinarily.",
  NR: "Non-resident.",
};

function NriTax() {
  const [days, setDays] = useState(90);
  const [daysLast4, setDaysLast4] = useState(300);
  const [indian, setIndian] = useState<"yes" | "no">("yes");
  const [income, setIncome] = useState(600000);
  const [abroad, setAbroad] = useState<"yes" | "no">("yes");
  const [nrYears, setNrYears] = useState(5);
  const [daysLast7, setDaysLast7] = useState(400);
  const r = money.residency({
    days,
    daysLast4,
    indian: indian === "yes",
    indianIncome: income,
    taxedAbroad: abroad === "yes",
    nrYearsOf10: nrYears,
    daysLast7,
  });
  const scope =
    r.status === "ROR"
      ? "India taxes everything you earn, here and abroad. Foreign income goes in your return, with credit for tax paid there."
      : r.status === "RNOR"
        ? "India taxes your Indian income, and foreign income only from a business run from India."
        : "India taxes only what you earn here. Interest on NRE deposits is tax free; NRO interest is taxed.";

  return (
    <Panel
      how={
        <HowItWorks
          note={r.reason}
          steps={[
            { label: "Days in India this year", value: `${days}` },
            { op: "→", label: "182 days or more?", value: days >= 182 ? "Yes" : "No" },
            { op: "→", label: `${r.secondTest}+ days, and 365 in the 4 yrs before?`, value: days >= r.secondTest && daysLast4 >= 365 ? "Yes" : "No" },
            { op: "=", label: "Your status", value: { ROR: "Resident", RNOR: "RNOR", NR: "NRI" }[r.status] },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Days in India this year" value={days} set={setDays} min={0} max={366} hint="April to March. Count both the day you arrive and the day you leave." />
          <Field label="Days in India in the 4 years before" value={daysLast4} set={setDaysLast4} min={0} max={1461} />
          <Choice
            label="Indian citizen or of Indian origin"
            value={indian}
            set={setIndian}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ]}
          />
          <Field
            label="My income from India this year"
            value={income}
            set={setIncome}
            min={0}
            max={50000000}
            step={10000}
            prefix="₹"
            hint="Rent, NRO interest, gains, salary for work done here. Not NRE interest, and not what you earn abroad."
          />
          {indian === "yes" && income > 1500000 && (
            <Choice
              label="I pay tax where I live"
              value={abroad}
              set={setAbroad}
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No, it has no income tax" },
              ]}
            />
          )}
          <Field label="Of the last 10 years, years I was an NRI" value={nrYears} set={setNrYears} min={0} max={10} />
          <Field label="Days in India in the last 7 years" value={daysLast7} set={setDaysLast7} min={0} max={2557} />
        </>
      }
      result={
        <Result
          caption="For this tax year you are"
          headline={statusName[r.status]}
          sub={`${r.reason} ${scope}`}
          rows={[
            { label: "Tax on Indian income", value: rupees(r.tax.total) },
            { label: "Rebate", value: r.status === "NR" ? "Not for NRIs" : rupees(r.tax.rebate) },
            { label: "Second day test", value: `${r.secondTest} days` },
          ]}
        />
      }
    />
  );
}

function TaxHarvesting() {
  const [unrealised, setUnrealised] = useState(300000);
  const [booked, setBooked] = useState(0);
  const [years, setYears] = useState(10);
  const r = money.taxHarvest(unrealised, booked, years);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Tax-free each year", value: rupees(money.LTCG_EQUITY_EXEMPT) },
            { op: "−", label: "Already booked", value: rupees(Math.min(booked, money.LTCG_EQUITY_EXEMPT)) },
            { op: "=", label: "Room left", value: rupees(r.room) },
            { op: "→", label: "Gains you can book", value: rupees(r.book) },
            { op: "×", label: "12.5% plus cess, saved later", value: rupees(r.savedNow) },
          ]}
        />
      }
      inputs={
        <>
          <Field
            label="Long-term gains sitting in my equity"
            value={unrealised}
            set={setUnrealised}
            min={0}
            max={10000000}
            step={5000}
            prefix="₹"
            hint="Gains on shares and equity funds held over a year that you have not sold. Your broker's tax P&L shows it."
          />
          <Field
            label="Long-term gains already booked this year"
            value={booked}
            set={setBooked}
            min={0}
            max={2000000}
            step={5000}
            prefix="₹"
          />
          <Field label="Years I keep doing this" value={years} set={setYears} min={1} max={30} suffix="yrs" />
        </>
      }
      result={
        <Result
          caption="Sell and buy back gains of"
          headline={rupees(r.book)}
          sub={
            r.book > 0
              ? `That uses this year's tax-free limit and saves ${rupees(r.savedNow)} of tax later. Done every year for ${years} years, it saves about ${rupees(r.savedOverYears)}.`
              : r.room === 0
                ? "You have already used this year's tax-free limit. Book nothing more before 31 March."
                : "Nothing to harvest: you have no long-term gains sitting in equity."
          }
          rows={[
            { label: "Tax-free room left this year", value: rupees(r.room) },
            { label: "Gains to book", value: rupees(r.book) },
            { label: "Tax saved later", value: rupees(r.savedNow) },
          ]}
        />
      }
    />
  );
}

function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState<"3" | "5" | "18" | "40">("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [where, setWhere] = useState<"same" | "other">("same");
  const r = money.gst(amount, Number(rate), mode);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Before GST", value: rupees(r.base) },
            { op: "+", label: `GST at ${rate}%`, value: rupees(r.tax) },
            { op: "=", label: "With GST", value: rupees(r.total) },
          ]}
        />
      }
      inputs={
        <>
          <Choice
            label="The amount I have"
            value={mode}
            set={setMode}
            options={[
              { value: "add", label: "Is before GST" },
              { value: "remove", label: "Includes GST" },
            ]}
          />
          <Field label="Amount" presets={[1000, 10000, 100000]} value={amount} set={setAmount} min={1} max={100000000} step={100} prefix="₹" />
          <Choice
            label="GST rate"
            value={rate}
            set={setRate}
            options={[
              { value: "3", label: "3%" },
              { value: "5", label: "5%" },
              { value: "18", label: "18%" },
              { value: "40", label: "40%" },
            ]}
          />
          <Choice
            label="Buyer and seller are in"
            value={where}
            set={setWhere}
            options={[
              { value: "same", label: "The same state" },
              { value: "other", label: "Different states" },
            ]}
          />
        </>
      }
      result={
        <Result
          caption={mode === "add" ? "Price with GST" : "Price before GST"}
          headline={rupees(mode === "add" ? r.total : r.base)}
          sub={`${rupees(r.tax)} of the ${rupees(r.total)} is GST at ${rate}%.`}
          rows={[
            { label: "Before GST", value: rupees(r.base) },
            ...(where === "same"
              ? [
                  { label: `CGST, ${Number(rate) / 2}%`, value: rupees(r.tax / 2) },
                  { label: `SGST, ${Number(rate) / 2}%`, value: rupees(r.tax / 2) },
                ]
              : [{ label: `IGST, ${rate}%`, value: rupees(r.tax) }]),
            { label: "Total", value: rupees(r.total) },
          ]}
        />
      }
    />
  );
}

/** Months from one yyyy-mm to another, inclusive. */
function monthsBetween(from: string, to: string) {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  if (!fy || !fm || !ty || !tm) return [];
  const out: Date[] = [];
  for (let y = fy, m = fm; y < ty || (y === ty && m <= tm); m === 12 ? ((m = 1), y++) : m++) {
    out.push(new Date(y, m - 1, 1));
    if (out.length >= 24) break;
  }
  return out;
}

const monthName = (d: Date) => d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

function RentReceipts() {
  const [tenant, setTenant] = useState("");
  const [landlord, setLandlord] = useState("");
  const [pan, setPan] = useState("");
  const [address, setAddress] = useState("");
  const [rent, setRent] = useState(25000);
  const [from, setFrom] = useState("2026-04");
  const [to, setTo] = useState("2027-03");
  const [paidBy, setPaidBy] = useState<"bank" | "cash">("bank");
  const months = monthsBetween(from, to);
  const yearly = rent * months.length;
  const panNeeded = rent * 12 > 100000;
  const blank = "________________";

  return (
    <>
      <Panel
        how={
          <HowItWorks
            note={panNeeded ? "That is over ₹1 lakh a year, so your landlord's PAN goes on the claim." : undefined}
            steps={[
              { label: "Rent a month", value: rupees(rent) },
              { op: "×", label: "Months", value: `${months.length}` },
              { op: "=", label: "Rent for the period", value: rupees(yearly) },
            ]}
          />
        }
        inputs={
          <>
            <TextField label="My name (tenant)" value={tenant} set={setTenant} placeholder="As on your PAN" />
            <TextField label="Landlord's name" value={landlord} set={setLandlord} />
            <TextField
              label="Landlord's PAN"
              value={pan}
              set={(v) => setPan(v.toUpperCase())}
              placeholder="ABCDE1234F"
              hint={panNeeded ? "Needed: your rent is above ₹1 lakh a year." : "Only needed above ₹1 lakh of rent a year."}
            />
            <TextField label="Address of the rented home" value={address} set={setAddress} />
            <Field label="Rent a month" presets={[10000, 20000, 30000, 50000]} value={rent} set={setRent} min={1000} max={500000} step={500} prefix="₹" />
            <TextField label="From" value={from} set={setFrom} type="month" />
            <TextField label="To" value={to} set={setTo} type="month" />
            <Choice
              label="I pay rent by"
              value={paidBy}
              set={setPaidBy}
              options={[
                { value: "bank", label: "Bank or UPI" },
                { value: "cash", label: "Cash" },
              ]}
            />
          </>
        }
        result={
          <div>
            <Result
              caption={`${months.length} ${months.length === 1 ? "receipt" : "receipts"} ready`}
              headline={rupees(yearly)}
              sub={`Rent for ${months.length} ${months.length === 1 ? "month" : "months"}. Print them below, or save as PDF from the print window, then have your landlord sign each one.`}
              rows={[
                { label: "Landlord PAN needed", value: panNeeded ? "Yes" : "No" },
                { label: "Revenue stamp", value: paidBy === "cash" && rent > 5000 ? "Yes, ₹1" : "Not needed" },
              ]}
            />
            <button
              type="button"
              onClick={() => window.print()}
              disabled={months.length === 0}
              className="btn btn-primary mt-3 w-full py-3.5"
            >
              Print or save as PDF
            </button>
          </div>
        }
      />

      <div className="print-area mt-10 grid gap-4 md:grid-cols-2">
        {months.map((d) => (
          <div key={d.toISOString()} className="break-inside-avoid rounded-2xl border border-line bg-surface p-5 text-sm leading-relaxed text-body">
            <p className="flex justify-between gap-3 font-serif text-lg font-bold text-ink">
              Rent receipt <span className="font-sans text-sm font-medium text-muted">{monthName(d)}</span>
            </p>
            <p className="mt-3">
              Received from <b>{tenant || blank}</b> the sum of <b>{rupees(rent)}</b> towards rent for{" "}
              <b>{monthName(d)}</b> for the property at <b>{address || blank}</b>, paid by{" "}
              {paidBy === "cash" ? "cash" : "bank transfer"}.
            </p>
            <div className="mt-5 flex items-end justify-between gap-4 text-[13px] text-soft">
              <span>
                Landlord: {landlord || blank}
                {pan && (
                  <>
                    <br />
                    PAN: {pan}
                  </>
                )}
              </span>
              <span className="flex-none border-t border-rule pt-1">Signature{paidBy === "cash" && rent > 5000 ? " over ₹1 stamp" : ""}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── More schemes ──────────────────────────────────────────────── */

function ApyCalculator() {
  const [age, setAge] = useState(30);
  const [pension, setPension] = useState(5000);
  const r = money.apy(age, pension);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You pay a month", value: rupees(r.monthly) },
            { op: "×", label: `${r.years * 12} months, until 60`, value: rupees(r.paid) },
            { op: "→", label: "From 60, for life", value: `${rupees(r.pension)}/mo` },
            { op: "→", label: "Then to your nominee", value: rupees(r.corpus) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="My age when I join" value={age} set={setAge} min={18} max={40} suffix="yrs" hint="Only 18 to 40 can join. The younger you join, the less each month." />
          <Field label="Pension I want from 60" presets={[1000, 2000, 3000, 4000, 5000]} value={pension} set={setPension} min={1000} max={5000} step={1000} prefix="₹" suffix="/mo" />
        </>
      }
      result={
        <Result
          caption="You pay every month"
          headline={rupees(r.monthly)}
          sub={`For ${r.years} years, ${rupees(r.paid)} in all. From 60 you get ${rupees(r.pension)} a month for life, then your spouse does, then your nominee gets ${rupeesShort(r.corpus)}.`}
          rows={[
            { label: "Years of paying", value: `${r.years}` },
            { label: "Total you pay", value: rupees(r.paid) },
            { label: "Returned to nominee", value: rupeesShort(r.corpus) },
            { label: `Same money at PPF's ${PPF_RATE}%`, value: rupeesShort(r.elsewhere) },
          ]}
        />
      }
    />
  );
}

/* ── Irregular returns ─────────────────────────────────────────── */

type FlowRow = { id: number; date: string; amount: number; out: boolean };

function XirrCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [rows, setRows] = useState<FlowRow[]>([
    { id: 1, date: "2023-04-01", amount: 100000, out: false },
    { id: 2, date: "2024-04-01", amount: 50000, out: false },
    { id: 3, date: "2025-04-01", amount: 50000, out: false },
    { id: 4, date: today, amount: 260000, out: true },
  ]);
  const update = (id: number, patch: Partial<FlowRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const rate = money.xirr(rows.map((r) => ({ date: r.date, amount: r.out ? r.amount : -r.amount })));
  const putIn = rows.filter((r) => !r.out).reduce((s, r) => s + r.amount, 0);
  const gotOut = rows.filter((r) => r.out).reduce((s, r) => s + r.amount, 0);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "You put in", value: rupees(putIn) },
            { op: "→", label: "Got back or worth now", value: rupees(gotOut) },
            { op: "=", label: "Gain", value: rupees(gotOut - putIn) },
            { op: "=", label: "A year, counting the dates", value: Number.isFinite(rate) ? `${rate.toFixed(2)}%` : "—" },
          ]}
        />
      }
      inputs={
        <>
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <div key={r.id} className="rounded-xl border border-line bg-surface p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="sr-only" htmlFor={`d${r.id}`}>Date {i + 1}</label>
                  <input
                    id={`d${r.id}`}
                    type="date"
                    value={r.date}
                    onChange={(e) => update(r.id, { date: e.target.value })}
                    className="min-w-0 flex-1 rounded-lg border border-line px-2.5 py-2 text-sm text-ink focus:border-green focus:outline-none"
                  />
                  <label className="sr-only" htmlFor={`a${r.id}`}>Amount {i + 1}</label>
                  <span className="flex flex-1 items-center gap-1 rounded-lg border border-line px-2.5 py-2 focus-within:border-green">
                    <span className="text-sm text-muted">₹</span>
                    <input
                      id={`a${r.id}`}
                      type="text"
                      inputMode="decimal"
                      value={r.amount ? r.amount.toLocaleString("en-IN") : ""}
                      onChange={(e) => update(r.id, { amount: Number(e.target.value.replace(/[^\d.]/g, "")) || 0 })}
                      className="w-full min-w-0 bg-transparent text-right text-sm font-semibold text-ink outline-none"
                    />
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {(["in", "out"] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      aria-pressed={(k === "out") === r.out}
                      onClick={() => update(r.id, { out: k === "out" })}
                      className={`flex-1 rounded-lg border px-2 py-2.5 text-[13px] font-semibold ${
                        (k === "out") === r.out ? "border-fill bg-fill text-white" : "border-line text-soft hover:border-green"
                      }`}
                    >
                      {k === "in" ? "I put in" : "Got back or worth now"}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
                    disabled={rows.length <= 2}
                    aria-label={`Remove line ${i + 1}`}
                    className="flex-none rounded-lg px-2.5 py-2.5 text-[13px] font-semibold text-muted hover:text-alert disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              setRows((rs) => [...rs, { id: Math.max(...rs.map((r) => r.id)) + 1, date: today, amount: 10000, out: false }])
            }
            className="btn btn-ghost py-3"
          >
            Add a line
          </button>
        </>
      }
      result={
        <Result
          tone={Number.isFinite(rate) && rate < 0 ? "rose" : "mint"}
          caption="Your yearly return (XIRR)"
          headline={Number.isFinite(rate) ? `${rate.toFixed(2)}%` : "—"}
          sub={
            Number.isFinite(rate)
              ? `Every rupee is counted only for the time it was actually invested. You put in ${rupees(putIn)} and got back or hold ${rupees(gotOut)}.`
              : "Needs at least one amount you put in and one you got back or hold now, on real dates."
          }
          rows={[
            { label: "You put in", value: rupees(putIn) },
            { label: "Got back or worth now", value: rupees(gotOut) },
            { label: "Gain", value: rupees(gotOut - putIn) },
          ]}
        />
      }
    />
  );
}

/* ── Home and car ──────────────────────────────────────────────── */

function HomeLoan() {
  const [price, setPrice] = useState(8000000);
  const [down, setDown] = useState(20);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [slab, setSlab] = useState(30);
  const r = money.homeLoan({ price, downPct: down, years, ratePct: rate, slabPct: slab });
  const interestShare = r.first.interest / (r.first.interest + r.first.principal);

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Price of the home", value: rupees(price) },
            { op: "−", label: `${down}% you put down`, value: rupees(price - r.loan) },
            { op: "=", label: "Loan", value: rupees(r.loan) },
            { op: "+", label: `Interest at ${rate}%`, value: rupees(r.interest) },
            { op: "=", label: "You repay in all", value: rupees(r.total) },
            { op: "÷", label: `${r.months} months, so each EMI`, value: rupees(r.monthly) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="Price of the home" presets={[3000000, 5000000, 8000000, 15000000]} value={price} set={setPrice} min={500000} max={100000000} step={100000} prefix="₹" />
          <Field label="I put down" value={down} set={setDown} min={10} max={90} suffix="%" hint="Banks lend 75% to 90% of the value, depending on the size of the loan." />
          <Field label="Over" presets={[10, 15, 20, 25, 30]} value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="Interest rate" presets={[7.5, 8, 8.5, 9, 9.5]} value={rate} set={setRate} min={6} max={15} step={0.05} suffix="%" />
          <Field label="My tax slab, old regime" value={slab} set={setSlab} min={0} max={30} step={5} suffix="%" hint="Set 0 if you are in the new regime: it gives no home loan deduction on a home you live in." />
        </>
      }
      result={
        <Result
          caption="Every month you pay"
          headline={rupees(r.monthly)}
          sub={`On a loan of ${rupeesShort(r.loan)}. In the first year, ${Math.round(interestShare * 100)}% of what you pay is interest.`}
          split={{
            aLabel: "What you borrow",
            a: r.loan,
            bLabel: "Interest",
            b: r.interest,
            byYear: money.amortise(r.loan, years, rate).map((y) => ({ a: y.principal, b: y.interest })),
            yearLabels: ["Loan repaid", "Interest"],
          }}
          rows={[
            { label: "Loan", value: rupees(r.loan) },
            { label: "Total interest", value: rupees(r.interest) },
            { label: "Interest in year one", value: rupees(r.first.interest) },
            { label: "Principal in year one", value: rupees(r.first.principal) },
            { label: "Tax saved in year one", value: rupees(r.taxSaved) },
          ]}
        />
      }
    />
  );
}

function CarLoan() {
  const [price, setPrice] = useState(1000000);
  const [down, setDown] = useState(200000);
  const [years, setYears] = useState(5);
  const [rate, setRate] = useState(9);
  const [kind, setKind] = useState<"reducing" | "flat">("reducing");
  const [income, setIncome] = useState(100000);
  const r = money.carLoan({ price, down, years, ratePct: rate, flat: kind === "flat" });
  const share = (r.monthly / income) * 100;

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "On-road price", value: rupees(price) },
            { op: "−", label: "You put down", value: rupees(Math.min(down, price)) },
            { op: "=", label: "Loan", value: rupees(r.loan) },
            { op: "+", label: kind === "flat" ? `Interest, ${rate}% flat` : `Interest at ${rate}%`, value: rupees(r.interest) },
            { op: "=", label: "You repay in all", value: rupees(r.loan + r.interest) },
            { op: "÷", label: `${r.months} months, so each EMI`, value: rupees(r.monthly) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="On-road price" presets={[600000, 1000000, 1500000, 2500000]} value={price} set={setPrice} min={100000} max={10000000} step={10000} prefix="₹" />
          <Field label="I put down" value={down} set={setDown} min={0} max={price} step={10000} prefix="₹" />
          <Field label="Over" presets={[3, 5, 7]} value={years} set={setYears} min={1} max={8} suffix="yrs" />
          <Field label="Interest rate quoted" value={rate} set={setRate} min={3} max={20} step={0.05} suffix="%" />
          <Choice
            label="The rate is"
            value={kind}
            set={setKind}
            options={[
              { value: "reducing", label: "Reducing" },
              { value: "flat", label: "Flat" },
            ]}
          />
          <Field label="My take-home a month" value={income} set={setIncome} min={10000} max={2000000} step={5000} prefix="₹" />
        </>
      }
      result={
        <Result
          tone={share > 15 ? "rose" : "mint"}
          caption="Every month you pay"
          headline={rupees(r.monthly)}
          sub={`${Math.round(share)}% of your take-home. ${
            kind === "flat"
              ? `A ${rate}% flat rate is really ${r.effectiveRate.toFixed(2)}% reducing, the way every other loan is quoted.`
              : share > 15
                ? "Over 10 to 15% of take-home, a car starts to crowd out everything else."
                : "Comfortably inside 10 to 15% of take-home."
          }`}
          split={{ aLabel: "What you borrow", a: r.loan, bLabel: "Interest", b: r.interest }}
          rows={[
            { label: "Loan", value: rupees(r.loan) },
            { label: "Total interest", value: rupees(r.interest) },
            { label: "Real (reducing) rate", value: `${r.effectiveRate.toFixed(2)}%` },
            { label: "Car costs you in all", value: rupees(down + r.loan + r.interest) },
          ]}
        />
      }
    />
  );
}

/* ── Strategies ────────────────────────────────────────────────── */

function CoreSatellite() {
  const [monthly, setMonthly] = useState(20000);
  const [years, setYears] = useState(15);
  const [core, setCore] = useState(80);
  const [coreReturn, setCoreReturn] = useState(12);
  const [satReturn, setSatReturn] = useState(13);
  const r = money.coreSatellite({ monthly, years, corePct: core, coreReturn, satelliteReturn: satReturn });
  const wins = r.difference > 0;

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: `The core, ${core}%, grows to`, value: rupees(r.core) },
            { op: "+", label: `The satellite, ${100 - core}%`, value: rupees(r.satellite) },
            { op: "=", label: "Together", value: rupees(r.total) },
            { op: "−", label: "All in the core instead", value: rupees(r.allCore) },
            { op: "=", label: wins ? "The satellite adds" : "The satellite costs", value: rupees(Math.abs(r.difference)) },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I invest every month" presets={[5000, 10000, 25000, 50000]} value={monthly} set={setMonthly} min={500} max={1000000} step={500} prefix="₹" />
          <Field label="For" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="Share in the core" presets={[70, 80, 90]} value={core} set={setCore} min={50} max={100} step={5} suffix="%" hint="Usually 70% to 90%, in a Nifty 50 or broad market index fund." />
          <Field label="Core returns, after costs" value={coreReturn} set={setCoreReturn} min={4} max={20} step={0.5} suffix="%" />
          <Field label="Satellite returns, after costs" value={satReturn} set={setSatReturn} min={0} max={30} step={0.5} suffix="%" hint="Your active, thematic or small-cap picks. Be honest about it." />
        </>
      }
      result={
        <Compare
          verdict={Math.abs(r.difference) < 1 ? "It makes no difference." : wins ? "The satellite earns its place." : "The core alone does better."}
          detail={
            wins
              ? `${rupeesShort(r.difference)} more than keeping it all in the core, if the satellite really beats it by ${(satReturn - coreReturn).toFixed(1)} points a year for ${years} years.`
              : `The satellite costs you ${rupeesShort(-r.difference)}. It needs to beat the core every year just to break even; most active funds do not, for long.`
          }
          left={{
            title: "All core",
            value: rupeesShort(r.allCore),
            won: !wins,
            rows: [{ label: "Return", value: `${coreReturn}%` }],
          }}
          right={{
            title: `${core}/${100 - core} split`,
            value: rupeesShort(r.total),
            won: wins,
            rows: [
              { label: "Core grows to", value: rupeesShort(r.core) },
              { label: "Satellite grows to", value: rupeesShort(r.satellite) },
            ],
          }}
        />
      }
    />
  );
}

function ThreeBucket() {
  const [corpus, setCorpus] = useState(20000000);
  const [spend, setSpend] = useState(80000);
  const [inflationPct, setInflationPct] = useState(6);
  const [cashYears, setCashYears] = useState(3);
  const [debtYears, setDebtYears] = useState(7);
  const [debtReturn, setDebtReturn] = useState(7);
  const [equityReturn, setEquityReturn] = useState(11);
  const r = money.threeBuckets({ corpus, monthlySpend: spend, inflationPct, cashYears, debtYears, debtReturn, equityReturn });

  return (
    <Panel
      how={
        <HowItWorks
          steps={[
            { label: "Your corpus", value: rupees(corpus) },
            { op: "−", label: `Cash, ${cashYears} yrs of spending`, value: rupees(r.cash) },
            { op: "−", label: `Debt, the ${debtYears} yrs after`, value: rupees(r.debt) },
            { op: "=", label: r.enough ? "Left in equity" : "Short by", value: rupees(Math.abs(r.equity)) },
            ...(r.enough ? [{ op: "→" as const, label: `Untouched ${r.untouched} yrs at ${equityReturn}%`, value: rupees(r.equityLater) }] : []),
          ]}
        />
      }
      inputs={
        <>
          <Field label="My retirement corpus" presets={[10000000, 20000000, 50000000]} value={corpus} set={setCorpus} min={500000} max={500000000} step={100000} prefix="₹" />
          <Field label="I spend a month, today" presets={[50000, 80000, 150000]} value={spend} set={setSpend} min={5000} max={2000000} step={1000} prefix="₹" />
          <Field label="Inflation" value={inflationPct} set={setInflationPct} min={0} max={12} step={0.5} suffix="%" />
          <Field label="Years held in cash" value={cashYears} set={setCashYears} min={1} max={5} suffix="yrs" hint="Savings, liquid funds, short FDs. Spent first." />
          <Field label="Years after that, in debt" value={debtYears} set={setDebtYears} min={1} max={10} suffix="yrs" />
          <Field label="Debt returns" value={debtReturn} set={setDebtReturn} min={3} max={10} step={0.5} suffix="%" />
          <Field label="Equity returns" value={equityReturn} set={setEquityReturn} min={4} max={16} step={0.5} suffix="%" />
        </>
      }
      result={
        <Result
          tone={r.enough ? "mint" : "rose"}
          caption={r.enough ? "Left in equity, untouched" : "Short by"}
          headline={rupeesShort(r.enough ? r.equity : -r.equity)}
          sub={
            r.enough
              ? `It is not touched for ${r.untouched} years. At ${equityReturn}% a year it grows to about ${rupeesShort(r.equityLater)} by then, to refill the other two.`
              : `The first ${r.untouched} years of spending need more than the whole corpus. Spend less, work longer, or shorten the buckets.`
          }
          split={r.enough ? { aLabel: "Cash and debt", a: r.cash + r.debt, bLabel: "Equity", b: r.equity } : undefined}
          rows={[
            { label: `Bucket 1, cash for ${cashYears} yrs`, value: rupeesShort(r.cash) },
            { label: `Bucket 2, debt for ${debtYears} yrs`, value: rupeesShort(r.debt) },
            { label: "Bucket 3, equity", value: rupeesShort(Math.max(0, r.equity)) },
          ]}
        />
      }
    />
  );
}

function CoffeeCan() {
  const [amount, setAmount] = useState(1000000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [every, setEvery] = useState<"6" | "12" | "24">("12");
  const [cost, setCost] = useState(0.5);
  const r = money.coffeeCan({ amount, years, ratePct: rate, costPct: cost, switchMonths: Number(every) });

  return (
    <Panel
      how={
        <Picks
          rule={`What each leaves you after ${years} years and tax`}
          pick="max"
          options={[
            { label: "Hold", value: r.heldAfterTax, detail: "Tax once, at the end" },
            { label: `Switch every ${every === "6" ? "6 months" : every === "12" ? "year" : "2 years"}`, value: r.churned, detail: `${rupeesShort(r.taxPaid)} tax and ${rupeesShort(r.costs)} costs on the way` },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I invest once" presets={[100000, 500000, 1000000]} value={amount} set={setAmount} min={10000} max={100000000} step={10000} prefix="₹" />
          <Field label="For" value={years} set={setYears} min={3} max={30} suffix="yrs" />
          <Field label="It returns" value={rate} set={setRate} min={4} max={20} step={0.5} suffix="%" />
          <Choice
            label="The other way, I switch every"
            value={every}
            set={setEvery}
            options={[
              { value: "6", label: "6 months" },
              { value: "12", label: "Year" },
              { value: "24", label: "2 years" },
            ]}
          />
          <Field label="Cost of each switch" value={cost} set={setCost} min={0} max={3} step={0.1} suffix="%" hint="Brokerage, exit load, the spread. Funds with an exit load charge about 1% inside a year." />
        </>
      }
      result={
        <Compare
          verdict={r.gap > 0 ? "Leave it alone." : "Switching came out ahead."}
          detail={`Holding ends with ${rupeesShort(r.gap)} more after tax, from the same return. Switching ${r.rounds} times paid ${rupeesShort(r.taxPaid)} in tax along the way and ${rupeesShort(r.costs)} in costs, money that stopped compounding.`}
          left={{
            title: "Hold",
            value: rupeesShort(r.heldAfterTax),
            won: r.gap > 0,
            rows: [
              { label: "Before tax", value: rupeesShort(r.held) },
              { label: "Tax paid", value: "Once, at the end" },
            ],
          }}
          right={{
            title: "Switch",
            value: rupeesShort(r.churned),
            won: r.gap <= 0,
            rows: [
              { label: "Tax along the way", value: rupeesShort(r.taxPaid) },
              { label: "Costs", value: rupeesShort(r.costs) },
            ],
          }}
        />
      }
    />
  );
}

function FactorInvesting() {
  const [monthly, setMonthly] = useState(20000);
  const [years, setYears] = useState(15);
  const [indexReturn, setIndexReturn] = useState(12);
  const [indexCost, setIndexCost] = useState(0.2);
  const [edge, setEdge] = useState(1);
  const [factorCost, setFactorCost] = useState(0.5);
  const r = money.factorVsIndex({ monthly, years, indexReturn, indexCost, factorEdge: edge, factorCost });
  const wins = r.difference > 0;

  return (
    <Panel
      how={
        <Picks
          rule={`What each grows to over ${years} years`}
          pick="max"
          options={[
            { label: "Plain index", value: r.plain, detail: `${(indexReturn - indexCost).toFixed(2)}% a year after costs` },
            { label: "Factor fund", value: r.factor, detail: `${(indexReturn + edge - factorCost).toFixed(2)}% a year after costs` },
          ]}
        />
      }
      inputs={
        <>
          <Field label="I invest every month" presets={[5000, 10000, 25000, 50000]} value={monthly} set={setMonthly} min={500} max={1000000} step={500} prefix="₹" />
          <Field label="For" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="The plain index returns" value={indexReturn} set={setIndexReturn} min={4} max={20} step={0.5} suffix="%" />
          <Field label="Plain index fund costs" value={indexCost} set={setIndexCost} min={0} max={2} step={0.05} suffix="%" hint="The expense ratio, direct plan. Nifty 50 index funds charge around 0.1% to 0.3%." />
          <Field label="The factor beats the index by" value={edge} set={setEdge} min={-5} max={5} step={0.25} suffix="%" hint="Before costs, every year on average. Negative if you think it trails." />
          <Field label="Factor fund costs" value={factorCost} set={setFactorCost} min={0} max={2} step={0.05} suffix="%" />
        </>
      }
      result={
        <Compare
          verdict={Math.abs(r.difference) < 1 ? "No difference." : wins ? "The factor fund, just." : "The plain index fund."}
          detail={`The factor fund has to beat the index by ${r.breakEvenEdge.toFixed(2)} points a year just to cover its higher cost. At ${edge}% it ends ${wins ? `${rupeesShort(r.difference)} ahead` : `${rupeesShort(-r.difference)} behind`}, and it will trail for years at a time on the way.`}
          left={{
            title: "Plain index",
            value: rupeesShort(r.plain),
            won: !wins,
            rows: [{ label: "Return after costs", value: `${(indexReturn - indexCost).toFixed(2)}%` }],
          }}
          right={{
            title: "Factor fund",
            value: rupeesShort(r.factor),
            won: wins,
            rows: [{ label: "Return after costs", value: `${(indexReturn + edge - factorCost).toFixed(2)}%` }],
          }}
        />
      }
    />
  );
}

/* ── Dispatch ──────────────────────────────────────────────────── */

const bySlug: Record<ToolSlug, () => React.JSX.Element> = {
  "take-home-salary": TakeHomeSalary,
  "tax-regime": TaxRegime,
  "emergency-fund": EmergencyFund,
  "term-cover": TermCover,
  "emi-calculator": EmiCalculator,
  "credit-card-payoff": CreditCardPayoff,
  "loan-prepayment": LoanPrepayment,
  "rent-vs-buy": RentVsBuy,
  "sip-calculator": SipCalculator,
  "step-up-sip": StepUpSip,
  "goal-planner": GoalPlanner,
  "lumpsum-calculator": LumpsumCalculator,
  "fd-calculator": FdCalculator,
  "ppf-calculator": PpfCalculator,
  "cagr-calculator": CagrCalculator,
  "inflation-calculator": InflationCalculator,
  "swp-calculator": SwpCalculator,
  "fire-calculator": FireCalculator,
  "hra-calculator": HraCalculator,
  "gratuity-calculator": GratuityCalculator,
  "capital-gains": CapitalGains,
  "epf-calculator": EpfCalculator,
  "nps-calculator": NpsCalculator,
  "ssy-calculator": SsyCalculator,
  "post-office-schemes": PostOfficeSchemes,
  "rd-calculator": RdCalculator,
  "balance-transfer": BalanceTransfer,
  "advance-tax": AdvanceTax,
  "freelance-tax": FreelanceTax,
  "nri-tax": NriTax,
  "tax-harvesting": TaxHarvesting,
  "gst-calculator": GstCalculator,
  "rent-receipts": RentReceipts,
  "apy-calculator": ApyCalculator,
  "xirr-calculator": XirrCalculator,
  "home-loan": HomeLoan,
  "car-loan": CarLoan,
  "core-satellite": CoreSatellite,
  "three-bucket": ThreeBucket,
  "coffee-can": CoffeeCan,
  "factor-investing": FactorInvesting,
};

export function Calculator({ slug }: { slug: ToolSlug }) {
  const C = bySlug[slug];
  return <C />;
}
