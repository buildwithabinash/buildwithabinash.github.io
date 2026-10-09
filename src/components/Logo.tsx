import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Build with Abinash, home"
      className={`font-serif text-xl font-bold text-paper md:text-[22px] ${className}`}
    >
      build<span className="text-signal">with</span>abinash
    </Link>
  );
}
