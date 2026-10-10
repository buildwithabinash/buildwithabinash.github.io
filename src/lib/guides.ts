import type { StepId } from "@/lib/tools";

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
};

export const guides: Guide[] = [
  {
    slug: "sip",
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
    guides: ["sip", "step-up-sip", "ppf-nps-nsc", "nps-complete", "investing-for-your-child", "ssy", "kvp", "govt-monthly-income", "business-schemes"],
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
