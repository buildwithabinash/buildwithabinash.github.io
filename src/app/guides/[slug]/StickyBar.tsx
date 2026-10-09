"use client";

import { useState } from "react";
import { Download, Share } from "@/components/Icons";

/** Mobile only: keeps Download and Share in reach while reading. */
export function StickyBar({ pdf, slug, title }: { pdf: string | null; slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div className="sticky-download fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-line bg-white/95 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
      {pdf ? (
        <a
          href={pdf}
          download={`${slug}-guide-buildwithabinash.pdf`}
          className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-deep font-semibold text-white"
        >
          <Download size={20} /> Download PDF
        </a>
      ) : (
        <span aria-disabled="true" className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-line font-semibold text-muted">
          <Download size={20} /> PDF coming soon
        </span>
      )}
      <button
        type="button"
        onClick={share}
        aria-label={copied ? "Link copied" : "Share this guide"}
        className="flex h-14 w-14 flex-none items-center justify-center rounded-full border border-deep text-deep"
      >
        {copied ? <span className="text-xs font-semibold">Copied</span> : <Share size={20} />}
      </button>
    </div>
  );
}
