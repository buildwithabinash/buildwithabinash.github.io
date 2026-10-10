import Image from "next/image";
import Link from "next/link";
import { FollowAlong } from "@/components/FollowAlong";
import { GuideCard } from "@/components/GuideCard";
import { Hero } from "@/components/Hero";
import { TopicIcon } from "@/components/Icons";
import { featuredTools, toolHref, tools, toolsForStep } from "@/lib/tools";
import { guides, guidesInTopic, steps, topics } from "@/lib/guides";

const pillars = [
  { title: "Money psychology", text: "Why we delay, panic and overspend, and how to catch yourself doing it." },
  { title: "Money words, decoded", text: "TDS, SIP, LTCG and the rest, in plain words." },
  { title: "Investing myths", text: "How compounding really works, and the traps that look like shortcuts." },
  { title: "Tax, made simple", text: "ITR, deductions and deadlines, timed for when you need them." },
  { title: "Everyday money", text: "Bikes, cars, EMIs and auctions: the real price before you sign." },
];

export default function Home() {
  const latest = guides.slice(0, 3);

  return (
    <>
      <Hero />

      {/* Start here */}
      <section id="start" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 md:px-6 md:pb-16 md:pt-24">
          <p className="kicker text-green">Start here</p>
          <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight text-ink md:text-[42px]">
            Money has an order. <em className="font-normal text-green">Most of us learn it backwards.</em>
          </h2>
          <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-muted md:mt-4 md:text-[17px]">
            Investing is the interesting part, so it is where nearly everyone starts. It is step six. Here is what comes
            before it, and why each step has to come before the next one.
          </p>

          <ol className="mt-8 md:mt-14">
            {steps.map((s, i) => {
              const linked = s.guides.length > 0;
              const stepTools = toolsForStep(s.id);
              return (
                <li key={s.id} className="relative flex gap-4 pb-8 last:pb-0 md:gap-8">
                  {/* the rail that makes it a sequence rather than a list */}
                  <span aria-hidden className="flex flex-none flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-green/35 bg-mint font-serif text-sm font-bold text-green md:h-11 md:w-11 md:text-base">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {i < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-rule" />}
                  </span>

                  <div className="min-w-0 flex-1 pb-1">
                    <h3 className="font-serif text-lg font-bold leading-snug text-ink md:text-[26px]">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-body md:mt-2.5 md:text-[17px]">{s.what}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted md:text-[15px]">
                      <span className="font-semibold text-soft">Why here: </span>
                      {s.why}
                    </p>

                    {(linked || stepTools.length > 0) && (
                      <p className="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 text-[13px] font-semibold md:text-sm">
                        {linked && (
                          <Link href={"/guides/?step=" + s.id} className="text-green hover:underline">
                            {s.guides.length} {s.guides.length === 1 ? "guide" : "guides"} →
                          </Link>
                        )}
                        {/* One count link per step rather than every tool. The
                            home page shows four calculators in total; the rest
                            live on /tools/, where this lands on the group. */}
                        {stepTools.length > 0 && (
                          <Link href={`/tools/#${s.id}`} className="text-green hover:underline">
                            {stepTools.length} {stepTools.length === 1 ? "calculator" : "calculators"} →
                          </Link>
                        )}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted md:text-sm">
            This is the general order, not a plan for your situation. Education, not advice.
          </p>
        </div>
      </section>

      {/* Latest guides: swipe on mobile, grid on desktop */}
      <section className="pb-11 pt-9 md:pb-24 md:pt-14">
        <div className="mx-auto flex max-w-6xl items-end justify-between gap-3 px-5 md:px-6">
          <div>
            <p className="kicker text-green">Free guides</p>
            <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight text-ink md:text-[42px]">
              From my videos<span className="hidden md:inline">, </span>
              <em className="hidden font-normal text-green md:inline">all in one place.</em>
            </h2>
          </div>
          <Link href="/guides/" className="py-3 text-sm font-semibold text-green md:text-[15px]">
            See all<span className="hidden md:inline"> guides</span> →
          </Link>
        </div>
        <div className="no-scrollbar mx-auto mt-5 flex max-w-6xl snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1.5 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-6">
          {latest.map((g) => (
            <GuideCard key={g.slug} guide={g} className="w-[290px] flex-none snap-start md:w-auto" />
          ))}
        </div>
        <p className="mt-2.5 px-5 text-xs text-muted md:hidden">Swipe for more</p>
      </section>

      {/* Topics */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 md:px-6 md:py-20">
          <h2 className="font-serif text-2xl font-bold text-ink md:text-[34px]">Browse by topic</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5 md:mt-8 md:grid-cols-3 md:gap-4">
            {topics.map((t) => {
              const n = guidesInTopic(t).length;
              return (
                <Link
                  key={t}
                  href={`/guides/?topic=${encodeURIComponent(t)}`}
                  className="flex min-h-[84px] flex-col justify-between rounded-2xl border border-line bg-cream px-3.5 py-4 text-ink hover:border-green md:flex-row md:items-center md:justify-start md:gap-3.5 md:px-5 md:py-5"
                >
                  <TopicIcon topic={t} size={22} className="text-green" />
                  <span className="mt-2.5 md:mt-0">
                    <span className="block text-sm font-semibold leading-snug md:text-base">{t}</span>
                    <span className="hidden text-[13px] text-muted md:block">
                      {n === 0 ? "Coming soon" : `${n} ${n === 1 ? "guide" : "guides"}`}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="hero-spot on-dark scroll-mt-16 text-paper">
        <div className="relative z-[2] mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-3.5 text-signal">
                <span className="h-px w-7 flex-none bg-signal/70" />
                <span className="kicker">Free calculators</span>
              </p>
              <h2 className="mt-4 font-serif text-[28px] font-bold leading-tight md:text-[40px]">
                Run your own numbers, <em className="font-normal text-signal">not mine.</em>
              </h2>
              <p className="mt-3.5 hidden max-w-xl text-[17px] leading-relaxed text-sage md:block">
                The same maths I use in the videos. Change the inputs until they match your life, and watch what moves.
              </p>
            </div>
            <Link href="/tools/" className="py-2 text-sm font-semibold text-signal md:text-[15px]">
              All {tools.length} calculators →
            </Link>
          </div>

          <div className="mt-6 grid gap-2.5 md:mt-11 md:grid-cols-2 md:gap-4">
            {featuredTools.map((t) => (
              <Link
                key={t.slug}
                href={toolHref(t.slug)}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-signal/25 bg-white/5 px-5 py-4 hover:border-signal md:px-6 md:py-5"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-lg font-bold md:text-xl">
                    {t.name} <em className="font-normal text-signal">{t.nameEm}</em>
                  </span>
                  <span className="mt-1 block text-sm text-dim md:text-[15px]">{t.short}</span>
                </span>
                <span aria-hidden className="flex-none text-signal transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* What I post */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 md:px-6 md:py-24">
          <p className="kicker text-green">What I post</p>
          <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight text-ink md:text-[42px]">
            A new video most days. <em className="hidden font-normal text-green md:inline">Five things I keep coming back to.</em>
          </h2>
          <div className="mt-5 grid border-t border-rule md:mt-11 md:grid-cols-5">
            {pillars.map((p) => (
              <div key={p.title} className="border-b border-line py-4 last:border-b-0 md:border-b-0 md:py-6 md:pr-5">
                <h3 className="font-serif text-lg font-bold text-ink md:text-xl">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-soft md:mt-2">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About teaser, on the dark grain-and-glow treatment. The section above
          it is cream and Follow along below is now cream too, so this reads as
          its own band without needing a divider. */}
      <section className="topo on-dark text-paper">
        {/* One grid, two shapes. On phones the heading sits beside the photo so
            the space next to it is used, and the copy runs full width beneath.
            On desktop the photo spans all three rows in its own column, which
            is the original side-by-side. Laid out as a grid rather than two
            blocks so the heading exists once, not once per breakpoint. */}
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4 px-5 py-11 md:grid-cols-[230px_1fr] md:gap-x-12 md:gap-y-0 md:px-6 md:py-24">
          <div className="h-[198px] w-[134px] flex-none self-start overflow-hidden rounded-2xl border border-paper/15 bg-midnight-2 md:row-span-2 md:h-[340px] md:w-[230px] md:self-center md:rounded-3xl">
            {/* A tighter crop than the About page uses. That one was widened
                to give him room in a 340x567 frame; in this thumbnail the same
                margins leave him small and lost, so this keeps the original
                close framing. */}
            <Image
              src="/abinash-teaser.webp"
              alt="Abinash"
              width={768}
              height={1280}
              className="h-full w-full object-cover object-top"
            />
          </div>
          <h2 className="self-center font-serif text-[26px] font-bold leading-tight md:self-end md:text-[38px]">
            Hi, I&apos;m Abinash.
          </h2>
          <div className="col-span-2 md:col-span-1 md:col-start-2">
            <p className="max-w-2xl text-base leading-relaxed text-sage md:mt-4 md:text-lg">
              I make short videos and free guides about money for people who were never taught it. I want you to
              understand money well enough that you don&apos;t need an influencer to tell you what to do. Including me.
            </p>
            <Link href="/about/" className="mt-3 inline-block py-2.5 font-semibold text-signal md:mt-5 md:text-base">
              More about me and how I work →
            </Link>
          </div>
        </div>
      </section>

      <FollowAlong />
    </>
  );
}
