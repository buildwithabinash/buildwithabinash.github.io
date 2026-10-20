import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/** What a phone needs to offer "Add to home screen" and open it like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Build w/ Abinash",
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0c1712",
    theme_color: "#0c1712",
    lang: "en-IN",
    categories: ["finance", "education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Calculators", url: "/tools/" },
      { name: "Guides", url: "/guides/" },
    ],
  };
}
