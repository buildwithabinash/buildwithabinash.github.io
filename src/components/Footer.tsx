import Link from "next/link";
import { disclaimer, site, socials } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="on-dark border-t border-paper/10 bg-midnight text-dim">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-9 md:px-6 md:pt-14">
        <div className="flex flex-col gap-6 md:flex-row md:justify-between">
          <div>
            <Logo />
            <p className="mt-1.5 font-serif text-[15px] italic text-mist md:text-[17px]">{site.signOff}</p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-4 text-sm md:flex md:flex-wrap md:gap-x-7">
            <Link href="/guides/" className="py-2.5 text-mist hover:text-paper">Guides</Link>
            <Link href="/tools/" className="py-2.5 text-mist hover:text-paper">Calculators</Link>
            <Link href="/about/" className="py-2.5 text-mist hover:text-paper">About</Link>
            <Link href="/about/#research" className="py-2.5 text-mist hover:text-paper">How I research</Link>
            <Link href="/survey/" className="py-2.5 text-mist hover:text-paper">Suggest a topic</Link>
            <a href={`mailto:${site.email}`} className="py-2.5 text-mist hover:text-paper">Email me</a>
          </nav>
        </div>

        <nav aria-label="Social" className="mt-6 grid grid-cols-2 gap-2.5 md:flex md:flex-wrap">
          {socials.map((s) =>
            s.url ? (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-signal/35 px-4 py-2.5 text-center text-sm text-paper hover:border-signal"
              >
                {s.name}
              </a>
            ) : (
              <span key={s.id} className="rounded-full border border-paper/15 px-4 py-2.5 text-center text-sm text-dim">
                {s.id === "broadcast" ? "Broadcast" : s.name} · soon
              </span>
            ),
          )}
        </nav>

        <p id="disclaimer" className="mt-7 max-w-3xl border-t border-dim/25 pt-5 text-xs leading-relaxed md:text-[13px]">
          {disclaimer}
        </p>
        <p className="mt-3 text-xs">© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
