import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Logo({ className = "", markSize = 30 }: { className?: string; markSize?: number }) {
  return (
    <Link
      href="/"
      aria-label="Build with Abinash, home"
      className={`inline-flex items-center gap-2.5 font-serif text-xl font-bold text-paper md:text-[22px] ${className}`}
    >
      <BrandMark size={markSize} />
      <span>
        build<span className="text-signal">with</span>abinash
      </span>
    </Link>
  );
}
