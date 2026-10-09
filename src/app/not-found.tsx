import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-5 py-20 text-center md:py-32">
      <p className="kicker text-green">Page not found</p>
      <h1 className="mt-3 font-serif text-[34px] font-bold text-ink md:text-5xl">
        This page <em className="font-normal text-green">doesn&apos;t exist.</em>
      </h1>
      <p className="mt-4 text-muted">The guide may have moved. Everything is in the guides library.</p>
      <Link href="/guides/" className="mt-7 inline-block rounded-full bg-deep px-6 py-3.5 font-semibold text-white">
        Browse all guides
      </Link>
    </section>
  );
}
