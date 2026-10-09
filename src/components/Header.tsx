"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { instagram, socials } from "@/lib/site";
import { Close, Menu } from "./Icons";
import { Logo } from "./Logo";

const nav = [
  { href: "/#start", label: "Start here" },
  { href: "/guides/", label: "Guides" },
  { href: "/#series", label: "Series" },
  { href: "/about/", label: "About" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && pathname.startsWith(href);

  return (
    <header className="on-dark sticky top-0 z-40 border-b border-signal/20 bg-midnight">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between pl-5 pr-3 md:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={`py-2.5 ${isActive(n.href) ? "font-semibold text-signal" : "text-mist hover:text-paper"}`}
            >
              {n.label}
            </Link>
          ))}
          <a
            href={instagram.url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-signal px-[18px] py-[11px] font-semibold text-midnight hover:brightness-95"
          >
            Follow on Instagram
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-paper/20 text-paper md:hidden"
        >
          {open ? <Close size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto bg-midnight px-5 pb-7 pt-2 shadow-2xl md:hidden"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-paper/10 py-4 text-lg text-paper"
            >
              {n.label}
            </Link>
          ))}
          <p className="kicker mt-5 text-dim">Follow</p>
          <div className="mt-3 grid grid-cols-2 gap-2.5">
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
