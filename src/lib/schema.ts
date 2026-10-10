// Schema.org objects for search engines and for agents reading the site.
//
// Everything here has to stay true to what the site actually claims. Abinash is
// not a SEBI-registered investment adviser, so nothing in here describes him as
// an adviser or the guides as advice.

import { type Guide, guideHref } from "@/lib/guides";
import { site, socials } from "@/lib/site";
import { type Tool, toolHref } from "@/lib/tools";

const abs = (path: string) => `${site.url}${path}`;

/** The person behind the brand, referenced by @id from the other objects. */
export const personId = `${site.url}/#abinash`;
export const siteId = `${site.url}/#website`;

export const personSchema = {
  "@type": "Person",
  "@id": personId,
  name: "Abinash",
  alternateName: site.handle,
  url: site.url,
  image: abs("/abinash-portrait.webp"),
  email: site.email,
  description:
    "Creates free personal finance education for Indian salaried professionals. Not a SEBI-registered investment adviser; the material is education, not advice.",
  sameAs: socials.filter((s) => s.url).map((s) => s.url as string),
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": siteId,
  url: site.url,
  name: site.name,
  description: site.description,
  inLanguage: "en-IN",
  publisher: { "@id": personId },
};

/** Wraps a list of objects in the graph envelope. */
export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function guideSchema(g: Guide) {
  const url = abs(guideHref(g.slug));
  return {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: `${g.title} ${g.titleEm}`.replace(/\s+/g, " "),
    description: g.subtitle,
    about: g.topic,
    url,
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    author: { "@id": personId },
    publisher: { "@id": personId },
    isPartOf: { "@id": siteId },
    image: abs(`/guides/covers/${g.slug}.webp`),
    // "verified" is the day the numbers were last checked against the source,
    // which is a real modification date. Guides without one say nothing.
    ...(g.verified ? { dateModified: isoDate(g.verified) } : {}),
    ...(g.pdf
      ? {
          associatedMedia: {
            "@type": "DigitalDocument",
            name: `${g.title} ${g.titleEm}`.replace(/\s+/g, " "),
            encodingFormat: "application/pdf",
            contentUrl: abs(g.pdf),
          },
        }
      : {}),
  };
}

export function toolSchema(t: Tool) {
  const url = abs(toolHref(t.slug));
  return {
    "@type": "WebApplication",
    "@id": `${url}#app`,
    name: `${t.name} ${t.nameEm}`.replace(/\s+/g, " ").replace(/\.$/, ""),
    description: t.blurb,
    url,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-IN",
    isAccessibleForFree: true,
    author: { "@id": personId },
    publisher: { "@id": personId },
    isPartOf: { "@id": siteId },
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };
}

export function collectionSchema(name: string, description: string, path: string, items: { name: string; path: string }[]) {
  return {
    "@type": "CollectionPage",
    "@id": `${abs(path)}#collection`,
    name,
    description,
    url: abs(path),
    inLanguage: "en-IN",
    isPartOf: { "@id": siteId },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: abs(it.path),
      })),
    },
  };
}

/** "9 Oct 2026" -> "2026-10-09". Returns undefined if it cannot be parsed. */
function isoDate(human: string): string | undefined {
  const d = new Date(human);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
