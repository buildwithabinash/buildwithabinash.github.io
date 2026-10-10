import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator } from "@/components/tools";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, graph, toolSchema } from "@/lib/schema";
import { getTool, toolHref, tools, toolsForStep } from "@/lib/tools";
import { ogImage, shortDisclaimer, site } from "@/lib/site";

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getTool(slug);
  if (!t) return {};
  const title = `${t.name} ${t.nameEm.replace(".", "")}`;
  return {
    title,
    description: t.blurb,
    alternates: { canonical: toolHref(t.slug) },
    openGraph: { title, description: t.blurb, url: `${site.url}${toolHref(t.slug)}`, images: [ogImage] },
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const others = toolsForStep(tool.step).filter((t) => t.slug !== tool.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={graph(
          toolSchema(tool),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Calculators", path: "/tools/" },
            { name: `${tool.name} ${tool.nameEm}`.replace(/\s+/g, " ").replace(/\.$/, ""), path: toolHref(tool.slug) },
          ]),
        )}
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-7 md:px-6 md:pb-12 md:pt-[60px]">
          <p className="text-[13px] text-muted">
            <Link href="/tools/" className="hover:text-green">
              ← All calculators
            </Link>
          </p>
          <h1 className="mt-4 font-serif text-[32px] font-bold leading-[1.12] text-ink md:mt-5 md:text-[48px] md:leading-[1.1]">
            {tool.name} <em className="font-normal text-green">{tool.nameEm}</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">{tool.blurb}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-8 md:px-6 md:py-14">
          <Calculator slug={tool.slug} />

          <div className="mt-8 rounded-2xl border border-line bg-card p-5 md:mt-12 md:p-7">
            <p className="kicker text-green">What this assumes</p>
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-soft md:text-[15px]">{tool.assumes}</p>
            <p className="mt-4 max-w-3xl text-[13px] leading-relaxed text-muted">{shortDisclaimer}</p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-16">
          <h2 className="font-serif text-2xl font-bold text-ink md:text-[30px]">Next to this one</h2>
          <div className="mt-5 grid gap-3 md:mt-8 md:grid-cols-3 md:gap-6">
            {others.map((t) => (
              <Link
                key={t.slug}
                href={toolHref(t.slug)}
                className="group rounded-2xl border border-line bg-cream p-5 transition-shadow hover:shadow-lg"
              >
                <span className="block font-serif text-lg font-bold text-ink md:text-xl">
                  {t.name} <em className="font-normal text-green">{t.nameEm}</em>
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-soft">{t.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
