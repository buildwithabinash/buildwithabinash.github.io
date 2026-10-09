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
  oneLiner: "Money is 20% math and 80% behaviour. I make both simple, so you can decide for yourself.",
  description:
    "Free personal finance guides and short videos for Indian salaried professionals. One money question at a time, real numbers, no tips or shortcuts.",
  signOff: "Let's learn the smart way.",
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
    url: null, // TODO: Instagram broadcast channel invite link
    cta: "Join",
  },
  {
    id: "youtube",
    name: "YouTube",
    handle: "@Buildwithabinash",
    note: "Longer explainers",
    url: "https://www.youtube.com/@Buildwithabinash",
    cta: "Subscribe",
  },
  {
    id: "facebook",
    name: "Facebook",
    handle: "Build with Abinash",
    note: "Videos and updates",
    url: null, // TODO: Facebook page link
    cta: "Follow",
  },
];

export const instagram = socials[0];

export const disclaimer =
  "Everything on this site is for education only. It is not investment, tax or legal advice, and it does not recommend any specific product. I am not a SEBI-registered investment adviser. Figures are examples and can change. Check the official source or speak to a SEBI-registered adviser before acting.";

export const shortDisclaimer =
  "Education only, not investment, tax or legal advice. I am not a SEBI-registered investment adviser.";
