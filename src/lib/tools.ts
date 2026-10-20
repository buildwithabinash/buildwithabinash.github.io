// The calculators. The maths for all of them lives in money.ts.
//
// Each one is tied to a step on the home page ladder, and to a module
// that /tools/ is browsed by.

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
  | "fire-calculator"
  | "hra-calculator"
  | "gratuity-calculator"
  | "capital-gains"
  | "epf-calculator"
  | "nps-calculator"
  | "ssy-calculator"
  | "post-office-schemes"
  | "rd-calculator"
  | "balance-transfer"
  | "advance-tax"
  | "freelance-tax"
  | "nri-tax"
  | "tax-harvesting"
  | "gst-calculator"
  | "rent-receipts"
  | "apy-calculator"
  | "xirr-calculator"
  | "home-loan"
  | "car-loan"
  | "core-satellite"
  | "three-bucket"
  | "coffee-can"
  | "factor-investing";

/**
 * The modules the library is browsed by, the way people search for them:
 * "a tax calculator", "a government scheme calculator". The ladder steps
 * still decide the order on the home page; modules are for /tools/.
 */
export type ModuleId = "salary-tax" | "govt-schemes" | "investing" | "loans" | "planning" | "strategies";

export const modules: { id: ModuleId; title: string; short: string }[] = [
  { id: "salary-tax", title: "Salary and tax", short: "What you earn, and what the taxman leaves." },
  { id: "govt-schemes", title: "Government schemes", short: "PPF, EPF, NPS, SSY and the post office." },
  { id: "investing", title: "Investing", short: "SIPs, lumpsums, deposits and the returns they imply." },
  { id: "loans", title: "Loans and debt", short: "EMIs, prepaying, switching lenders and cards." },
  { id: "planning", title: "Safety and retirement", short: "Emergency fund, cover, inflation and FIRE." },
  { id: "strategies", title: "Strategies", short: "How to arrange your money, not just how to grow it." },
];

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
  module: ModuleId;
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
    module: "salary-tax",
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
    module: "salary-tax",
    name: "Old or new regime",
    nameEm: "compared.",
    short: "Which tax regime costs you less.",
    blurb:
      "The new regime has lower rates and almost no deductions. The old one has higher rates and lets you claim. Which wins depends entirely on how much you actually claim.",
    assumes:
      "Uses the slabs for the year shown on the page, for someone under 60 on salary income. Covers the standard deduction, each deduction cap, the section 87A rebate, marginal relief, surcharge and cess. Employer NPS under 80CCD(2) is the one deduction both regimes allow, so it comes off either way. It does not handle capital gains or business income.",
  },
  {
    slug: "hra-calculator",
    step: "what-you-earn",
    module: "salary-tax",
    name: "HRA exemption",
    nameEm: "calculator.",
    short: "How much of your HRA escapes tax.",
    blurb:
      "Paying rent does not make your whole HRA tax free. Only the smallest of three amounts is, and which one wins depends on your rent, your basic and where you live.",
    assumes:
      "Old regime only: the new regime gives no HRA exemption at all. Delhi, Mumbai, Kolkata and Chennai count as metros at 50% of basic; everywhere else is 40%. Add DA to basic if it counts towards retirement benefits. Rent above ₹1 lakh a year needs your landlord's PAN.",
  },
  {
    slug: "gratuity-calculator",
    step: "what-you-earn",
    module: "salary-tax",
    name: "Gratuity",
    nameEm: "calculator.",
    short: "What you get for the years you stayed.",
    blurb:
      "The lump sum your employer owes when you leave after enough years. Fifteen days of pay for every year you worked, and the rounding matters more than people think.",
    assumes:
      "Last drawn basic plus DA. Under the Gratuity Act a month counts as 26 days and a final part-year over six months counts as a full year; outside it, 30 days and completed years only. Usually needs five years of service, less for fixed-term staff under the new labour codes. Up to ₹20 lakh is tax free.",
  },
  {
    slug: "capital-gains",
    step: "what-you-earn",
    module: "salary-tax",
    name: "Capital gains",
    nameEm: "tax.",
    short: "The tax on what you sold for a profit.",
    blurb:
      "Shares, mutual funds, gold and property are taxed differently depending on how long you held them. Put in what you paid and what you got, and see what you owe.",
    assumes:
      "Rates for sales from 23 July 2024: equity long term after 12 months at 12.5% above ₹1.25 lakh a year, 20% if sooner; property, gold and other assets long term after 24 months at 12.5% without indexation, your slab if sooner. Adds 4% cess, leaves out surcharge. Debt funds bought after April 2023 are taxed at your slab however long you hold them. Land or buildings bought before 23 July 2024 can choose 20% with indexation instead, which this does not show.",
  },

  /* ── Step 2: the safety net ─────────────────────────────────── */
  {
    slug: "emergency-fund",
    step: "emergency-fund",
    module: "planning",
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
    module: "planning",
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
    module: "loans",
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
    module: "loans",
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
    module: "loans",
    name: "Loan prepayment",
    nameEm: "calculator.",
    short: "What paying extra actually saves.",
    blurb:
      "Paying a little more each month comes off the principal, so it cuts both the tenure and the interest. This shows how much of each.",
    assumes:
      "Assumes the extra goes to principal every month, that a one-off amount is paid today, and that the rate stays fixed. Check your lender does not charge a prepayment fee on fixed-rate loans.",
  },
  {
    slug: "balance-transfer",
    step: "expensive-debt",
    module: "loans",
    name: "Loan balance",
    nameEm: "transfer.",
    short: "Whether switching lenders pays.",
    blurb:
      "Another bank offers a lower rate. Switching costs fees up front and saves interest over time. This says whether the saving clears the fees, and how soon.",
    assumes:
      "Keeps the remaining tenure the same and the new rate fixed. Fees include processing, legal, valuation and any foreclosure charge from the old lender. Ask your current bank to match the rate first; it often costs nothing.",
  },

  /* ── Step 5: big purchases ──────────────────────────────────── */
  {
    slug: "rent-vs-buy",
    step: "real-price",
    module: "loans",
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
    module: "investing",
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
    module: "investing",
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
    module: "investing",
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
    module: "investing",
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
    module: "investing",
    name: "Fixed deposit",
    nameEm: "calculator.",
    short: "What an FD matures to.",
    blurb:
      "The maturity amount on a deposit, compounded quarterly the way banks do it. Useful for comparing against what inflation does over the same years.",
    assumes:
      "Quarterly compounding and no premature withdrawal. Interest is taxed at your slab every year whether or not you withdraw it, which is taken off here.",
  },
  {
    slug: "rd-calculator",
    step: "invest",
    module: "investing",
    name: "Recurring deposit",
    nameEm: "calculator.",
    short: "What a monthly deposit matures to.",
    blurb:
      "A fixed amount into the bank every month for a set number of years. Shows what it matures to, and what is left of the interest once tax takes its share.",
    assumes:
      "Quarterly compounding, as most banks and the post office do, with every instalment paid on time. Interest is taxed at your slab every year.",
  },
  {
    slug: "ppf-calculator",
    step: "invest",
    module: "govt-schemes",
    name: "PPF",
    nameEm: "calculator.",
    short: "What fifteen years of PPF builds.",
    blurb:
      "A deposit at the start of each year for fifteen years, at the current rate. Slow, dull, government-backed and tax-free at every stage.",
    assumes:
      "The rate stays where it is, which it will not: it is reset every quarter. The yearly cap is ₹1.5 lakh.",
  },
  {
    slug: "epf-calculator",
    step: "invest",
    module: "govt-schemes",
    name: "EPF",
    nameEm: "calculator.",
    short: "What your PF grows to by retirement.",
    blurb:
      "The 12% that comes out of every payslip, and your employer's share, compounding until you retire. Most people have never seen what it adds up to.",
    assumes:
      "The rate you set holds every year (it is declared yearly; 8.25% recently). Of your employer's 12%, up to ₹1,250 a month goes to the pension scheme, EPS, and is not in this balance. Assumes you never withdraw and your basic rises once a year.",
  },
  {
    slug: "nps-calculator",
    step: "invest",
    module: "govt-schemes",
    name: "NPS",
    nameEm: "calculator.",
    short: "The corpus at 60, and the pension it buys.",
    blurb:
      "A monthly contribution until 60. Then part of the pot buys an annuity that pays a pension for life, and the rest comes to you as a lump sum.",
    assumes:
      "A steady return until you retire. Since December 2025 most private-sector subscribers can put as little as 20% into an annuity; government employees must still put in 40%. Annuity rates vary by insurer and are taxed as income.",
  },
  {
    slug: "ssy-calculator",
    step: "invest",
    module: "govt-schemes",
    name: "Sukanya Samriddhi",
    nameEm: "calculator.",
    short: "What SSY gives your daughter at 21.",
    blurb:
      "You deposit for fifteen years and the account keeps earning for six more. Tax free going in, while it grows, and at maturity.",
    assumes:
      "A deposit at the start of each year for 15 years, at today's rate held for the full 21. The rate is reset every quarter. Between ₹250 and ₹1.5 lakh a year.",
  },
  {
    slug: "post-office-schemes",
    step: "invest",
    module: "govt-schemes",
    name: "Post office",
    nameEm: "schemes.",
    short: "MIS, SCSS, NSC, KVP and time deposits.",
    blurb:
      "The government-backed options at the post office, in one place. Pick a scheme and an amount to see the monthly or quarterly income, or what it matures to.",
    assumes:
      "This quarter's rates, held to maturity. Interest on all of these is taxable at your slab, except that NSC and the 5-year deposit qualify for 80C in the old regime. SCSS is for those 60 and above.",
  },
  {
    slug: "cagr-calculator",
    step: "invest",
    module: "investing",
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
    module: "planning",
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
    module: "planning",
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
    module: "planning",
    name: "FIRE",
    nameEm: "calculator.",
    short: "The number you need to stop.",
    blurb:
      "How much you need invested before your money can cover your life, and roughly how long it takes to get there from where you are.",
    assumes:
      "Works in today's rupees: the return is adjusted for inflation, so the target does not have to be inflated separately. Assumes your spending stays the same in real terms.",
  },

  /* ── Added from the wider library ───────────────────────────── */
  {
    slug: "advance-tax",
    step: "what-you-earn",
    module: "salary-tax",
    name: "Advance tax",
    nameEm: "calculator.",
    short: "What to pay, and by which date.",
    blurb:
      "If your employer's TDS does not cover your tax, because of interest, rent, freelance work or gains, the rest is due in four instalments during the year. Miss them and interest runs from each date.",
    assumes:
      "Slabs for FY 2026-27, unchanged from the year before, for someone under 60. Due only when the tax left after TDS is ₹10,000 or more. The interest figure assumes you pay nothing until you file on 31 July, at 1% a month. Gains that arrive late in the year can be paid in the instalments that follow them without interest, which this does not split out.",
  },
  {
    slug: "freelance-tax",
    step: "what-you-earn",
    module: "salary-tax",
    name: "Freelancer",
    nameEm: "tax.",
    short: "Presumptive tax against keeping books.",
    blurb:
      "Doctors, designers, developers and consultants can declare half of what they receive as profit and pay tax only on that, with no books to keep. Whether it beats paying on actual profit depends on your expenses.",
    assumes:
      "The presumptive scheme for professionals (section 44ADA in the old Act): up to ₹75 lakh of receipts if no more than 5% arrive in cash, ₹50 lakh otherwise. Declare at least 50% as profit. Advance tax under it is paid in one go by 15 March. GST registration is a separate question, usually needed above ₹20 lakh of receipts.",
  },
  {
    slug: "nri-tax",
    step: "what-you-earn",
    module: "salary-tax",
    name: "NRI status",
    nameEm: "and tax.",
    short: "Resident, NRI or in between, and the tax that follows.",
    blurb:
      "Your residential status decides whether India taxes only what you earn here or everything you earn anywhere. It is decided by days, not by passport or by where your employer sits.",
    assumes:
      "The day-count tests, the ₹15 lakh Indian-income rules and deemed residency, as carried into the Income-tax Act, 2025. Tax is on Indian income only, in the new regime, with no rebate for non-residents. Interest on NRE deposits is tax free and is not Indian income here. Working remotely for a foreign company while living in India makes you a resident, taxed on all of it.",
  },
  {
    slug: "tax-harvesting",
    step: "invest",
    module: "salary-tax",
    name: "Tax harvesting",
    nameEm: "calculator.",
    short: "Use the ₹1.25 lakh tax-free limit every year.",
    blurb:
      "The first ₹1.25 lakh of long-term equity gains each year is tax free, and an unused year is gone. Selling enough to book that much and buying straight back resets your cost, so less is taxed later.",
    assumes:
      "Listed shares and equity funds held over a year, taxed at 12.5% plus cess above the limit. India has no rule against buying back the next day. Leaves out brokerage, any exit load on funds, and that units bought back start a fresh one-year clock.",
  },
  {
    slug: "gst-calculator",
    step: "real-price",
    module: "salary-tax",
    name: "GST",
    nameEm: "calculator.",
    short: "Add GST to a price, or take it out.",
    blurb:
      "The price before tax, the tax, and the split between the centre and the state, at the rates in force since September 2025.",
    assumes:
      "The main rates since 22 September 2025: 5%, 18% and 40%, plus 3% on gold and silver. The rate on any item depends on its HSN or SAC code. Within a state the tax splits equally into CGST and SGST; across states it is all IGST.",
  },
  {
    slug: "rent-receipts",
    step: "what-you-earn",
    module: "salary-tax",
    name: "Rent",
    nameEm: "receipts.",
    short: "Monthly receipts for your HRA claim, ready to print.",
    blurb:
      "Your employer asks for rent receipts before it will count HRA. Fill in the details once and get one receipt for every month, to print or save as a PDF and have your landlord sign.",
    assumes:
      "Nothing you type leaves your browser. Your landlord's PAN is needed once your rent goes above ₹1 lakh a year. Receipts for cash payments over ₹5,000 traditionally carry a ₹1 revenue stamp. From FY 2026-27 the declaration to your employer is Form 124, which replaced Form 12BB.",
  },
  {
    slug: "apy-calculator",
    step: "invest",
    module: "govt-schemes",
    name: "Atal Pension",
    nameEm: "Yojana.",
    short: "The monthly payment for a pension of ₹1,000 to ₹5,000.",
    blurb:
      "A guaranteed pension from 60, for life, then for your spouse, then the corpus to your nominee. What you pay each month depends only on the age you join and the pension you pick.",
    assumes:
      "The official contribution chart, monthly payments. Open to anyone aged 18 to 40 with a savings account, except those who have ever paid income tax, who cannot join from October 2022. The pension amount is fixed and does not rise with inflation.",
  },
  {
    slug: "xirr-calculator",
    step: "invest",
    module: "investing",
    name: "XIRR",
    nameEm: "calculator.",
    short: "The real return when money went in on different dates.",
    blurb:
      "CAGR only works for one amount in and one out. For SIPs, top-ups and withdrawals, XIRR is the yearly return that accounts for when each rupee went in, the number your fund statement shows.",
    assumes:
      "Dates and amounts exactly as you enter them, with today's value as the last line. Payments in are money you put in; money out is what you withdrew or what it is worth now.",
  },
  {
    slug: "home-loan",
    step: "real-price",
    module: "loans",
    name: "Home loan",
    nameEm: "calculator.",
    short: "The EMI, the interest, and what the old regime gives back.",
    blurb:
      "The EMI on the house you want, how much of the early payments is only interest, and the tax the old regime lets you claim on it.",
    assumes:
      "A floating rate that stays where you set it. In the old regime, interest on a home you live in is deductible up to ₹2 lakh a year and principal counts towards the ₹1.5 lakh 80C limit, which your PF may already fill. The new regime gives neither. Leaves out stamp duty, registration and the loan's processing fee.",
  },
  {
    slug: "car-loan",
    step: "real-price",
    module: "loans",
    name: "Car loan",
    nameEm: "calculator.",
    short: "The EMI, and what a flat rate really costs.",
    blurb:
      "Car loans are often quoted at a flat rate that sounds cheap, because it is charged on the whole loan even as you repay it. This shows the EMI and the rate it really works out to.",
    assumes:
      "Monthly EMIs over the term, no prepayment. A flat rate is converted to the reducing rate that gives the same EMI. Leaves out insurance, processing fees and any dealer add-ons financed with the car.",
  },
  {
    slug: "core-satellite",
    step: "invest",
    module: "strategies",
    name: "Core and",
    nameEm: "satellite.",
    short: "An index core, with a small part for your bets.",
    blurb:
      "Most of the money in a cheap index fund, a smaller slice in the active or thematic funds you believe in. This shows what the slice has to return to beat simply keeping it all in the core.",
    assumes:
      "A monthly SIP split by the share you set, each part at its own steady return after costs. Real returns vary year to year, and active funds rarely beat their index for long.",
  },
  {
    slug: "three-bucket",
    step: "invest",
    module: "strategies",
    name: "Three-bucket",
    nameEm: "retirement.",
    short: "Cash, debt and equity, sized for the years ahead.",
    blurb:
      "A retirement corpus split by when you will need it: cash for the next few years, steady debt for the years after, and equity for everything later, left alone long enough to ride out a crash.",
    assumes:
      "Spending rises with inflation every year. The cash bucket holds those years' spending in full; the debt bucket holds what, at its return, covers the years after. Refill the buckets from equity in good years. Returns are assumptions, not promises.",
  },
  {
    slug: "coffee-can",
    step: "invest",
    module: "strategies",
    name: "Coffee can",
    nameEm: "investing.",
    short: "What leaving it alone is worth.",
    blurb:
      "Buy something good and do not touch it for ten years. Against switching every few months, holding pays tax once instead of every time, so more of the money keeps compounding.",
    assumes:
      "The same return either way, so the only difference is tax and costs. Switching within a year is short-term at 20%, after that 12.5%, both plus cess. Leaves out the ₹1.25 lakh yearly exemption, which is shared with everything else you sell.",
  },
  {
    slug: "factor-investing",
    step: "invest",
    module: "strategies",
    name: "Factor funds",
    nameEm: "or plain index.",
    short: "What a smart-beta fund has to beat.",
    blurb:
      "Momentum, value, quality and low-volatility index funds tilt towards one trait instead of owning the market as it is. They cost more, so they have to earn that back before they help.",
    assumes:
      "A steady return for each, with the factor fund's edge over the plain index set by you, before costs. Factors go through long stretches of trailing the market, and past outperformance is no promise of more.",
  },
];

/* ── Sources ─────────────────────────────────────────────────── */

/** Where a calculator's rules and rates come from. No url: the maths itself. */
export type Source = { name: string; url?: string };

const IT: Source = { name: "Income Tax Department", url: "https://www.incometax.gov.in/iec/foportal/" };
const EPFO: Source = { name: "EPFO", url: "https://www.epfindia.gov.in/" };
const LABOUR: Source = { name: "Ministry of Labour (Payment of Gratuity Act)", url: "https://labour.gov.in/" };
const GST: Source = { name: "GST portal", url: "https://www.gst.gov.in/" };
const CBIC: Source = { name: "CBIC (GST rates)", url: "https://cbic-gst.gov.in/" };
const RBI: Source = { name: "Reserve Bank of India", url: "https://www.rbi.org.in/" };
const AMFI: Source = { name: "AMFI (mutual fund investor education)", url: "https://www.amfiindia.com/" };
const SEBI: Source = { name: "SEBI", url: "https://www.sebi.gov.in/" };
const NSI: Source = { name: "National Savings Institute", url: "https://www.nsiindia.gov.in/" };
const DEA: Source = { name: "Department of Economic Affairs (small savings rates)", url: "https://dea.gov.in/" };
const POST: Source = { name: "India Post", url: "https://www.indiapost.gov.in/" };
const PFRDA: Source = { name: "PFRDA", url: "https://www.pfrda.org.in/" };
const NPS_TRUST: Source = { name: "NPS Trust", url: "https://npstrust.org.in/" };
const MOSPI: Source = { name: "MoSPI (consumer price index)", url: "https://www.mospi.gov.in/" };

const GROWTH: Source = { name: "Standard compound-growth maths; no official rate involved" };
const EMI_MATHS: Source = { name: "The reducing-balance EMI formula banks use" };
const PLANNING: Source = { name: "A planning rule of thumb, not an official rule" };

/**
 * Typed by slug, so a new calculator without its sources does not build.
 * Links go to each body's home page, which stays put; deep links on these
 * sites move too often to trust.
 */
const SOURCES: Record<ToolSlug, Source[]> = {
  "take-home-salary": [IT, EPFO, LABOUR],
  "tax-regime": [IT],
  "hra-calculator": [IT],
  "gratuity-calculator": [LABOUR, IT],
  "capital-gains": [IT],
  "advance-tax": [IT],
  "freelance-tax": [IT, GST],
  "nri-tax": [IT],
  "tax-harvesting": [IT],
  "gst-calculator": [GST, CBIC],
  "rent-receipts": [IT],
  "emergency-fund": [PLANNING],
  "term-cover": [PLANNING],
  "emi-calculator": [EMI_MATHS],
  "credit-card-payoff": [RBI, EMI_MATHS],
  "loan-prepayment": [RBI, EMI_MATHS],
  "rent-vs-buy": [EMI_MATHS, GROWTH],
  "home-loan": [IT, RBI, EMI_MATHS],
  "car-loan": [EMI_MATHS],
  "balance-transfer": [RBI, EMI_MATHS],
  "sip-calculator": [AMFI, GROWTH],
  "step-up-sip": [AMFI, GROWTH],
  "goal-planner": [AMFI, GROWTH],
  "lumpsum-calculator": [AMFI, GROWTH],
  "fd-calculator": [RBI, IT],
  "ppf-calculator": [NSI, DEA],
  "cagr-calculator": [GROWTH],
  "xirr-calculator": [GROWTH],
  "inflation-calculator": [MOSPI],
  "swp-calculator": [AMFI, GROWTH],
  "fire-calculator": [GROWTH, PLANNING],
  "epf-calculator": [EPFO],
  "nps-calculator": [PFRDA, NPS_TRUST],
  "ssy-calculator": [NSI, DEA],
  "post-office-schemes": [POST, DEA],
  "rd-calculator": [POST, GROWTH],
  "apy-calculator": [PFRDA],
  "core-satellite": [AMFI, SEBI],
  "three-bucket": [PLANNING],
  "coffee-can": [IT, AMFI],
  "factor-investing": [AMFI, SEBI],
};

export const sourcesFor = (slug: ToolSlug) => SOURCES[slug];

export const toolHref = (slug: string) => `/tools/${slug}/`;
/** The tool's 1200x630 social card, drawn by scripts/tool-og.mjs. */
export const toolOgHref = (slug: string) => `/tools/og/${slug}.jpg`;
export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const toolsForStep = (step: StepId) => tools.filter((t) => t.step === step);
export const toolsForModule = (id: ModuleId) => tools.filter((t) => t.module === id);
export const getModule = (id: ModuleId) => modules.find((m) => m.id === id)!;

/** Where a home page step's "calculators" link lands on /tools/. */
export const moduleForStep: Record<StepId, ModuleId> = {
  "what-you-earn": "salary-tax",
  "emergency-fund": "planning",
  insure: "planning",
  "expensive-debt": "loans",
  "real-price": "loans",
  invest: "investing",
  "spot-a-scam": "planning",
};

/**
 * The four on the home page. They trace the whole path in miniature — what you
 * earn, what the taxman leaves, the safety net, then investing — rather than
 * four from one group. Everything else lives on /tools/.
 */
const FEATURED: ToolSlug[] = ["take-home-salary", "tax-regime", "emergency-fund", "sip-calculator"];
export const featuredTools = FEATURED.map((slug) => tools.find((t) => t.slug === slug)).filter(
  (t): t is Tool => Boolean(t),
);
