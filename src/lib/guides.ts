// Every guide on the site comes from this list.
// To add a guide: add an entry here and put its PDF in public/guides/<slug>.pdf,
// then set `pdf` to "/guides/<slug>.pdf".

export const topics = [
  "Investing basics",
  "Tax, made simple",
  "EPF and retirement",
  "Government schemes",
  "Buying smart",
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
  reelUrl: string | null;
  reelTitle: string | null;
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
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
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
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
  },
  {
    slug: "bike-on-road-price",
    topic: "Buying smart",
    title: "The bike price",
    titleEm: "the showroom doesn't show.",
    subtitle: "Every dealer charge on the on-road price, and which ones you can question.",
    blurb: "Every dealer charge on the on-road price, which ones are fixed and which you can question.",
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
  },
  {
    slug: "bank-auction-car",
    topic: "Buying smart",
    title: "Buying a bank-seized car",
    titleEm: "through an e-auction.",
    subtitle: "How repossessed cars get auctioned, how to register and bid, and what to check before you pay.",
    blurb: "How repossessed cars get auctioned, how to register and bid, and what to check before you pay.",
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
  },
  {
    slug: "govt-monthly-income",
    topic: "Government schemes",
    title: "A monthly income",
    titleEm: "from government schemes.",
    subtitle: "The post office and government options that pay every month, side by side.",
    blurb: "The post office and government options that pay every month, side by side.",
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
  },
  {
    slug: "ssy",
    topic: "Government schemes",
    title: "Sukanya Samriddhi Yojana,",
    titleEm: "explained.",
    subtitle: "How SSY works for a daughter's future: deposits, lock-in, interest and tax.",
    blurb: "How SSY works for a daughter's future: deposits, lock-in, interest and tax.",
    pdf: null,
    pages: null,
    verified: null,
    reelUrl: null,
    reelTitle: null,
  },
];

export type LearningPath = {
  id: string;
  title: string;
  text: string;
  short: string;
  guides: string[];
};

export const paths: LearningPath[] = [
  {
    id: "first-salary",
    title: "You just got your first salary",
    text: "Read your salary slip, see where TDS and PF go, and set up your first SIP without panic.",
    short: "Salary slip, TDS, PF and your first SIP.",
    guides: ["epf-balance", "sip"],
  },
  {
    id: "tax-epf",
    title: "Tax and EPF, without the fear",
    text: "How income tax actually hits your pay, what your PF is worth at retirement, and why you should not withdraw it early.",
    short: "How tax hits your pay and what your PF is worth.",
    guides: ["epf-balance"],
  },
  {
    id: "investing",
    title: "Investing basics, from zero",
    text: "Compounding, SIPs, how a stock price is decided, and primary vs secondary market. Explained like you are 15.",
    short: "Compounding, SIPs and how a stock price is decided.",
    guides: ["sip"],
  },
];

export const series = {
  title: "Stock market basics",
  titleEm: "one question at a time.",
  count: 7,
  url: null as string | null, // TODO: playlist link
  episodes: [
    "How a stock actually grows",
    "Who decides the price? The apple shop story",
    "Dividends vs growth",
    "Stock vs mutual fund",
  ],
  more: "More episodes, including trading vs investing",
};

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

export function guideHref(slug: string) {
  return `/guides/${slug}/`;
}
