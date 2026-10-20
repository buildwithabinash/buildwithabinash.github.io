"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { goatcounterCode } from "@/lib/site";

type GoatCounter = { count: (vars: { path: string; referrer?: string; title?: string }) => void };
declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

let lastCounted: string | null = null;

/**
 * One count per page. Next moves between pages without reloading, so the
 * script's own count-on-load would only ever see the first one; it is
 * turned off and each page is counted here instead.
 *
 * Sends the path and nothing after "?". A calculator's address carries the
 * visitor's numbers there, so neither the path nor the referrer includes it.
 * Visitors whose browser asks not to be tracked are not counted.
 */
function countPage(path: string) {
  const gc = window.goatcounter;
  if (!gc || lastCounted === path) return;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (nav.globalPrivacyControl || nav.doNotTrack === "1") return;
  lastCounted = path;
  gc.count({ path, referrer: document.referrer.split("?")[0], title: document.title });
}

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    countPage(pathname);
  }, [pathname]);

  if (!goatcounterCode) return null;
  return (
    <Script
      src="https://gc.zgo.at/count.js"
      data-goatcounter={`https://${goatcounterCode}.goatcounter.com/count`}
      data-goatcounter-settings='{"no_onload": true}'
      strategy="afterInteractive"
      onLoad={() => countPage(window.location.pathname)}
    />
  );
}
