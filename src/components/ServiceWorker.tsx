"use client";

import { useEffect } from "react";

/** Registers public/sw.js in production builds; dev reloads stay uncached. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* offline support is a bonus; the site works without it */
    });
  }, []);
  return null;
}
