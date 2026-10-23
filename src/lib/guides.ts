import type { StepId, ToolSlug } from "@/lib/tools";

// Every guide on the site comes from this list.
// To add a guide: add an entry here and put its PDF in public/guides/<slug>.pdf,
// then set `pdf` to "/guides/<slug>.pdf".

export const topics = [
  "Investing basics",
  "Tax, made simple",
  "EPF and retirement",
  "Government schemes",
  "Buying smart",
  "Loans and debt",
  "Money psychology",
] as const;

export type Topic = (typeof topics)[number];

export type Guide = {
  slug: string;
  topic: Topic;
  /** First part of the title, set in ink. */
  title: string;
  /** Key phrase, set in green italic. */
  titleEm: string;
  subtitle: string;
  blurb: string;
  /** Path to the PDF under /public, or null until it is uploaded. */
  pdf: string | null;
  pages: number | null;
  /** Date the numbers were last checked, e.g. "9 Oct 2026". */
  verified: string | null;
  stats?: { label: string; value: string; accent?: boolean }[];
  statsNote?: string;
  notice?: string;
  inside?: { title: string; text: string }[];
  /** Topic-specific line added to the disclaimer. */
  disclaimerNote?: string;
  /** The calculator that runs this guide's numbers with your own. */
  tool?: ToolSlug;
};

export const guides: Guide[] = [
  {
    slug: "sip",
    tool: "sip-calculator",
    topic: "Investing basics",
    title: "₹500 a month",
    titleEm: "can become ₹17.6 lakh.",
    subtitle: "The full numbers from my SIP video, plus how to start your own SIP this week.",
    blurb: "The SIP guide: full numbers from the video, plus how to start your own SIP this week.",
    pdf: "/guides/sip.pdf",
    pages: 9,
    verified: null,
    stats: [
      { label: "Start with", value: "₹500", accent: true },
      { label: "Time", value: "30 yrs" },
      { label: "Assumed return", value: "12%" },
      { label: "Money grows", value: "9.8x", accent: true },
    ],
    statsNote:
      "₹1,80,000 invested over 30 years at an assumed 12% a year, compounded monthly. Returns are not guaranteed.",
    notice:
      "Most of the ₹17.6 lakh comes in the last ten years. Stopping early costs far more than starting small.",
    inside: [
      { title: "The numbers from the video.", text: "The full table, year by year." },
      { title: "How a SIP actually works.", text: "Units, NAV and what happens each month." },
      { title: "The three levers you control.", text: "Amount, time and staying put." },
      { title: "Starting your SIP, step by step.", text: "KYC to first debit." },
      { title: "Tax and good habits.", text: "What you pay when you withdraw." },
      { title: "Glossary and sources.", text: "Every term and every number, explained." },
    ],
    disclaimerNote:
      "Mutual fund investments are subject to market risks; read all scheme-related documents carefully.",
  },
  {
    slug: "epf-balance",
    topic: "EPF and retirement",
    title: "Check your PF balance",
    titleEm: "without the internet.",
    subtitle: "The SMS method from my video, plus what your EPF balance really means for retirement.",
    blurb: "The EPF guide: the SMS method, what your balance means, and what it could grow into.",
    pdf: "/guides/epf-balance.pdf",
    pages: 7,
    verified: "5 Oct 2026",
  },
  {
    slug: "bike-on-road-price",
    topic: "Buying smart",
    title: "The bike price",
    titleEm: "the showroom doesn't show.",
    subtitle: "Every dealer charge on the on-road price, and which ones you can question.",
    blurb: "Every dealer charge on the on-road price, which ones are fixed and which you can question.",
    pdf: "/guides/bike-on-road-price.pdf",
    pages: 10,
    verified: null,
  },
  {
    slug: "bank-auction-car",
    topic: "Buying smart",
    title: "Buying a bank-seized car",
    titleEm: "through an e-auction.",
    subtitle: "How repossessed cars get auctioned, how to register and bid, and what to check before you pay.",
    blurb: "How repossessed cars get auctioned, how to register and bid, and what to check before you pay.",
    pdf: "/guides/bank-auction-car.pdf",
    pages: 7,
    verified: "3 Oct 2026",
  },
  {
    slug: "govt-monthly-income",
    tool: "post-office-schemes",
    topic: "Government schemes",
    title: "A monthly income",
    titleEm: "from government schemes.",
    subtitle: "The post office and government options that pay every month, side by side.",
    blurb: "The post office and government options that pay every month, side by side.",
    pdf: "/guides/govt-monthly-income.pdf",
    pages: 9,
    verified: "30 Sep 2026",
  },
  {
    slug: "ssy",
    tool: "ssy-calculator",
    topic: "Government schemes",
    title: "Sukanya Samriddhi Yojana,",
    titleEm: "explained.",
    subtitle: "How SSY works for a daughter's future: deposits, lock-in, interest and tax.",
    blurb: "How SSY works for a daughter's future: deposits, lock-in, interest and tax.",
    pdf: "/guides/ssy.pdf",
    pages: 7,
    verified: "3 Oct 2026",
  },
  {
    slug: "epf-complete",
    tool: "epf-calculator",
    topic: "EPF and retirement",
    title: "₹10,000 a month into EPF",
    titleEm: "becomes ₹1.48 crore.",
    subtitle: "The complete EPF guide: what really reaches your account each month, the 8.25% that quietly compounds, and the withdrawal rules rewritten in July 2026.",
    blurb: "Everything EPF, in one place: the split between you and your employer, the interest, and the rules for taking money out.",
    pdf: "/guides/epf-complete.pdf",
    pages: 19,
    verified: "Sep 2026",
  },
  {
    slug: "nps-complete",
    tool: "nps-calculator",
    topic: "EPF and retirement",
    title: "₹5,000 a month from 30",
    titleEm: "could be ₹1.13 crore at 60.",
    subtitle: "The complete NPS guide: the extra ₹50,000 deduction, where your money actually goes, and the exit rules that changed in December 2025.",
    blurb: "NPS in full: the deduction only the old regime allows, how the money is split, and what happens at 60.",
    pdf: "/guides/nps-complete.pdf",
    pages: 12,
    verified: "Sep 2026",
  },
  {
    slug: "ppf-nps-nsc",
    tool: "ppf-calculator",
    topic: "Government schemes",
    title: "₹1.5 lakh a year, safely.",
    titleEm: "Where should it go?",
    subtitle: "PPF, NPS and NSC side by side for earners aged 25 to 35, at today's rates, with the tax rules most posts still get wrong.",
    blurb: "Three safe places for money you cannot afford to lose, compared on rate, lock-in and what the tax actually saves you.",
    pdf: "/guides/ppf-nps-nsc.pdf",
    pages: 10,
    verified: "1 Oct 2026",
  },
  {
    slug: "government-schemes",
    topic: "Government schemes",
    title: "₹9 lakh of cover",
    titleEm: "for under ₹500 a year.",
    subtitle: "Four government schemes your family should have switched on, and the four numbers the lists doing the rounds get wrong.",
    blurb: "Accident cover, life cover and cashless hospital treatment, for a few hundred rupees a year. Most of us never switch them on.",
    pdf: "/guides/government-schemes.pdf",
    pages: 10,
    verified: "Sep 2026",
  },
  {
    slug: "business-schemes",
    topic: "Government schemes",
    title: "Five government schemes",
    titleEm: "for your business.",
    subtitle: "Loans without collateral, subsidy you never pay back, and money for tech startups. What each gives, who can apply, and the exact portal.",
    blurb: "Mudra and four others, with the rules, the eligibility and the portal to apply on. Two changed this year.",
    pdf: "/guides/business-schemes.pdf",
    pages: 11,
    verified: "7 Oct 2026",
  },
  {
    slug: "kvp",
    tool: "post-office-schemes",
    topic: "Government schemes",
    title: "₹1 lakh becomes ₹2 lakh",
    titleEm: "in 115 months.",
    subtitle: "Kisan Vikas Patra in full: the fixed rate, the tax you will owe on it, and how to buy one.",
    blurb: "The post office scheme that doubles your money on a fixed date. The whole picture, including the tax nobody mentions.",
    pdf: "/guides/kvp.pdf",
    pages: 9,
    verified: null,
  },
  {
    slug: "investing-for-your-child",
    tool: "ssy-calculator",
    topic: "Investing basics",
    title: "Three ways to start",
    titleEm: "investing for your child.",
    subtitle: "Sukanya Samriddhi, NPS Vatsalya and children's mutual funds, compared, with the steps to open each one.",
    blurb: "The three options people mix up, side by side, with the latest rules and how to open each.",
    pdf: "/guides/investing-for-your-child.pdf",
    pages: 10,
    verified: "Sep 2026",
  },
  {
    slug: "three-crore",
    topic: "Investing basics",
    title: "The ₹3 crore plan",
    titleEm: "that forgets to subtract tax.",
    subtitle: "The chart doing the rounds has fine arithmetic. Here is the same plan with tax counted, which makes the first twelve years better and breaks the reset.",
    blurb: "A viral plan, rerun with tax included. It changes the answer in both directions.",
    pdf: "/guides/three-crore.pdf",
    pages: 4,
    verified: "Sep 2026",
  },
  {
    slug: "doubling-money",
    topic: "Investing basics",
    title: "How long does it take",
    titleEm: "to double your money?",
    subtitle: "One small rule that answers it for almost any investment, across eight instruments, and what it says about savings accounts.",
    blurb: "Divide 72 by your return. Once you see it, savings accounts and FDs look very different.",
    pdf: "/guides/doubling-money.pdf",
    pages: 7,
    verified: null,
  },
  {
    slug: "bond-trap",
    topic: "Investing basics",
    title: "The 12% bond",
    titleEm: "that isn't.",
    subtitle: "Why a bond's return is a price tag rather than a reward, and why anyone offering more is telling you something about the risk.",
    blurb: "Someone on television said bonds pay 12%. A weekend of checking said otherwise. The sources are in the guide.",
    pdf: "/guides/bond-trap.pdf",
    pages: 13,
    verified: null,
  },
  {
    slug: "car-cash-vs-emi",
    tool: "emi-calculator",
    topic: "Buying smart",
    title: "The ₹8 lakh",
    titleEm: "you didn't spend.",
    subtitle: "What the cash you would have handed over for a car does if you leave it invested instead, over five years and then over twenty.",
    blurb: "The car is the excuse. The guide is about what compounding does to money you do not touch.",
    pdf: "/guides/car-cash-vs-emi.pdf",
    pages: 11,
    verified: null,
  },
  {
    slug: "prepay-or-invest",
    tool: "loan-prepayment",
    topic: "Loans and debt",
    title: "Prepay the loan,",
    titleEm: "or invest the money?",
    subtitle: "There is a line at about 9.5%. Below it, invest. At 10% and above, prepay. A home loan sits on one side; almost every other loan sits on the other.",
    blurb: "The same model run across car, education, gold, personal and credit card debt. The answer flips, and it flips at a rate you can memorise.",
    pdf: "/guides/prepay-or-invest.pdf",
    pages: 8,
    verified: "Aug 2026",
  },
  {
    slug: "loan-closure-documents",
    topic: "Loans and debt",
    title: "You closed the loan.",
    titleEm: "Now collect your papers.",
    subtitle: "The five documents to collect after your last EMI, what each one should say, and the RBI rule that gives the lender 30 days.",
    blurb: "Most people pay the final EMI and go home. The papers stay with the bank, and it hurts years later when you try to sell.",
    pdf: "/guides/loan-closure-documents.pdf",
    pages: 10,
    verified: "Oct 2026",
  },
  {
    slug: "itr-form-picker",
    topic: "Tax, made simple",
    title: "Which ITR form",
    titleEm: "should you file?",
    subtitle: "Three questions and you have your answer, for FY 2025-26. The form depends on where your income comes from, not on what your friend filed.",
    blurb: "A 60-second flowchart for picking the right ITR form, so you do not file the wrong one and have to start again.",
    pdf: "/guides/itr-form-picker.pdf",
    pages: 4,
    verified: null,
  },
  {
    slug: "itr-filing-checklist",
    topic: "Tax, made simple",
    title: "File your ITR",
    titleEm: "without a mistake.",
    subtitle: "A step-by-step checklist for salaried employees for FY 2025-26, from linking PAN to e-verifying, with the deadline and the late fee.",
    blurb: "Tick each box and file clean. Includes what to do before you start, which most guides skip.",
    pdf: "/guides/itr-filing-checklist.pdf",
    pages: 6,
    verified: "Jul 2026",
  },
  {
    slug: "step-up-sip",
    tool: "step-up-sip",
    topic: "Investing basics",
    title: "₹20,000 salary.",
    titleEm: "A crore is still possible.",
    subtitle: "The full numbers behind the ₹4,000 SIP video, the step-up explained properly, and how to set it up this week.",
    blurb: "₹4,000 a month for 30 years comes to about ₹1.41 crore. Raise it 10% a year and the same plan reaches ₹3.53 crore.",
    pdf: "/guides/step-up-sip.pdf",
    pages: 10,
    verified: null,
  },
  {
    slug: "negative-balance",
    topic: "Loans and debt",
    title: "Bank account in minus?",
    titleEm: "That fine may not be legal.",
    subtitle:
      "The full RBI rules behind my negative balance video, plus the exact email and the complaint steps to get it fixed.",
    blurb:
      "A bank cannot push your savings account below zero with minimum balance fines alone. The rule, the email to send, and where to complain free if they ignore you.",
    pdf: "/guides/negative-balance.pdf",
    pages: 9,
    verified: null,
    stats: [
      { label: "Fine floor", value: "₹0", accent: true },
      { label: "Bank gets", value: "30 days" },
      { label: "Then escalate", value: "90 days" },
      { label: "Fee to complain", value: "₹0", accent: true },
    ],
    statsNote:
      "Minimum balance charges alone must not take a savings account below zero. The 30 days is how long the bank has to reply, not a deadline to reverse the fine.",
    notice:
      "The rule protects you from minimum balance fines only. If the minus came from something else, a loan EMI or a cheque bounce charge, ask the bank to explain each debit first.",
    inside: [
      { title: "Zero is the floor for fines.", text: "The RBI rule, and where it is written." },
      { title: "Dormant accounts get more cover.", text: "No minimum balance fine at all since April 2024." },
      { title: "The email to send your bank.", text: "Ready to copy, with what to attach." },
      { title: "Bank first, then the Ombudsman.", text: "30 days to reply, then cms.rbi.org.in, free." },
      { title: "What the video got slightly wrong.", text: "The 30 days is to respond, not to reverse." },
    ],
    disclaimerNote:
      "It covers minimum balance charges and inoperative accounts; other debits follow different rules. I am not a lawyer either. Check the latest RBI notification before acting.",
  },
  {
    slug: "car-tcs-refund",
    topic: "Tax, made simple",
    title: "Bought a car above ₹10 lakh?",
    titleEm: "That 1% is yours to claim.",
    subtitle: "The full numbers from my car TCS video: where that 1% goes, how it comes back, and what to ask for at the showroom.",
    blurb: "The dealer collects 1% extra above ₹10 lakh. It is not a cost, it is your own tax paid in advance, and nobody returns it unless you claim it.",
    pdf: "/guides/car-tcs-refund.pdf",
    pages: 9,
    verified: null,
  },
  {
    slug: "rbi-floating-rate-bond",
    topic: "Government schemes",
    title: "An RBI bond that pays",
    titleEm: "8.05% from ₹1,000.",
    subtitle:
      "The full picture of the Floating Rate Savings Bond from my video, and exactly how to buy one.",
    blurb:
      "Government-backed, ₹1,000 to start, interest paid every January and July for seven years. How the rate moves, what you keep after tax, and how to apply.",
    pdf: "/guides/rbi-floating-rate-bond.pdf",
    pages: 9,
    verified: "Oct 2026",
    stats: [
      { label: "Start with", value: "₹1,000", accent: true },
      { label: "Rate now", value: "8.05%", accent: true },
      { label: "Interest paid", value: "6-monthly" },
      { label: "Tenure", value: "7 yrs" },
    ],
    statsNote:
      "The rate is the NSC rate plus 0.35%, reset every 1 January and 1 July. 8.05% is the rate for Jul to Dec 2026.",
    notice:
      "Interest is paid out, not added back, and it is taxed at your slab. Below 60 the money is locked in for the full seven years.",
    inside: [
      { title: "What your money actually earns.", text: "Payouts from ₹1,000 to ₹10 lakh." },
      { title: "Why it's called floating.", text: "The NSC link and the rate so far." },
      { title: "The rules, in one table.", text: "Who can buy, limits, nomination." },
      { title: "Exiting early and maturity.", text: "Senior citizens only, and what it costs." },
      { title: "Two ways to buy it.", text: "RBI Retail Direct or a bank branch, step by step." },
      { title: "What you keep after tax.", text: "Your slab, your real return." },
    ],
    disclaimerNote:
      "The rate resets every six months, so the payouts shown are illustrations at today's 8.05%. Check the latest terms with RBI or your bank before investing.",
  },
  {
    slug: "gold-locker-od",
    topic: "Loans and debt",
    title: "Your locker covers ₹3 lakh.",
    titleEm: "Your gold is worth ₹25 lakh.",
    subtitle:
      "The full numbers from my locker video, how a Gold OD works, and how to set one up.",
    blurb:
      "A bank locker pays back at most 100 times its yearly rent, whatever is inside. Why pledged gold in a Gold OD is protected differently, what it really costs, and how to open one.",
    pdf: "/guides/gold-locker-od.pdf",
    pages: 10,
    verified: "Oct 2026",
    stats: [
      { label: "Locker payout cap", value: "100x rent" },
      { label: "OD limit, over ₹5L", value: "up to 75%", accent: true },
      { label: "Interest on", value: "Used amt", accent: true },
      { label: "Gold returned in", value: "7 days" },
    ],
    statsNote:
      "The 75% is of the gold metal's value, not the shop bill. For ₹25 lakh of jewellery, expect a limit of around ₹16 lakh.",
    notice:
      "A Gold OD is a loan. An unused limit costs no interest, but if you draw and leave dues unpaid, the lender can auction the gold after notice.",
    inside: [
      { title: "What a locker actually pays back.", text: "The 100x rent cap, by locker size." },
      { title: "Why pledged gold is different.", text: "Bank liability, certificate and bailment law." },
      { title: "How a Gold OD works.", text: "Pay interest only on what you draw." },
      { title: "75% of which value?", text: "The ₹25 lakh from the video, worked through." },
      { title: "Locker vs Gold OD over three years.", text: "Every cost side by side." },
      { title: "Opening one, and your rights.", text: "What to carry, what to check, RBI's 2025 rules." },
    ],
    disclaimerNote:
      "A Gold OD is a loan, and rates, fees and locker rents differ by bank and branch. Read your sanction letter and locker agreement before acting.",
  },
  {
    slug: "atm-failed-transaction",
    topic: "Loans and debt",
    title: "₹20,000 debited, no cash?",
    titleEm: "Your money is safe.",
    subtitle:
      "What to do when an ATM keeps your money, how the refund works, and the ₹100 a day rule your bank has to follow.",
    blurb:
      "An ATM debit with no cash must be reversed within five days, and from day six the bank owes you ₹100 a day without being asked. What to note at the machine, what to tell your bank, and when to go to the RBI Ombudsman, free.",
    pdf: "/guides/atm-failed-transaction.pdf",
    pages: 9,
    verified: "Oct 2026",
    stats: [
      { label: "Refund within", value: "T+5 days", accent: true },
      { label: "Late penalty", value: "₹100/day", accent: true },
      { label: "Bank reply", value: "30 days" },
      { label: "RBI complaint", value: "₹0 fee", accent: true },
    ],
    statsNote:
      "T is the day the ATM failed, and the five days are calendar days, Sundays and holidays included. The ₹100 a day is owed even if you never complained.",
    notice:
      "You don't have to fight for the refund. The bank's clock starts the day the ATM failed, whether you complained or not.",
    inside: [
      { title: "The three things to remember.", text: "And the order the video got slightly wrong." },
      { title: "Where your money actually went.", text: "The ATM's log, and how reconciliation finds it." },
      { title: "The first 10 minutes at the ATM.", text: "What to note and photograph before you leave." },
      { title: "What to tell your bank.", text: "The details they ask for, and a message to copy." },
      { title: "The ₹100 a day rule.", text: "How the clock runs, worked through in rupees." },
      { title: "Going to the RBI Ombudsman.", text: "When you can, and how to file free." },
      { title: "The glossary, in plain words.", text: "Every term, with a line in Tamil." },
    ],
    disclaimerNote:
      "These are RBI rules for domestic transactions as of October 2026, and they can change. I am not a lawyer either. Check rbi.org.in or with your bank before acting.",
  },
  {
    slug: "fd-ladder",
    tool: "fd-calculator",
    topic: "Investing basics",
    title: "Don't lock ₹3 lakh in one FD.",
    titleEm: "Build a ladder instead.",
    subtitle:
      "A complete guide to FD laddering: real numbers, what an emergency costs, and how to set up your own ladder at the bank.",
    blurb:
      "Split ₹3 lakh into FDs of 1, 2 and 3 years and one matures every year, without breaking anything. The honest numbers, what an emergency in month 8 costs, and the one bank setting that makes or breaks the ladder.",
    pdf: "/guides/fd-ladder.pdf",
    pages: 10,
    verified: "Oct 2026",
    stats: [
      { label: "Total", value: "₹3 lakh", accent: true },
      { label: "Split into", value: "3 FDs" },
      { label: "Tenures", value: "1 · 2 · 3 yrs" },
      { label: "Matures", value: "Every year", accent: true },
    ],
    statsNote:
      "Worked out at a large public-sector bank's October 2026 rates: 6.25% for 1 year, 6.40% for 2 years and 6.30% for 3 years, compounded quarterly, before tax.",
    notice:
      "A ladder is not a return trick. Breaking one ₹1 lakh FD in month 8 loses ₹580 of interest; breaking one ₹3 lakh FD loses ₹1,844.",
    inside: [
      { title: "The basic plan.", text: "₹3 lakh, three FDs, one maturity every year." },
      { title: "Three things people get wrong.", text: "Returns, safety, and never breaking an FD." },
      { title: "The ladder, year by year.", text: "How every rung rolls into a 3-year FD." },
      { title: "Ladder vs one big FD.", text: "Normal years, and an emergency in month 8." },
      { title: "Make it fit your life.", text: "The five dials: rungs, gaps, size, interest, banks." },
      { title: "Set it up this week.", text: "Six steps, and the maturity setting most people miss." },
      { title: "Tax, safety and good habits.", text: "TDS, Form 121 and the ₹5 lakh DICGC limit." },
      { title: "The glossary, in plain words.", text: "Every term, with a line in Tanglish." },
    ],
    disclaimerNote:
      "FD rates, penalties, tax rules and insurance limits change, and differ by bank. The figures are examples on stated assumptions, not promised returns. Check your bank's current terms before acting.",
  },
];

/**
 * The order to sort money out in, early in a career.
 *
 * Investing is the interesting part, so it is where almost everyone
 * starts. It belongs at step six. Each step here exists because it
 * protects the one after it: there is no point starting a SIP you will
 * break the first time the car needs a gearbox.
 */
export type Step = {
  id: StepId;
  title: string;
  /** What to actually do. */
  what: string;
  /** Why it sits here and not later. */
  why: string;
  /** Guides covering it. Empty while the library fills out. */
  guides: string[];
};

export const steps: Step[] = [
  {
    id: "what-you-earn",
    title: "Know what you actually earn",
    what: "Read one salary slip line by line. Basic, HRA, PF, professional tax, TDS. CTC is not your salary and never was.",
    why: "Every number after this one is built on it. You cannot budget, insure or invest around a figure you have never looked at.",
    guides: ["epf-balance", "epf-complete", "itr-form-picker", "itr-filing-checklist"],
  },
  {
    id: "emergency-fund",
    title: "One month of expenses. Then six.",
    what: "Park it somewhere boring you can reach the same day. A separate savings account is fine. It is not an investment and it is not meant to grow.",
    why: "Without it, the first real emergency is paid for with a credit card or by selling investments at the worst moment. One month buys breathing room; six buys a job search.",
    guides: [],
  },
  {
    id: "insure",
    title: "Insure the earner, not the investment",
    what: "Your own health cover, because the one from work ends the day the job does. Term cover only if somebody depends on your income. Nothing that promises returns.",
    why: "One hospital stay can undo years of saving, so this does not wait for the full six months. Insurance sold as investment pays badly at both jobs.",
    guides: ["government-schemes"],
  },
  {
    id: "expensive-debt",
    title: "Clear anything costing more than you can earn",
    what: "Credit card balances, personal loans, pay-later. Pay the highest rate first and stop using it while you do.",
    why: "A card charges around 40% a year. No investment reliably returns that, so every rupee clearing it beats every rupee invested beside it.",
    guides: ["prepay-or-invest", "loan-closure-documents"],
  },
  {
    id: "real-price",
    title: "Know the real price before you buy",
    what: "On-road, not ex-showroom. Interest over the full tenure, not the monthly number the salesperson leads with.",
    why: "The big purchases of your twenties set your fixed costs for years. A loan taken casually quietly decides how much you can invest later.",
    guides: ["bike-on-road-price", "bank-auction-car", "car-cash-vs-emi", "car-tcs-refund"],
  },
  {
    id: "invest",
    title: "Then invest. Monthly, and boring.",
    what: "A fixed amount on a fixed date into something diversified, for money you will not need for seven years or more. Raise it whenever your income rises.",
    why: "This is step six, not step one. Started here it compounds quietly for decades, and your early years are the ones with the most time in them.",
    guides: ["sip", "step-up-sip", "ppf-nps-nsc", "nps-complete", "investing-for-your-child", "ssy", "kvp", "rbi-floating-rate-bond", "govt-monthly-income", "business-schemes"],
  },
  {
    id: "spot-a-scam",
    title: "Learn what a scam looks like",
    what: "Guaranteed high returns, pressure to decide today, tips groups, doubling schemes, and anyone who gains when you buy.",
    why: "Everything above can be undone in one afternoon. The pitches all sound different and work the same way, so the pattern is worth more than any single warning.",
    guides: ["bond-trap", "three-crore", "doubling-money"],
  },
];

export function getGuide(slug: string) {
  return guides.find((g) => g.slug === slug);
}

export function guidesInTopic(topic: Topic) {
  return guides.filter((g) => g.topic === topic);
}

export function relatedGuides(guide: Guide, n = 2) {
  const same = guides.filter((g) => g.slug !== guide.slug && g.topic === guide.topic);
  const rest = guides.filter((g) => g.slug !== guide.slug && g.topic !== guide.topic);
  return [...same, ...rest].slice(0, n);
}

/** The first page of the PDF, rendered to an image at build time. */
export function coverHref(slug: string) {
  return `/guides/covers/${slug}.webp`;
}

/** The guide's own 1200x630 social card, built from its title and cover. */
export function guideOgHref(slug: string) {
  return `/guides/og/${slug}.jpg`;
}

export function guideHref(slug: string) {
  return `/guides/${slug}/`;
}
