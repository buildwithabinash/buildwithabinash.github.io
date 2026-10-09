import { socials } from "@/lib/site";
import { SocialIcon } from "./Icons";

export function FollowAlong() {
  return (
    <section aria-labelledby="follow-title" className="on-dark bg-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 py-11 md:px-6 md:py-20">
        <h2 id="follow-title" className="font-serif text-[26px] font-bold leading-tight md:text-[38px]">
          Follow along wherever you watch.
        </h2>
        <p className="mt-2 text-[15px] text-leaf md:text-[17px]">
          New guides land on Instagram first. The broadcast channel gets them before anyone else.
        </p>
        <div className="mt-6 grid gap-2.5 md:mt-9 md:grid-cols-4 md:gap-4">
          {socials.map((s) => {
            const primary = s.id === "instagram";
            const inner = (
              <>
                <SocialIcon id={s.id} size={24} className={primary ? "" : "text-signal"} />
                <span className="min-w-0 flex-1 md:mt-3">
                  <span className="block text-base font-semibold md:text-lg">{s.name}</span>
                  <span className={`block text-[13px] md:text-sm ${primary ? "" : "text-leaf"}`}>
                    {s.handle} · {s.note}
                  </span>
                </span>
                <span className="font-semibold md:mt-3" aria-hidden={!s.url}>
                  {s.url ? <>{s.cta} →</> : "Soon"}
                </span>
              </>
            );
            const cls = `flex items-center gap-3.5 rounded-2xl px-[18px] py-4 md:flex-col md:items-start md:gap-0 md:p-6 ${
              primary ? "bg-signal text-midnight" : "border border-paper/25 bg-white/5 text-paper"
            }`;
            return s.url ? (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={`${cls} hover:brightness-110`}>
                {inner}
              </a>
            ) : (
              <div key={s.id} className={`${cls} opacity-70`}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
