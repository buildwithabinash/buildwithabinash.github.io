import Link from "next/link";
import { socials } from "@/lib/site";
import { SocialIcon } from "./Icons";

export function FollowAlong() {
  return (
    // Cream, with the About teaser above it now carrying the dark treatment.
    // The footer below is midnight, so this sits between two dark bands and
    // needs no divider of its own.
    <section aria-labelledby="follow-title" className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-11 md:px-6 md:py-20">
        <p className="flex items-center gap-3.5 text-green">
          <span className="h-px w-7 flex-none bg-green/60" />
          <span className="kicker">Follow along</span>
        </p>
        <h2 id="follow-title" className="mt-4 font-serif text-[26px] font-bold leading-tight text-ink md:text-[38px]">
          Wherever you watch.
        </h2>
        <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-muted md:text-[17px]">
          New guides land on Instagram first. The broadcast channel gets them before anyone else.
        </p>

        <div className="mt-6 grid gap-2.5 md:mt-10 md:grid-cols-4 md:gap-4">
          {socials.map((s) => {
            // Instagram is the one that matters. On cream the emphasis flips:
            // it takes the dark card and the rest sit on white.
            const primary = s.id === "instagram";
            const inner = (
              <>
                <SocialIcon id={s.id} size={24} className={primary ? "text-signal" : "text-green"} />
                <span className="min-w-0 flex-1 md:mt-3.5">
                  <span className="block text-base font-semibold md:text-lg">{s.name}</span>
                  <span className={`mt-0.5 block text-[13px] md:text-sm ${primary ? "text-sage" : "text-muted"}`}>
                    {s.handle} · {s.note}
                  </span>
                </span>
                <span
                  className={`flex-none font-semibold md:mt-4 ${primary ? "text-signal" : "text-green"}`}
                  aria-hidden={!s.url}
                >
                  {s.url ? <>{s.cta} →</> : "Soon"}
                </span>
              </>
            );

            const base =
              "flex items-center gap-3.5 rounded-2xl px-[18px] py-4 transition-colors md:flex-col md:items-start md:gap-0 md:p-6";
            const skin = primary
              ? "on-dark bg-midnight text-paper hover:bg-midnight-2"
              : "border border-line bg-white text-ink hover:border-green";

            return s.url ? (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={`${base} ${skin}`}>
                {inner}
              </a>
            ) : (
              <div key={s.id} className={`${base} border border-line bg-white text-ink opacity-60`}>
                {inner}
              </div>
            );
          })}
        </div>

        {/* The survey sits here rather than in the nav: this is the section
            about staying in touch, and it is one row rather than another
            section on an already long page. */}
        <div className="mt-2.5 flex flex-col gap-4 rounded-2xl border border-line bg-white px-5 py-5 md:mt-4 md:flex-row md:items-center md:justify-between md:px-7 md:py-6">
          <div>
            <p className="font-serif text-lg font-bold text-ink md:text-xl">What should I cover next?</p>
            <p className="mt-1 text-sm leading-relaxed text-muted md:text-[15px]">
              Four questions, no signup. The most asked ones become the next guide.
            </p>
          </div>
          <Link href="/survey/" className="btn btn-primary flex-none px-6 py-3.5">
            Suggest a topic
          </Link>
        </div>
      </div>
    </section>
  );
}
