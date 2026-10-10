import type { Metadata, Viewport } from "next";
import "@fontsource-variable/lora";
import "@fontsource-variable/lora/wght-italic.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { graph, personSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Personal finance, made simple`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: "Abinash", url: site.url }],
  creator: "Abinash",
  publisher: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} · Personal finance, made simple`,
    description: site.description,
    url: site.url,
    locale: "en_IN",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${site.name} · ${site.tagline}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} · Personal finance, made simple`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export const viewport: Viewport = {
  themeColor: "#0c1712",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      {/* Extensions like Grammarly add attributes to <body> before React
          hydrates, which React then reports as a mismatch. This silences that
          for this element only; mismatches inside the tree still surface. */}
      <body className="min-h-dvh" suppressHydrationWarning>
        <JsonLd data={graph(personSchema, websiteSchema)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="pt-[74px] md:pt-[88px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
