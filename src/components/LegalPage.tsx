import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, graph, siteId } from "@/lib/schema";
import { site } from "@/lib/site";

/** The shared frame for the privacy policy and the terms: a header, then plain sections. */
export function LegalPage({
  path,
  kicker,
  title,
  titleEm,
  intro,
  updated,
  sections,
}: {
  path: string;
  kicker: string;
  title: string;
  titleEm: string;
  intro: string;
  /** Shown as "Last updated". */
  updated: string;
  sections: { heading: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <JsonLd
        data={graph(
          {
            "@type": "WebPage",
            "@id": `${site.url}${path}#page`,
            url: `${site.url}${path}`,
            name: `${title} ${titleEm}`,
            inLanguage: "en-IN",
            isPartOf: { "@id": siteId },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: `${title} ${titleEm}`, path },
          ]),
        )}
      />
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-8 md:px-6 md:pb-12 md:pt-[72px]">
          <p className="kicker text-green">{kicker}</p>
          <h1 className="mt-2.5 font-serif text-[34px] font-bold leading-[1.12] text-ink md:mt-3 md:text-[54px] md:leading-[1.1]">
            {title} <em className="font-normal text-green">{titleEm}</em>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">{intro}</p>
          <p className="mt-4 text-[13px] text-muted">Last updated {updated}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-8 md:px-6 md:py-12">
          {sections.map((s) => (
            <div key={s.heading} className="border-b border-line py-6 first:pt-0 last:border-b-0">
              <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">{s.heading}</h2>
              <div className="mt-2.5 space-y-3 text-[15px] leading-relaxed text-body md:text-base [&_a]:font-medium [&_a]:text-green [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:list-disc">
                {s.body}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
