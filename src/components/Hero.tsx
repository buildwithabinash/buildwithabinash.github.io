import Image from "next/image";
import Link from "next/link";
import { Beams } from "@/components/Beams";
import { Arrow, SocialIcon } from "@/components/Icons";
import { site, socials } from "@/lib/site";

export function Hero() {
  return (
    <section className="hero-spot on-dark -mt-[74px] text-paper md:-mt-[88px]">
      <Beams />

      <div className="relative z-[2] mx-auto flex max-w-6xl flex-col px-5 pb-10 pt-[104px] md:min-h-[86vh] md:px-6 md:pb-12 md:pt-[150px]">
        <div className="flex flex-1 flex-col gap-10 md:flex-row md:items-center md:gap-14">
          <div className="min-w-0 md:flex-[1.8]">
            {/* Mobile: face first, so people from Instagram recognise you */}
            <div className="mb-8 flex items-center gap-3.5 md:hidden">
              <div className="h-[76px] w-[76px] flex-none overflow-hidden rounded-full border-2 border-signal bg-midnight-2">
                <Image
                  src="/abinash-avatar.webp"
                  alt=""
                  width={260}
                  height={260}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-serif text-lg font-bold">Abinash</p>
                <p className="text-[13px] text-dim">{site.handle}</p>
              </div>
            </div>

            <p className="flex items-center gap-3.5 text-signal">
              <span className="h-px w-7 flex-none bg-signal/70" />
              <span className="kicker md:text-[12px]">{site.tagline}</span>
            </p>

            <h1 className="mt-5 font-serif text-[40px] font-bold leading-[1.06] md:mt-7 md:text-[46px] md:leading-[1.04] lg:text-[54px]">
              Nobody taught us money.
              <br />
              <em className="font-normal text-signal">So let&apos;s learn it properly.</em>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-sage md:mt-7 md:text-[19px]">
              Free guides, calculators and short videos for Indian salaried professionals. Enough to manage your
              own money, spot a scam before it costs you, and grow and protect what you have.
            </p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:items-center md:mt-10 md:gap-4">
              <Link
                href="/guides/"
                className="btn btn-primary py-2 pl-7 pr-2"
              >
                Browse free guides
                <span className="disc">
                  <Arrow size={16} />
                </span>
              </Link>
              <Link
                href="/#start"
                className="btn btn-ghost px-7 py-[15px]"
              >
                New here? Start here
              </Link>
            </div>
          </div>

          {/* Desktop portrait */}
          <div className="hidden md:flex md:flex-1 md:justify-center">
            <div className="relative aspect-square w-[360px] max-w-full md:-translate-x-10">
              <div className="absolute inset-0 overflow-hidden rounded-full border-[3px] border-signal bg-midnight-2">
                <Image
                  src="/abinash-portrait.webp"
                  alt="Abinash"
                  width={900}
                  height={900}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -left-3 bottom-[18px] rounded-2xl bg-paper px-4 py-3 text-ink shadow-2xl">
                <p className="font-serif text-[17px] font-bold">Abinash</p>
                <p className="text-[13px] font-medium text-green">{site.handle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Utility row, pinned to the bottom of the hero */}
        <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-paper/15 pt-7 md:mt-14 md:pt-9">
          <div className="flex gap-2.5">
            {socials.map((s) =>
              s.url ? (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-mist hover:border-signal hover:text-signal"
                >
                  <SocialIcon id={s.id} size={17} />
                </a>
              ) : null,
            )}
          </div>
          <a href={`mailto:${site.email}`} className="text-sm text-mist hover:text-paper md:text-[15px]">
            {site.email}
          </a>
          <p className="ml-auto flex items-center gap-2.5 text-[13px] text-dim md:text-sm">
            <span className="h-1.5 w-1.5 flex-none rounded-full bg-signal" />
            Education, not advice
          </p>
        </div>
      </div>
    </section>
  );
}
