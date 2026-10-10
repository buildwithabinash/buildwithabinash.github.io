import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Search } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, graph, guideSchema } from "@/lib/schema";
import { type Guide, coverHref, getGuide, guideHref, guideOgHref, guides, relatedGuides } from "@/lib/guides";
import { instagram, site } from "@/lib/site";
import { StickyBar } from "./StickyBar";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  // " · Build with Abinash" costs 21 characters and results get cut
  // around 60, so drop the italic half when the pair would overflow.
  const full = `${g.title} ${g.titleEm}`.replace(/\s+/g, " ");
  const title = full.length > 38 ? g.title.replace(/[.,]$/, "") : full;
  return {
    title,
    description: g.subtitle,
    alternates: { canonical: guideHref(g.slug) },
    openGraph: {
      type: "article",
      title,
      description: g.subtitle,
      url: `${site.url}${guideHref(g.slug)}`,
      images: [{ url: guideOgHref(g.slug), width: 1200, height: 630, alt: full }],
    },
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const related = relatedGuides(g, 3);
  const meta = [g.pages ? `${g.pages} pages` : null, g.verified ? `Verified ${g.verified}` : null, "Free to share"]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <JsonLd
        data={graph(
          guideSchema(g),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides/" },
            { name: `${g.title} ${g.titleEm}`.replace(/\s+/g, " "), path: guideHref(g.slug) },
          ]),
        )}
      />
      {/* Guide hero */}
      <section className="border-b border-line bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-8 pt-4 md:px-6 md:pb-[72px] md:pt-8">
          <nav aria-label="Breadcrumb" className="text-[13px] text-muted md:text-sm">
            <Link href="/guides/" className="inline-block py-2 text-green">← All guides</Link>
            <span className="hidden md:inline"> / {g.topic}</span>
          </nav>
          <div className="mt-3.5 flex flex-col gap-7 md:mt-9 md:flex-row md:items-start md:gap-14">
            <div className="min-w-0 md:flex-[1.6]">
              <p className="kicker text-green">Free guide · {g.topic}</p>
              <h1 className="mt-2.5 font-serif text-[36px] font-bold leading-[1.1] text-ink md:mt-3.5 md:text-[56px] md:leading-[1.08]">
                {g.title} <em className="block font-normal text-green">{g.titleEm}</em>
              </h1>
              <p className="mt-3.5 font-serif text-lg italic leading-snug text-muted md:mt-5 md:text-[21px]">{g.subtitle}</p>
              <p className="mt-3.5 text-[13px] text-muted md:order-last md:text-sm">{meta}</p>
              <div className="mt-8 hidden flex-wrap gap-3.5 md:flex">
                <DownloadButton pdf={g.pdf} slug={g.slug} />
                <PreviewButton pdf={g.pdf} />
              </div>
            </div>

            <div className="flex justify-center md:flex-1">
              <PdfCover g={g} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-7 px-5 pt-8 md:flex-row md:items-start md:gap-14 md:px-6 md:pb-10 md:pt-16">
          <div className="min-w-0 md:flex-[1.8]">
            {g.stats && (
              <>
                <h2 className="font-serif text-2xl font-bold text-ink md:text-[30px]">
                  The numbers <em className="font-normal text-green">at a glance</em>
                </h2>
                <dl className="mt-4 grid grid-cols-2 border-y border-rule md:mt-6 md:grid-cols-4">
                  {g.stats.map((s, i) => (
                    <div key={s.label} className={`py-4 md:py-6 ${i < 2 ? "border-b border-line md:border-b-0" : ""}`}>
                      <dt className="text-[10px] uppercase tracking-[0.22em] text-muted md:text-[11px]">{s.label}</dt>
                      <dd className={`mt-1.5 font-serif text-[30px] md:mt-2 md:text-[34px] ${s.accent ? "text-green" : "text-ink"}`}>
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {g.statsNote && <p className="mt-2 text-xs italic leading-relaxed text-muted md:text-[13px]">{g.statsNote}</p>}
              </>
            )}

            {g.notice && (
              <div className="mt-6 rounded-2xl bg-mint px-5 py-[18px] md:mt-9 md:px-7 md:py-6">
                <p className="kicker text-[10px] text-green md:text-[11px]">The one thing to notice</p>
                <p className="mt-1.5 font-serif text-lg leading-snug text-ink md:mt-2 md:text-[21px]">{g.notice}</p>
              </div>
            )}

            {g.inside && (
              <>
                <h2 className="mt-9 font-serif text-2xl font-bold text-ink md:mt-14 md:text-[30px]">
                  What&apos;s inside <em className="font-normal text-green">the PDF</em>
                </h2>
                <ol className="mt-3 md:mt-5">
                  {g.inside.map((it, i) => (
                    <li key={it.title} className="flex gap-3.5 border-b border-line py-3.5 last:border-b-0 md:gap-5 md:py-4">
                      <span className="w-5 flex-none font-serif text-[19px] text-green md:w-6 md:text-[22px]">{i + 1}</span>
                      <span className="text-[15px] leading-relaxed md:text-base">
                        <b className="text-ink">{it.title}</b> {it.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {!g.stats && !g.inside && (
              <div className="rounded-2xl border border-line bg-cream px-5 py-6 md:px-7">
                <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">What this guide covers</h2>
                <p className="mt-2 text-[15px] leading-relaxed md:text-base">{g.blurb}</p>
                <p className="mt-2 text-sm text-muted">The full breakdown, sources and glossary are in the PDF.</p>
              </div>
            )}

            {/* Where the next one comes from */}
            <div className="on-dark mt-8 rounded-2xl bg-midnight p-6 text-paper md:mt-14 md:rounded-3xl md:p-8">
              <p className="kicker text-signal">More like this</p>
              <p className="mt-2.5 font-serif text-xl font-bold leading-snug md:text-[26px]">
                New guides land on Instagram first.
              </p>
              <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-sage md:text-base">
                A short video most days, and the PDF in the comments when enough people ask for it.
              </p>
              <a
                href={instagram.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-5 px-6 py-3 md:mt-6"
              >
                <span>Follow {site.handle}</span>
              </a>
            </div>
          </div>

          {/* Side column (stacks under on mobile) */}
          <aside className="flex min-w-0 flex-col gap-3.5 md:flex-1 md:gap-5">
            <div id="download" className="hidden scroll-mt-20 rounded-2xl border border-line bg-cream p-6 md:block">
              <p className="font-serif text-[22px] font-bold text-ink">Get the PDF</p>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">
                Free, no signup. Save it, print it, or send it to a friend who keeps saying they will start &quot;next month&quot;.
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                <DownloadButton pdf={g.pdf} slug={g.slug} block />
                <PreviewButton pdf={g.pdf} block />
              </div>
            </div>
            <div className="rounded-2xl border border-line p-5 md:p-6">
              <p className="kicker text-[10px] text-green md:text-[11px]">How I checked this</p>
              <ul className="mt-2.5 list-disc pl-[18px] text-sm leading-relaxed text-soft">
                <li>Every total computed in code, not by hand</li>
                <li>Sources listed on the last page of the PDF</li>
                <li>{g.verified ? `Re-checked on ${g.verified}` : "Check date shown on the PDF"}</li>
              </ul>
              <Link href="/about/#research" className="mt-1.5 inline-block py-2 text-sm font-semibold text-green">
                How I research →
              </Link>
            </div>
            <div className="rounded-2xl bg-rose px-5 py-[18px] md:px-6">
              <p className="kicker text-[10px] text-alert md:text-[11px]">Disclaimer</p>
              <p className="mt-1.5 text-[13px] leading-relaxed">
                Education only, not investment advice, and not a recommendation of any product. I am not a
                SEBI-registered investment adviser. {g.disclaimerNote ?? "Figures can change; check the official source before acting."}
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Read next */}
      <section className="mt-9 border-t border-line bg-cream md:mt-10">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-9 md:px-6 md:pb-[88px] md:pt-16">
          <h2 className="font-serif text-2xl font-bold text-ink md:text-[30px]">Read next</h2>
          <div className="mt-3.5 grid gap-2.5 md:mt-7 md:grid-cols-3 md:gap-5">
            {related.map((r) => (
              <Link key={r.slug} href={guideHref(r.slug)} className="rounded-2xl border border-line bg-white px-[18px] py-4 hover:shadow-lg md:p-6">
                <span className="kicker block text-[10px] text-green md:text-[11px]">{r.topic}</span>
                <span className="mt-1.5 block font-serif text-lg font-bold text-ink md:mt-2.5 md:text-[21px]">
                  {r.title} {r.titleEm}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StickyBar pdf={g.pdf} slug={g.slug} title={`${g.title} ${g.titleEm}`} />
    </>
  );
}

function DownloadButton({ pdf, slug, block = false }: { pdf: string | null; slug: string; block?: boolean }) {
  const cls = `btn px-6 py-[15px] ${block ? "w-full" : ""}`;
  if (!pdf) {
    return (
      <span className={`${cls} cursor-not-allowed bg-line text-muted`} aria-disabled="true">
        <Download size={20} /> PDF coming soon
      </span>
    );
  }
  return (
    <a href={pdf} download={`${slug}-guide-buildwithabinash.pdf`} className={`${cls} btn-primary`}>
      <Download size={20} /> Download the PDF
    </a>
  );
}

/** Opens the PDF in the browser's own viewer, rather than saving it. */
function PreviewButton({ pdf, block = false }: { pdf: string | null; block?: boolean }) {
  if (!pdf) return null;
  return (
    <a
      href={pdf}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn btn-ghost px-6 py-[15px] ${block ? "w-full" : ""}`}
    >
      <Search size={19} /> Preview
    </a>
  );
}

/**
 * The real first page, rendered from the PDF at build time rather than
 * mocked up in markup. Clicking it opens the document.
 */
function PdfCover({ g }: { g: Guide }) {
  const sheet = (
    <Image
      src={coverHref(g.slug)}
      alt={`First page of the ${g.title} ${g.titleEm} guide`}
      width={760}
      height={1076}
      // The cover sits above the fold on phones and is the page's LCP element.
      // Left lazy it was discovered late, costing ~1.5s of load delay.
      priority
      className="block h-auto w-full"
    />
  );
  const frame =
    "w-[210px] overflow-hidden rounded-lg border border-rule bg-cream shadow-[0_18px_40px_rgba(18,74,58,0.13)] md:w-[300px]";

  if (!g.pdf) return <div className={frame}>{sheet}</div>;

  return (
    <a
      href={g.pdf}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open the ${g.title} ${g.titleEm} PDF`}
      className={`${frame} block transition-shadow hover:shadow-[0_24px_52px_rgba(18,74,58,0.22)]`}
    >
      {sheet}
    </a>
  );
}
