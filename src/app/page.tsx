import Link from "next/link";
import { FollowAlong } from "@/components/FollowAlong";
import { GuideCard } from "@/components/GuideCard";
import { Check, TopicIcon } from "@/components/Icons";
import { guides, guidesInTopic, paths, series, topics } from "@/lib/guides";
import { site } from "@/lib/site";

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
      {/* Hero */}
      <section className="topo on-dark text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 pb-11 pt-9 md:flex-row md:items-center md:gap-14 md:px-6 md:py-24">
          <div className="min-w-0 md:flex-[1.6]">
            {/* Mobile: face first, so people from Instagram recognise you */}
            <div className="flex items-center gap-3.5 md:hidden">
              <div className="relative h-[76px] w-[76px] flex-none">
                <div className="dots absolute -right-2 -top-2 h-10 w-10 rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-signal bg-midnight-2 text-[10px] text-dim">
                  Photo
                </div>
              </div>
              <div>
                <p className="font-serif text-lg font-bold">Abinash</p>
                <p className="text-[13px] text-dim">{site.handle}</p>
              </div>
            </div>

            <p className="kicker mt-7 text-signal md:mt-0 md:text-[13px]">{site.tagline}</p>
            <h1 className="mt-3 font-serif text-[36px] font-bold leading-[1.12] md:mt-5 md:text-6xl md:leading-[1.08]">
              Money is 20% math and 80% behaviour. <em className="font-normal text-signal">I make both simple.</em>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-sage md:mt-6 md:text-[19px]">
              Free guides and short videos for Indian salaried professionals. I take one money question at a time,
              work out the real numbers, and skip the tips and shortcuts.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row md:mt-9 md:gap-3.5">
              <Link
                href="/guides/"
                className="rounded-full bg-signal px-6 py-[15px] text-center font-semibold text-midnight hover:brightness-95"
              >
                Browse free guides
              </Link>
              <Link
                href="/#start"
                className="rounded-full border border-paper/35 px-6 py-[14px] text-center font-medium text-paper hover:border-paper"
              >
                New here? Start here
              </Link>
            </div>
            <ul className="mt-6 flex flex-col gap-2.5 text-sm text-dim md:mt-11 md:flex-row md:flex-wrap md:gap-x-7">
              {["Free, no signup", "Every number sourced and dated", "Education, not advice"].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <Check size={18} className="text-signal" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop portrait */}
          <div className="hidden justify-center md:flex md:flex-1">
            <div className="relative aspect-square w-[360px] max-w-full">
              <div className="dots absolute -right-[18px] -top-[18px] h-40 w-40 rounded-3xl" />
              <div className="absolute inset-0 flex items-center justify-center rounded-full border-[3px] border-signal bg-midnight-2 text-sm text-dim">
                Portrait coming soon
              </div>
              <div className="absolute -left-3 bottom-[18px] rounded-2xl bg-paper px-4 py-3 text-ink shadow-2xl">
                <p className="font-serif text-[17px] font-bold">Abinash</p>
                <p className="text-[13px] text-muted">{site.handle}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start here */}
      <section id="start" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 pb-5 pt-12 md:px-6 md:pb-10 md:pt-24">
          <p className="kicker text-green">Start here</p>
          <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight text-ink md:text-[42px]">
            Pick where you are. <em className="font-normal text-green">Follow the path.</em>
          </h2>
          <p className="mt-3 hidden max-w-2xl text-[17px] leading-relaxed text-muted md:block">
            Each path is a short, ordered set of guides. Read them in order and you will understand the topic well
            enough to decide for yourself.
          </p>
          <div className="mt-5 grid gap-3 md:mt-11 md:grid-cols-3 md:gap-6">
            {paths.map((p, i) => (
              <Link
                key={p.id}
                href={`/guides/?path=${p.id}`}
                className="flex gap-4 rounded-2xl border border-line bg-white p-[18px] hover:shadow-lg md:flex-col md:gap-3.5 md:p-7"
              >
                <span className="w-8 flex-none font-serif text-[26px] leading-none text-green md:text-[44px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-serif text-lg font-bold text-ink md:text-2xl">{p.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-soft md:mt-3 md:text-[15px]">
                    <span className="md:hidden">{p.short}</span>
                    <span className="hidden md:inline">{p.text}</span>
                  </span>
                  <span className="mt-2 block text-[13px] font-semibold text-green md:mt-4 md:text-sm">
                    {p.guides.length} {p.guides.length === 1 ? "guide" : "guides"} · Start the path →
                  </span>
                </span>
              </Link>
            ))}
          </div>
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

      {/* Series */}
      <section id="series" className="topo on-dark scroll-mt-16 text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 md:flex-row md:items-center md:gap-12 md:px-6 md:py-24">
          <div className="min-w-0 md:flex-1">
            <p className="kicker text-signal">Series · {series.count} episodes</p>
            <h2 className="mt-2.5 font-serif text-[28px] font-bold leading-tight md:text-[40px]">
              {series.title}, <em className="font-normal text-signal">{series.titleEm}</em>
            </h2>
            <p className="mt-4 hidden text-[17px] leading-relaxed text-sage md:block">
              Each episode stands on its own. Watch them in order and the market stops feeling like a casino.
            </p>
            <a
              href={series.url ?? "https://www.instagram.com/buildwithabinash/"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 hidden rounded-full bg-signal px-6 py-3.5 font-semibold text-midnight md:inline-block"
            >
              Watch the series
            </a>
          </div>
          <ol className="flex min-w-0 flex-col gap-2 md:flex-[1.2] md:gap-2.5">
            {series.episodes.map((e, i) => (
              <li
                key={e}
                className="flex items-center gap-3.5 rounded-xl border border-signal/25 bg-white/5 px-4 py-3.5 md:gap-[18px] md:px-5 md:py-4"
              >
                <span className="w-5 font-serif text-xl text-signal md:w-7 md:text-[22px]">{i + 1}</span>
                <span className="text-[15px] md:text-base">{e}</span>
              </li>
            ))}
            <li className="flex items-center gap-3.5 px-4 py-3.5 text-dim md:gap-[18px] md:px-5">
              <span className="w-5 font-serif text-xl md:w-7">+{series.count - series.episodes.length}</span>
              <span className="text-[15px] md:text-base">{series.more}</span>
            </li>
          </ol>
          <a
            href={series.url ?? "https://www.instagram.com/buildwithabinash/"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-signal px-6 py-3.5 text-center font-semibold text-midnight md:hidden"
          >
            Watch the series
          </a>
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

      {/* About teaser */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-11 md:flex-row md:items-center md:px-6 md:py-24">
          <div className="hidden h-[260px] w-[220px] flex-none items-center justify-center rounded-3xl border border-[#cfe3d8] bg-mint text-center text-sm text-green md:flex">
            Photo coming soon
          </div>
          <div>
            <h2 className="font-serif text-[28px] font-bold text-ink md:text-[38px]">Hi, I&apos;m Abinash.</h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed md:mt-4 md:text-lg">
              I make short videos and free guides about money for people who were never taught it. I want you to
              understand money well enough that you don&apos;t need an influencer to tell you what to do. Including me.
            </p>
            <Link href="/about/" className="mt-3 inline-block py-2.5 font-semibold text-green md:mt-5 md:text-base">
              More about me and how I work →
            </Link>
          </div>
        </div>
      </section>

      <FollowAlong />
    </>
  );
}
