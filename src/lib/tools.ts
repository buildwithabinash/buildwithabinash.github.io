// The calculators. The maths for all of them lives in money.ts.
//
// Each one is tied to a step on the home page ladder, so the library
// reads in the order someone should actually work through it.

export type ToolSlug =
  | "take-home-salary"
  | "tax-regime"
  | "emergency-fund"
  | "term-cover"
  | "emi-calculator"
  | "loan-prepayment"
  | "credit-card-payoff"
  | "rent-vs-buy"
  | "sip-calculator"
  | "step-up-sip"
  | "goal-planner"
  | "lumpsum-calculator"
  | "fd-calculator"
  | "ppf-calculator"
  | "cagr-calculator"
  | "inflation-calculator"
  | "swp-calculator"
  | "fire-calculator";

/** Matches the id of a step in guides.ts. */
export type StepId =
  | "what-you-earn"
  | "emergency-fund"
  | "insure"
  | "expensive-debt"
  | "real-price"
  | "invest"
  | "spot-a-scam";

export type Tool = {
  slug: ToolSlug;
  step: StepId;
  /** First part of the name, set in ink. */
  name: string;
  /** Key phrase, set in green italic. */
  nameEm: string;
  short: string;
  blurb: string;
  /** What the calculator assumes, said plainly. */
  assumes: string;
};

export const tools: Tool[] = [
  /* ── Step 1: what you earn ──────────────────────────────────── */
  {
    slug: "take-home-salary",
    step: "what-you-earn",
    name: "Take-home salary",
    nameEm: "calculator.",
    short: "What of your CTC actually arrives.",
    blurb:
      "CTC is what you cost your employer. This works out what lands in your account each month once PF, gratuity, professional tax and income tax come out.",
    assumes:
      "Assumes basic pay is the share you set, PF at 12% on both sides, and gratuity at 4.81% of basic. PF can be worked out on your whole basic or capped at the ₹15,000 statutory wage, and professional tax is set by your state, so both are yours to set. Your slip may split things differently, so treat it as close rather than exact.",
  },
  {
    slug: "tax-regime",
    step: "what-you-earn",
    name: "Old or new regime",
    nameEm: "compared.",
    short: "Which tax regime costs you less.",
    blurb:
      "The new regime has lower rates and almost no deductions. The old one has higher rates and lets you claim. Which wins depends entirely on how much you actually claim.",
    assumes:
      "Uses the slabs for the year shown on the page, for someone under 60 on salary income. Covers the standard deduction, each deduction cap, the section 87A rebate, marginal relief, surcharge and cess. Employer NPS under 80CCD(2) is the one deduction both regimes allow, so it comes off either way. It does not handle capital gains or business income.",
  },

  /* ── Step 2: the safety net ─────────────────────────────────── */
  {
    slug: "emergency-fund",
    step: "emergency-fund",
    name: "Emergency fund",
    nameEm: "calculator.",
    short: "How much, and how long to get there.",
    blurb:
      "The amount that keeps one bad month from becoming a bad year, and how long it takes to build at what you can set aside.",
    assumes:
      "Counts only what you can reach the same day. Money in equity or locked deposits is not an emergency fund, however much of it there is.",
  },

  /* ── Step 3: protection ─────────────────────────────────────── */
  {
    slug: "term-cover",
    step: "insure",
    name: "Term cover",
    nameEm: "you need.",
    short: "The sum assured that would actually hold.",
    blurb:
      "Not a multiple of your salary pulled out of the air. Years of expenses for the people who depend on you, plus what you owe, less what already exists.",
    assumes:
      "Income replacement, in today's rupees. Assumes your dependants keep spending roughly what the household spends now. If you have nobody depending on your income, the answer is usually nothing.",
  },

  /* ── Step 4: expensive debt ─────────────────────────────────── */
  {
    slug: "emi-calculator",
    step: "expensive-debt",
    name: "EMI",
    nameEm: "calculator.",
    short: "What a loan really costs.",
    blurb:
      "The monthly instalment on a loan, and the part most people never look at: the total interest you pay on top of what you borrowed.",
    assumes:
      "A fixed rate for the whole tenure. Leaves out processing fees and insurance, which lenders add separately.",
  },
  {
    slug: "credit-card-payoff",
    step: "expensive-debt",
    name: "Credit card",
    nameEm: "payoff.",
    short: "How long a balance really takes.",
    blurb:
      "Card interest is quoted monthly because the yearly number is alarming. Put in the balance and what you pay each month to see how long it takes and what it costs.",
    assumes:
      "A fixed balance with nothing new added. If the payment does not cover the month's interest, the balance never falls, and the calculator says so. The minimum-due comparison assumes the minimum is recalculated on the falling balance, which is why it drags on so long.",
  },
  {
    slug: "loan-prepayment",
    step: "expensive-debt",
    name: "Loan prepayment",
    nameEm: "calculator.",
    short: "What paying extra actually saves.",
    blurb:
      "Paying a little more each month comes off the principal, so it cuts both the tenure and the interest. This shows how much of each.",
    assumes:
      "Assumes the extra goes to principal every month, that a one-off amount is paid today, and that the rate stays fixed. Check your lender does not charge a prepayment fee on fixed-rate loans.",
  },

  /* ── Step 5: big purchases ──────────────────────────────────── */
  {
    slug: "rent-vs-buy",
    step: "real-price",
    name: "Rent or buy",
    nameEm: "compared.",
    short: "Which leaves you better off.",
    blurb:
      "Buying is not automatically better than renting. This compares what you would be worth after a set number of years either way, with the renter investing the difference.",
    assumes:
      "The buyer's wealth is the house less the loan. The renter invests the deposit, the stamp duty the buyer hands over, and whatever the buyer pays above their rent each month. It leaves out the tax deduction on home loan interest, which favours buying a little.",
  },

  /* ── Step 6: investing ──────────────────────────────────────── */
  {
    slug: "sip-calculator",
    step: "invest",
    name: "SIP",
    nameEm: "calculator.",
    short: "What a monthly investment grows to.",
    blurb:
      "Put in what you can invest each month and for how long. It shows what you put in, what the growth adds, and what you end up with.",
    assumes:
      "Assumes you invest on the first of every month and earn the same return every year. Real markets go up and down, so treat the total as a rough shape, not a promise.",
  },
  {
    slug: "step-up-sip",
    step: "invest",
    name: "Step-up SIP",
    nameEm: "calculator.",
    short: "What raising it every year does.",
    blurb:
      "Most people's income rises and their SIP does not. Raising it by even 10% a year changes the ending far more than picking a better fund ever will.",
    assumes: "The increase happens once a year on the anniversary, and the return is steady throughout.",
  },
  {
    slug: "goal-planner",
    step: "invest",
    name: "Goal planner",
    nameEm: "calculator.",
    short: "The monthly amount a target needs.",
    blurb:
      "Work backwards instead of forwards. Name the amount and the year you need it, and this says what it takes every month to get there.",
    assumes:
      "Enter the target in today's rupees; it is raised for inflation at the rate you set, because a goal priced today costs more by the time you reach it.",
  },
  {
    slug: "lumpsum-calculator",
    step: "invest",
    name: "Lumpsum",
    nameEm: "calculator.",
    short: "What one amount grows to.",
    blurb:
      "For money you invest once and leave alone: a bonus, a maturity amount, an inheritance. Shows what compounding does to it over time.",
    assumes: "The return is earned once a year and nothing is withdrawn along the way.",
  },
  {
    slug: "fd-calculator",
    step: "invest",
    name: "Fixed deposit",
    nameEm: "calculator.",
    short: "What an FD matures to.",
    blurb:
      "The maturity amount on a deposit, compounded quarterly the way banks do it. Useful for comparing against what inflation does over the same years.",
    assumes:
      "Quarterly compounding and no premature withdrawal. Interest is taxed at your slab every year whether or not you withdraw it, which is taken off here.",
  },
  {
    slug: "ppf-calculator",
    step: "invest",
    name: "PPF",
    nameEm: "calculator.",
    short: "What fifteen years of PPF builds.",
    blurb:
      "A deposit at the start of each year for fifteen years, at the current rate. Slow, dull, government-backed and tax-free at every stage.",
    assumes:
      "The rate stays where it is, which it will not: it is reset every quarter. The yearly cap is ₹1.5 lakh.",
  },
  {
    slug: "cagr-calculator",
    step: "invest",
    name: "CAGR",
    nameEm: "calculator.",
    short: "The real yearly return.",
    blurb:
      "Something doubling in seven years is not a 100% return. This turns a start value, an end value and a number of years into the yearly rate they imply.",
    assumes: "One amount in and one out, with nothing added or withdrawn between.",
  },
  {
    slug: "inflation-calculator",
    step: "invest",
    name: "Inflation",
    nameEm: "calculator.",
    short: "What your money will be worth.",
    blurb:
      "The quiet reason savings accounts lose. Shows what something costing a given amount today will cost later, and what today's money will be worth by then.",
    assumes: "A steady rate every year. Your own inflation depends on what you buy, and is often higher than the published figure.",
  },
  {
    slug: "swp-calculator",
    step: "invest",
    name: "Withdrawal plan",
    nameEm: "calculator.",
    short: "How long a corpus lasts.",
    blurb:
      "The other side of a SIP. Put in what you have and what you want to draw each month, and this says how long before it runs out.",
    assumes:
      "A steady return while you draw. A bad run early in retirement does far more damage than the same run later, which this cannot show.",
  },
  {
    slug: "fire-calculator",
    step: "invest",
    name: "FIRE",
    nameEm: "calculator.",
    short: "The number you need to stop.",
    blurb:
      "How much you need invested before your money can cover your life, and roughly how long it takes to get there from where you are.",
    assumes:
      "Works in today's rupees: the return is adjusted for inflation, so the target does not have to be inflated separately. Assumes your spending stays the same in real terms.",
  },
];

export const toolHref = (slug: string) => `/tools/${slug}/`;
export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolsForStep = (step: StepId) => tools.filter((t) => t.step === step);

/**
 * The four on the home page. They trace the whole path in miniature — what you
 * earn, what the taxman leaves, the safety net, then investing — rather than
 * four from one group. Everything else lives on /tools/.
 */
const FEATURED: ToolSlug[] = ["take-home-salary", "tax-regime", "emergency-fund", "sip-calculator"];
export const featuredTools = FEATURED.map((slug) => tools.find((t) => t.slug === slug)).filter(
  (t): t is Tool => Boolean(t),
);

/** The headings the library is grouped under, in ladder order. */
export const toolGroups: { step: StepId; title: string }[] = [
  { step: "what-you-earn", title: "What you earn" },
  { step: "emergency-fund", title: "Your safety net" },
  { step: "insure", title: "Protection" },
  { step: "expensive-debt", title: "What you owe" },
  { step: "real-price", title: "Big purchases" },
  { step: "invest", title: "Investing and retirement" },
];
