import Link from "next/link";
import { type Guide, guideHref } from "@/lib/guides";

export function GuideCard({ guide, compact = false, className = "" }: { guide: Guide; compact?: boolean; className?: string }) {
  return (
    <Link
      href={guideHref(guide.slug)}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg ${className}`}
    >
      <span className="block border-b border-line bg-card p-5 md:p-7">
        <span className="kicker block text-green">{guide.topic}</span>
        <span className="mt-2.5 block font-serif text-xl font-bold leading-snug text-ink md:mt-3.5 md:text-[25px]">
          {guide.title} <em className="font-normal text-green">{guide.titleEm}</em>
        </span>
      </span>
      <span className="flex flex-1 flex-col gap-3 px-5 pb-4 pt-3.5 md:px-7 md:pb-6 md:pt-5">
        {!compact && <span className="text-sm leading-relaxed text-soft md:text-[15px]">{guide.blurb}</span>}
        <span className="mt-auto flex justify-between gap-2 text-[13px] text-muted">
          <span>{guide.verified ? `Verified ${guide.verified}` : "Free PDF"}</span>
          <span className="font-semibold text-green group-hover:underline">Open →</span>
        </span>
      </span>
    </Link>
  );
}
