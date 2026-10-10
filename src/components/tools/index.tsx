"use client";

import { useState } from "react";
import * as money from "@/lib/money";
import {
  EPF_WAGE_CEILING,
  PPF_MAX_YEARLY,
  PPF_RATE,
  PPF_YEARS,
  TAX_CHECKED,
  TAX_YEAR,
  rupees,
  rupeesShort,
  yearsAndMonths,
} from "@/lib/money";
import type { ToolSlug } from "@/lib/tools";
import { Choice, Compare, Field, Panel, Result } from "./ui";

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
  const caps = money.DEDUCTION_CAPS;
  const on = (k: keyof money.Deductions) => (v: number) => setD((prev) => ({ ...prev, [k]: v }));

  return (
    <Panel
      inputs={
        <>
          <Field label="My salary, a year" value={salary} set={setSalary} min={300000} max={10000000} step={25000} prefix="₹" />

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
      inputs={
        <>
          <Field label="I spend each month" value={expenses} set={setExpenses} min={5000} max={300000} step={1000} prefix="₹" />
          <Field
            label="Months I want covered"
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
      inputs={
        <>
          <Field label="Household spends each month" value={expenses} set={setExpenses} min={5000} max={300000} step={1000} prefix="₹" />
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
      inputs={
        <>
          <Field label="I borrow" value={amount} set={setAmount} min={10000} max={20000000} step={10000} prefix="₹" />
          <Field label="Over" value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="Interest rate" value={rate} set={setRate} min={1} max={24} step={0.1} suffix="%" />
        </>
      }
      result={
        <Result
          caption="Every month you pay"
          headline={rupees(r.monthly)}
          sub={`Over ${r.months} payments you hand over ${rupees(r.interest)} in interest.`}
          split={{ aLabel: "What you borrowed", a: amount, bLabel: "Interest", b: r.interest }}
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
      inputs={
        <>
          <Field label="Balance on the card" value={balance} set={setBalance} min={1000} max={2000000} step={1000} prefix="₹" />
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
      inputs={
        <>
          <Field label="Still owed" value={outstanding} set={setOutstanding} min={50000} max={20000000} step={50000} prefix="₹" />
          <Field label="Interest rate" value={rate} set={setRate} min={1} max={24} step={0.1} suffix="%" />
          <Field label="Years left" value={years} set={setYears} min={1} max={30} suffix="yrs" />
          <Field label="Extra I pay each month" value={extra} set={setExtra} min={0} max={200000} step={500} prefix="₹" />
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
      inputs={
        <>
          <Field label="Every month I invest" value={monthly} set={setMonthly} min={500} max={200000} step={500} prefix="₹" />
          <Field label="For" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field
            label="Expected return"
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
          split={{ aLabel: "You put in", a: r.invested, bLabel: "Growth", b: r.gain }}
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
      inputs={
        <>
          <Field label="Starting each month with" value={monthly} set={setMonthly} min={500} max={200000} step={500} prefix="₹" />
          <Field
            label="Raised every year by"
            value={step}
            set={setStep}
            min={0}
            max={25}
            suffix="%"
            hint="Match it to your raise. Even 10% a year changes the ending enormously."
          />
          <Field label="For" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="Expected return" value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
        </>
      }
      result={
        <Result
          caption="After that time"
          headline={rupeesShort(r.future)}
          sub={`Against ${rupeesShort(flat.future)} if you never raised it. By the last year you would be investing ${rupees(r.finalMonthly)} a month.`}
          split={{ aLabel: "You put in", a: r.invested, bLabel: "Growth", b: r.gain }}
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
      inputs={
        <>
          <Field label="I need" value={target} set={setTarget} min={50000} max={100000000} step={50000} prefix="₹" />
          <Field label="In" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="I have towards it" value={have} set={setHave} min={0} max={50000000} step={10000} prefix="₹" />
          <Field
            label="Expected return"
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
      inputs={
        <>
          <Field label="I invest once" value={amount} set={setAmount} min={1000} max={10000000} step={1000} prefix="₹" />
          <Field label="And leave it for" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field label="Expected return" value={rate} set={setRate} min={1} max={20} step={0.5} suffix="%" />
        </>
      }
      result={
        <Result
          caption="It becomes"
          headline={rupeesShort(r.future)}
          sub={`That is ${(r.future / r.invested).toFixed(1)}× what you started with, worth about ${rupeesShort(real)} in today’s money.`}
          split={{ aLabel: "You put in", a: r.invested, bLabel: "Growth", b: r.gain }}
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
      inputs={
        <>
          <Field label="I deposit" value={amount} set={setAmount} min={1000} max={10000000} step={1000} prefix="₹" />
          <Field label="For" value={years} set={setYears} min={1} max={10} step={0.5} suffix="yrs" />
          <Field label="Interest rate" value={rate} set={setRate} min={1} max={12} step={0.1} suffix="%" />
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
      inputs={
        <>
          <Field
            label="I deposit each year"
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
      inputs={
        <>
          <Field label="Something costs today" value={amount} set={setAmount} min={100} max={100000000} step={1000} prefix="₹" />
          <Field label="In" value={years} set={setYears} min={1} max={40} suffix="yrs" />
          <Field
            label="Inflation"
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
      inputs={
        <>
          <Field label="I have invested" value={corpus} set={setCorpus} min={100000} max={200000000} step={100000} prefix="₹" />
          <Field label="I draw each month" value={withdrawal} set={setWithdrawal} min={1000} max={1000000} step={1000} prefix="₹" />
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
      inputs={
        <>
          <Field label="I spend each month" value={expenses} set={setExpenses} min={5000} max={500000} step={1000} prefix="₹" />
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
};

export function Calculator({ slug }: { slug: ToolSlug }) {
  const C = bySlug[slug];
  return <C />;
}
