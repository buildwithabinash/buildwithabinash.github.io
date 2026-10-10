import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, collectionSchema, graph } from "@/lib/schema";
import { ogImage, site } from "@/lib/site";
import { toolGroups, toolHref, tools, toolsForStep } from "@/lib/tools";

const description =
  "Free SIP, tax, EMI, term cover, rent vs buy and FIRE calculators for Indian salaried professionals. No signup, no ads, and every assumption spelled out.";

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
          <p className="kicker text-green">{tools.length} free calculators · No signup</p>
          <h1 className="mt-2.5 font-serif text-[34px] font-bold leading-[1.12] text-ink md:mt-3 md:text-[54px] md:leading-[1.1]">
            Run your own numbers, <em className="font-normal text-green">not mine.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">
            The same maths I use in the videos. They are grouped in the order you should work through them, not
            alphabetically, because the order is most of the advice. Every assumption each one makes is written on its
            page.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
          {toolGroups.map((group, gi) => {
            const inGroup = toolsForStep(group.step);
            if (inGroup.length === 0) return null;
            // id lets the home page's step links land on the right group
            return (
              <div key={group.step} id={group.step} className={`scroll-mt-24 ${gi > 0 ? "mt-12 md:mt-16" : ""}`}>
                <div className="flex items-baseline gap-3.5 border-b border-rule pb-3">
                  <span className="font-serif text-[22px] font-bold leading-none text-green md:text-[26px]">
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">{group.title}</h2>
                  <span className="ml-auto text-[13px] text-muted">
                    {inGroup.length} {inGroup.length === 1 ? "tool" : "tools"}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-5">
                  {inGroup.map((t) => (
                    <Link
                      key={t.slug}
                      href={toolHref(t.slug)}
                      className="group flex flex-col rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-lg md:p-6"
                    >
                      <span className="font-serif text-lg font-bold text-ink md:text-[22px]">
                        {t.name} <em className="font-normal text-green">{t.nameEm}</em>
                      </span>
                      <span className="mt-2 text-sm leading-relaxed text-soft md:text-[15px]">{t.blurb}</span>
                      <span className="mt-4 text-[13px] font-semibold text-green group-hover:underline md:text-sm">
                        Open the calculator →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
