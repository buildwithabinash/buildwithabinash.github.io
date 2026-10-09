import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Play } from "@/components/Icons";
import { type Guide, getGuide, guideHref, guides, relatedGuides } from "@/lib/guides";
import { instagram, site } from "@/lib/site";
import { StickyBar } from "./StickyBar";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  const title = `${g.title} ${g.titleEm}`.replace(/\s+/g, " ");
  return {
    title,
    description: g.subtitle,
    alternates: { canonical: guideHref(g.slug) },
    openGraph: { title, description: g.subtitle, url: `${site.url}${guideHref(g.slug)}` },
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
  const reelUrl = g.reelUrl ?? instagram.url ?? "#";

  return (
    <>
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
                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-deep px-6 py-3.5 font-semibold text-deep hover:bg-white"
                >
                  <Play size={20} /> Watch the video
                </a>
              </div>
            </div>

            <div className="flex justify-center md:flex-1">
              <PdfCover g={g} />
            </div>

            <a
              href={reelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-deep px-5 py-[13px] text-[15px] font-semibold text-deep md:hidden"
            >
              <Play size={18} /> Watch the video first
            </a>
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

            {/* The reel */}
            <div className="on-dark mt-8 flex items-center gap-4 rounded-2xl bg-midnight p-[18px] text-paper md:mt-14 md:gap-7 md:rounded-3xl md:p-7">
              <div className="flex aspect-[9/16] w-[84px] flex-none items-center justify-center rounded-xl border border-signal/30 bg-midnight-2 text-[10px] text-dim md:w-[150px] md:text-xs">
                Reel
              </div>
              <div className="min-w-0">
                <p className="kicker text-[10px] text-signal md:text-[11px]">The video this guide expands</p>
                <p className="mt-1.5 font-serif text-lg font-bold leading-snug md:mt-2.5 md:text-2xl">
                  {g.reelTitle ?? "Watch it on Instagram"}
                </p>
                <a
                  href={reelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-full bg-signal px-4 py-2.5 text-sm font-semibold text-midnight md:mt-[18px] md:px-5 md:py-3 md:text-base"
                >
                  Watch on Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Side column (stacks under on mobile) */}
          <aside className="flex min-w-0 flex-col gap-3.5 md:flex-1 md:gap-5">
            <div id="download" className="hidden scroll-mt-20 rounded-2xl border border-line bg-cream p-6 md:block">
              <p className="font-serif text-[22px] font-bold text-ink">Get the PDF</p>
              <p className="mt-2 text-[15px] leading-relaxed text-soft">
                Free, no signup. Save it, print it, or send it to a friend who keeps saying they will start &quot;next month&quot;.
              </p>
              <div className="mt-4">
                <DownloadButton pdf={g.pdf} slug={g.slug} block />
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
  const cls = `inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-[15px] font-semibold ${block ? "w-full" : ""}`;
  if (!pdf) {
    return (
      <span className={`${cls} cursor-not-allowed bg-line text-muted`} aria-disabled="true">
        <Download size={20} /> PDF coming soon
      </span>
    );
  }
  return (
    <a href={pdf} download={`${slug}-guide-buildwithabinash.pdf`} className={`${cls} bg-deep text-white hover:bg-green`}>
      <Download size={20} /> Download the PDF
    </a>
  );
}

function PdfCover({ g }: { g: Guide }) {
  return (
    <div
      aria-hidden="true"
      className="flex aspect-[210/297] w-[210px] rotate-2 flex-col rounded-md border border-rule bg-cream px-[18px] py-5 shadow-[0_24px_48px_rgba(18,74,58,0.14)] md:w-[300px] md:px-[26px] md:py-[30px]"
    >
      <span className="text-[5px] font-bold uppercase tracking-[0.28em] text-green md:text-[7px]">Free guide · @buildwithabinash</span>
      <span className="mt-[18px] font-serif text-lg font-bold leading-[1.08] text-ink md:mt-[26px] md:text-[25px]">
        {g.title} <em className="block font-normal text-green">{g.titleEm}</em>
      </span>
      {g.stats ? (
        <span className="mt-auto grid grid-cols-4 border-y border-rule py-[7px] font-serif text-[9px] text-ink md:py-2.5 md:text-[13px]">
          {g.stats.map((s) => (
            <span key={s.label} className={s.accent ? "text-green" : ""}>{s.value}</span>
          ))}
        </span>
      ) : (
        <span className="mt-auto border-t border-rule pt-2 font-serif text-[8px] italic text-muted md:text-[10px]">Let&apos;s learn the smart way.</span>
      )}
    </div>
  );
}
