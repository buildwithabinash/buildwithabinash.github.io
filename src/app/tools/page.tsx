import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, collectionSchema, graph } from "@/lib/schema";
import { ogImage, site } from "@/lib/site";
import { modules, toolHref, tools } from "@/lib/tools";
import { ToolsBrowser } from "./ToolsBrowser";

const description =
  "Free salary, tax, HRA, GST, EPF, NPS, SIP, XIRR, EMI and FIRE calculators for Indian salaried professionals, grouped by module. No signup, no ads, and every assumption spelled out.";

export const metadata: Metadata = {
  title: "Free calculators",
  description,
  alternates: { canonical: "/tools/" },
  openGraph: { title: "Free calculators", description, url: `${site.url}/tools/`, images: [ogImage] },
};

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={graph(
          collectionSchema(
            "Free calculators",
            description,
            "/tools/",
            tools.map((t) => ({
              name: `${t.name} ${t.nameEm}`.replace(/\s+/g, " ").replace(/\.$/, ""),
              path: toolHref(t.slug),
            })),
          ),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/tools/" },
          ]),
        )}
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-8 md:px-6 md:pb-14 md:pt-[72px]">
          <p className="kicker text-green">{tools.length} free calculators · {modules.length} modules · No signup</p>
          <h1 className="mt-2.5 font-serif text-[34px] font-bold leading-[1.12] text-ink md:mt-3 md:text-[54px] md:leading-[1.1]">
            Run your own numbers, <em className="font-normal text-green">not mine.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">
            The same maths I use in the videos, grouped into modules: salary and tax, government schemes, investing,
            loans, safety and retirement, and strategies. Pick one, or search for the one you need. Every assumption each one makes
            is written on its page.
          </p>
        </div>
      </section>

      <section>
        <ToolsBrowser />
      </section>
    </>
  );
}
