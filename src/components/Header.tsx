"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { instagram, socials } from "@/lib/site";
import { Close, Instagram, Menu } from "./Icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const nav = [
  { href: "/#start", label: "Start here" },
  { href: "/guides/", label: "Guides" },
  { href: "/tools/", label: "Tools" },
  { href: "/survey/", label: "Survey" },
  { href: "/about/", label: "About" },
];

/**
 * The bar floats off the top edge as one rounded, blurred slab, and
 * narrows once you scroll past the hero. It slides away while you scroll
 * down, so it never sits on top of what you are reading or the field you
 * are typing in, and comes back the moment you scroll up.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      // A few pixels of slack, so a shaky thumb does not flicker it.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 120);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      // Keep Tab inside the open menu: past the last link it comes back to
      // the top, rather than escaping to the page behind the sheet.
      const items = Array.from(
        document.querySelectorAll<HTMLElement>("header a[href], header button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    // The sheet covers the page, so Tab must not wander into the page behind it.
    const behind = [document.getElementById("main"), document.querySelector("footer")];
    behind.forEach((el) => el?.setAttribute("inert", ""));
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      behind.forEach((el) => el?.removeAttribute("inert"));
    };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header
      className={`on-dark fixed inset-x-0 top-0 z-40 px-4 pt-3 transition-transform duration-300 motion-reduce:transition-none md:px-6 md:pt-5 ${
        hidden && !open ? "-translate-y-[120%]" : ""
      }`}
      onFocus={() => setHidden(false)}
    >
      <div
        className={`mx-auto flex items-center justify-between rounded-full border border-paper/12 bg-midnight/80 py-2 pl-5 pr-2 backdrop-blur-xl transition-all duration-300 md:pl-7 md:pr-2.5 ${
          scrolled ? "max-w-4xl shadow-[0_10px_40px_rgba(0,0,0,0.5)]" : "max-w-6xl"
        }`}
      >
        <Logo className="!text-[19px] md:!text-xl" />

        <nav aria-label="Main" className="hidden items-center gap-1 text-[15px] lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                isActive(n.href) ? "bg-paper/10 text-paper" : "text-mist hover:text-paper"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <ThemeToggle className="ml-1" />
          <a
            href={instagram.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary ml-2 px-5 py-2.5 text-sm"
          >
            <Instagram size={16} />
            Follow
          </a>
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/20 text-paper"
          >
            {open ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile: full sheet rather than a dropdown, so the links can breathe */}
      {open && (
        <nav
          id="site-menu"
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 top-[74px] z-40 flex flex-col overflow-y-auto bg-midnight px-5 pb-9 pt-4 lg:hidden"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="border-b border-paper/10 py-5 font-serif text-[28px] font-bold text-paper"
            >
              {n.label}
            </Link>
          ))}

          <p className="kicker mt-auto pt-8 text-dim">Follow along</p>
          <div className="mt-3.5 grid grid-cols-2 gap-2.5">
            {socials.map((s) =>
              s.url ? (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-xl px-2 py-3.5 text-center text-sm ${
                    s.id === "instagram" ? "bg-signal font-semibold text-midnight" : "border border-signal/35 text-paper"
                  }`}
                >
                  {s.name === "Broadcast channel" ? "Broadcast" : s.name}
                </a>
              ) : (
                <span key={s.id} className="rounded-xl border border-paper/15 px-2 py-3.5 text-center text-sm text-dim">
                  {s.name === "Broadcast channel" ? "Broadcast" : s.name} · soon
                </span>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
