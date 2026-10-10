import type { Metadata } from "next";
import Link from "next/link";

// Without this the 404 inherits the site-wide canonical and tells crawlers it
// is the homepage. alternates is cleared so no canonical tag is emitted at all.
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
  alternates: {},
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20 text-center md:py-32">
      <p className="kicker text-green">Page not found</p>
      <h1 className="mt-3 font-serif text-[34px] font-bold text-ink md:text-5xl">
        This page <em className="font-normal text-green">doesn&apos;t exist.</em>
      </h1>
      <p className="mt-4 text-muted">The guide may have moved. Everything is in the guides library.</p>
      <Link href="/guides/" className="btn btn-primary mt-7 px-6 py-3.5">
        Browse all guides
      </Link>
    </section>
  );
}
