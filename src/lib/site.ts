// One place for the brand's details and social links.
// A link set to null shows as "Link coming soon" until it is filled in.

export type Social = {
  id: "instagram" | "broadcast" | "youtube" | "facebook";
  name: string;
  handle: string;
  note: string;
  url: string | null;
  cta: string;
};

export const site = {
  name: "Build with Abinash",
  handle: "@buildwithabinash",
  url: "https://buildwithabinash.github.io",
  email: "buildwithabinash@gmail.com",
  tagline: "Personal finance, made simple",
  oneLiner:
    "Nobody taught us money. I want everyone to understand it well enough to manage their own, see a scam coming, and grow and protect what they have.",
  description:
    "Free personal finance guides and calculators for Indian salaried professionals. Manage your own money, avoid scams, and grow and protect what you have.",
  signOff: "Let's learn the smart way.",
};

/**
 * Where the survey posts. The site is a static export with no server of its
 * own, so answers go to Formspree.
 *
 * To switch it on: make a free form at formspree.io, then paste the endpoint it
 * gives you here, e.g. "https://formspree.io/f/abcdwxyz". Nothing else needs to
 * change; the form already matches Formspree's conventions, including the
 * _gotcha spam trap. Read the answers at formspree.io under that form.
 *
 * While this is null the survey page says it is not collecting yet and the form
 * is disabled, rather than silently losing answers. The endpoint is public by
 * design for this kind of service; it is not a secret.
 */
export const surveyEndpoint: string | null = "https://formspree.io/f/xdeazddb";

/**
 * A mailto link for reporting a mistake on a page. Only the page's address
 * goes in, never the part after "?", which on a calculator holds the
 * visitor's numbers; they can add those themselves if they want to.
 */
export function reportErrorHref(path: string, title: string) {
  const subject = `Mistake on: ${title}`;
  const body = `Page: ${site.url}${path}\n\nWhat looks wrong, and what you expected:\n\n`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Visitor counts, through GoatCounter: open source, no cookies, no personal
 * data, free for a site like this one.
 *
 * To switch it on: sign up at goatcounter.com and pick a code (the part
 * before .goatcounter.com), then paste it here, e.g. "buildwithabinash".
 * While this is null no script loads at all. Only the page path is sent,
 * never the address after "?", which on a calculator holds someone's numbers.
 */
export const goatcounterCode: string | null = null;

/**
 * The default social card. Next replaces the whole openGraph object when a page
 * defines its own, rather than merging, so any page that sets openGraph has to
 * pass images through or it ships a summary_large_image card with nothing in it.
 */
export const ogImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: `${site.name} · ${site.tagline}`,
};

export const socials: Social[] = [
  {
    id: "instagram",
    name: "Instagram",
    handle: "@buildwithabinash",
    note: "Daily videos",
    url: "https://www.instagram.com/buildwithabinash/",
    cta: "Follow",
  },
  {
    id: "broadcast",
    name: "Broadcast channel",
    handle: "Abinash Updates",
    note: "New guides first",
    url: "https://www.instagram.com/channel/U0jh-KFxn8LWC_dJ/",
    cta: "Join",
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@buildwithabinash",
    note: "Longer explainers",
    url: "https://www.youtube.com/@buildwithabinash",
    cta: "Subscribe",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Build with Abinash",
    note: "Videos and updates",
    url: "https://www.facebook.com/buildwithabinash",
    cta: "Follow",
  },
];

export const instagram = socials[0];

export const disclaimer =
  "Everything on this site is for education only. It is not investment, tax or legal advice, and it does not recommend any specific product. I am not a SEBI-registered investment adviser. Figures are examples and can change. Check the official source or speak to a SEBI-registered adviser before acting.";

export const shortDisclaimer =
  "Education only, not investment, tax or legal advice. I am not a SEBI-registered investment adviser.";
