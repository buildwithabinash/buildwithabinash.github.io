import type { MetadataRoute } from "next";
import { guideHref, guides } from "@/lib/guides";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    { url: `${site.url}/guides/` },
    { url: `${site.url}/about/` },
    ...guides.map((g) => ({ url: `${site.url}${guideHref(g.slug)}` })),
  ];
}
