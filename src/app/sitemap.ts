import type { MetadataRoute } from "next";
import { guideHref, guides } from "@/lib/guides";
import { site } from "@/lib/site";
import { toolHref, tools } from "@/lib/tools";

export const dynamic = "force-static";

/** "9 Oct 2026" -> Date, or undefined when a guide carries no check date. */
function checked(human: string | null): Date | undefined {
  if (!human) return undefined;
  const d = new Date(human);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/guides/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/tools/`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/about/`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/survey/`, changeFrequency: "yearly", priority: 0.4 },
    ...tools.map((t) => ({
      url: `${site.url}${toolHref(t.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // lastModified is only set where there is a real date behind it; a guide
    // with no recorded check date is left without one rather than given today's.
    ...guides.map((g) => ({
      url: `${site.url}${guideHref(g.slug)}`,
      lastModified: checked(g.verified),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
