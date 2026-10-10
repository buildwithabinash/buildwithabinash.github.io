import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, graph, personId, siteId } from "@/lib/schema";
import { disclaimer, ogImage, site, socials } from "@/lib/site";

const description =
  "Who Abinash is, why @buildwithabinash exists, and the five rules every guide follows. Education, not advice.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about/" },
  openGraph: { title: "About", description, url: `${site.url}/about/`, images: [ogImage] },
};

const aboutSchema = {
  "@type": "AboutPage",
  "@id": `${site.url}/about/#about`,
  url: `${site.url}/about/`,
  name: `About · ${site.name}`,
  description,
  inLanguage: "en-IN",
  isPartOf: { "@id": siteId },
  mainEntity: { "@id": personId },
};

const rules = [
  { title: "Primary sources first", text: "Rates and rules come from the official source: Income Tax Department, EPFO, SEBI, RBI, India Post." },
  { title: "Maths done in code", text: "Every total and projection is calculated, then checked again in the final PDF." },
  { title: "Dated, every time", text: "Rates change. Each guide shows the day I last checked it." },
  { title: "Tamil Nadu figures", text: "Where a number depends on the state, like road tax or professional tax, I use Tamil Nadu and say so." },
  { title: "Corrections in public", text: "If a video rounded or got something wrong, the guide says so plainly." },
];

const roadmap = [
  { label: "Now", text: "A new video most days, and a free guide for the ones you ask about." },
  { label: "Next", text: "More guides, and more calculators you can run your own numbers through." },
  { label: "Learning", text: "I'm studying for the NISM Investment Adviser exams (X-A and X-B). Until I'm registered, everything here stays education." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph(
          aboutSchema,
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "About", path: "/about/" },
          ]),
        )}
      />
      {/* main carries top padding to clear the fixed header, which would leave
          a cream strip above this dark section. Pull it back up and re-add the
          space inside, the same way the home hero does, so the dark runs to the
          top of the page and the header island sits on it. */}
      <section className="topo on-dark -mt-[74px] text-paper md:-mt-[88px]">
        {/* One grid, two shapes. On phones the photo sits left with the kicker
            and heading to its right, and the body copy runs full width beneath;
            both scale with the screen so "Hi, I&apos;m Abinash." stays on one line: a
            fixed photo width starved the column on a 320px phone. The phrase is
            about 7.5x the font size. Sized in vw, not %, because a percentage
            width inside an auto grid track resolves against a track that is
            itself sized by its content, and collapses.
            On desktop the photo spans both rows in its own column, which is the
            original side-by-side. A grid rather than two blocks, so the heading
            exists once rather than once per breakpoint. */}
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start gap-x-5 gap-y-5 px-5 pb-10 pt-[106px] md:grid-cols-[340px_1fr] md:items-center md:gap-x-14 md:gap-y-5 md:px-6 md:pb-20 md:pt-[168px]">
          <div className="aspect-[3/5] w-[31vw] max-w-[140px] overflow-hidden rounded-2xl border-2 border-signal bg-midnight-2 md:row-span-2 md:w-[340px] md:max-w-none md:rounded-3xl">
            <Image
              src="/abinash-about.webp"
              alt="Abinash"
              width={900}
              height={1500}
              priority
              className="h-full w-full object-cover object-top"
            />
          </div>
          <div className="min-w-0 self-center md:self-end">
            <p className="kicker text-signal">About</p>
            <h1 className="mt-2 font-serif text-[clamp(19px,6.2vw,26px)] font-bold leading-[1.15] md:mt-3.5 md:text-[56px] md:leading-[1.08]">
              Hi, I&apos;m Abinash. <em className="font-normal text-signal">I explain money in plain words.</em>
            </h1>
          </div>
          <p className="col-span-2 max-w-2xl text-base leading-relaxed text-mist md:col-span-1 md:col-start-2 md:self-start md:text-[19px]">
            I&apos;m based in Coimbatore. I make short videos and free guides for Indian salaried professionals who
            were never taught how money works. One question at a time, with the real numbers worked out.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 pt-10 md:px-6 md:pt-[88px]">
          <p className="kicker text-green">Why I started</p>
          <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight text-ink md:text-[38px]">
            School taught us algebra. <em className="font-normal text-green">Nobody taught us a salary slip.</em>
          </h2>
          {/* TODO: replace with Abinash's own story, 3 to 5 sentences */}
          <p className="mt-4 text-base leading-[1.75] md:mt-6 md:text-lg">
            India has a huge young population and very few people who explain money without selling something. I
            want you to understand it well enough to decide for yourself, without depending on an influencer. That
            includes me.
          </p>
          <blockquote className="mt-6 rounded-2xl bg-mint px-5 py-5 md:mt-10 md:px-8 md:py-7">
            <p className="font-serif text-xl leading-snug text-ink md:text-[26px]">&ldquo;{site.oneLiner}&rdquo;</p>
          </blockquote>
        </div>
      </section>

      <section id="research" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 pt-11 md:px-6 md:pt-24">
          <p className="kicker text-green">How I research</p>
          <h2 className="mt-2.5 font-serif text-[28px] font-bold text-ink md:text-[38px]">
            Five rules <em className="font-normal text-green">every guide follows.</em>
          </h2>
          <ol className="mt-4 grid border-t border-rule md:mt-9 md:grid-cols-3 md:gap-5 md:border-t-0 lg:grid-cols-5">
            {rules.map((r, i) => (
              <li
                key={r.title}
                className="flex gap-3.5 border-b border-line py-4 last:border-b-0 md:flex-col md:gap-2 md:rounded-2xl md:border md:bg-white md:p-6 md:last:border-b"
              >
                <span className="w-5 flex-none font-serif text-2xl leading-tight text-green md:text-[34px]">{i + 1}</span>
                <span>
                  <span className="block font-serif text-lg font-bold text-ink md:text-xl">{r.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-soft md:text-[15px]">{r.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="topo on-dark mt-10 text-paper md:mt-24">
        <div className="mx-auto max-w-6xl px-5 py-11 md:px-6 md:py-[88px]">
          <p className="kicker text-signal">Where this is going</p>
          <h2 className="mt-2.5 max-w-3xl font-serif text-[26px] font-bold leading-tight md:text-[38px]">
            The goal is simple: <em className="font-normal text-signal">more people who understand their own money.</em>
          </h2>
          <div className="mt-5 grid gap-2.5 md:mt-10 md:grid-cols-3 md:gap-5">
            {roadmap.map((r) => (
              <div key={r.label} className="rounded-2xl border border-signal/25 bg-white/5 px-[18px] py-4 md:p-6">
                <p className="kicker text-signal">{r.label}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed md:mt-2.5 md:text-base">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-3.5 px-5 pt-10 md:flex-row md:gap-6 md:px-6 md:pt-20">
          <div className="rounded-2xl border border-line bg-white px-5 py-6 md:flex-1 md:p-8">
            <h2 className="font-serif text-[22px] font-bold text-ink md:text-[26px]">What I will never do</h2>
            <ul className="mt-2.5 list-disc pl-5 text-[15px] leading-[1.8] md:mt-3.5 md:text-base">
              <li>Tell you to buy, sell or hold a specific stock or fund</li>
              <li>Promise or hint at guaranteed returns</li>
              <li>Share live stock tips</li>
              <li>Run a paid promotion without labelling it</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-rose px-5 py-5 md:flex-1 md:p-8">
            <p className="kicker text-[10px] text-alert md:text-[11px]">Education, not advice</p>
            <p className="mt-2 text-sm leading-[1.7] md:mt-3 md:text-[15px]">{disclaimer}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 pb-11 pt-6 md:px-6 md:pb-24 md:pt-10">
          <div className="on-dark rounded-3xl bg-deep px-5 py-7 text-paper md:flex md:items-center md:justify-between md:gap-7 md:p-10">
            <div>
              <h2 className="font-serif text-2xl font-bold md:text-[30px]">Say hello</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-leaf md:text-base">
                Questions are best in the comments, so everyone learns. For brand enquiries, email me.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:max-w-md md:flex-none">
              <a
                href={`mailto:${site.email}`}
                className="btn btn-primary w-full px-4 py-3.5 text-[15px]"
              >
                {site.email}
              </a>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                {socials.map((s) =>
                  s.url ? (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-paper/40 px-2 py-3 text-center text-sm hover:border-paper"
                    >
                      {s.name === "Broadcast channel" ? "Broadcast" : s.name}
                    </a>
                  ) : (
                    <span key={s.id} className="rounded-full border border-paper/15 px-2 py-3 text-center text-sm text-leaf/70">
                      {s.name === "Broadcast channel" ? "Broadcast" : s.name} · soon
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
