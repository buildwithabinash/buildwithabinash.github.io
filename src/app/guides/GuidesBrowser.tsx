"use client";

import { useEffect, useMemo, useState } from "react";
import { GuideCard } from "@/components/GuideCard";
import { Search } from "@/components/Icons";
import { type Topic, getGuide, guides, steps, topics } from "@/lib/guides";

type Filter = "All" | Topic;

export function GuidesBrowser() {
  const [topic, setTopic] = useState<Filter>("All");
  const [pathId, setPathId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Deep links: /guides/?topic=Buying%20smart or /guides/?step=real-price
  //
  // Read from the URL directly rather than with useSearchParams. In a
  // static export that hook makes the whole subtree client-only, which
  // left this page with no guides in its HTML at all: nothing for search
  // engines to follow, and a blank page without JavaScript.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("topic");
    const p = params.get("step");
    if (t && (topics as readonly string[]).includes(t)) setTopic(t as Topic);
    if (p && steps.some((x) => x.id === p)) setPathId(p);
  }, []);

  const path = steps.find((p) => p.id === pathId) ?? null;

  const shown = useMemo(() => {
    let list = path ? path.guides.map((s) => getGuide(s)!).filter(Boolean) : guides;
    if (topic !== "All") list = list.filter((g) => g.topic === topic);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((g) =>
        [g.title, g.titleEm, g.blurb, g.topic, g.slug].join(" ").toLowerCase().includes(q),
      );
    }
    return list;
  }, [path, topic, query]);

  const pick = (t: Filter) => {
    setTopic(t);
    setPathId(null);
  };

  const n = shown.length;

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="relative mt-5 max-w-lg md:mt-8">
          <label htmlFor="guide-search" className="sr-only">Search guides</label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, like EPF or SIP"
            className="w-full rounded-full border border-rule bg-white py-3.5 pl-11 pr-5 text-base text-body placeholder:text-muted focus:border-green focus:outline-none"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by topic"
        className="no-scrollbar mx-auto mt-3.5 flex max-w-6xl gap-2 overflow-x-auto px-5 pb-2 pt-1 md:mt-5 md:flex-wrap md:gap-2.5 md:px-6"
      >
        {(["All", ...topics] as Filter[]).map((t) => {
          const on = t === topic && !path;
          return (
            <button
              key={t}
              type="button"
              onClick={() => pick(t)}
              aria-pressed={on}
              className={`h-11 flex-none whitespace-nowrap rounded-full border px-4 text-sm font-medium md:px-[18px] ${
                on ? "border-deep bg-deep text-white" : "border-rule bg-white text-body hover:border-green"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-2 pt-4 md:px-6 md:pt-10">
        {path && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-mint px-4 py-3 text-sm md:mb-6">
            <span>
              <b className="text-ink">Path:</b> {path.title}. Read these in order.
            </span>
            <button type="button" onClick={() => pick("All")} className="py-1.5 font-semibold text-green">
              Show all guides
            </button>
          </div>
        )}
        <p className="mb-3 text-[13px] text-muted md:mb-5 md:text-sm" aria-live="polite">
          Showing {n === 0 ? "no guides yet" : n === 1 ? "1 guide" : `${n} guides`}
        </p>
        {n === 0 ? (
          <p className="rounded-2xl border border-dashed border-rule px-5 py-8 text-center text-muted">
            Nothing here yet. Ask for it in the comments and it may be the next guide.
          </p>
        ) : (
          <ol className="grid gap-3 md:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] md:gap-6">
            {shown.map((g) => (
              <li key={g.slug} className="flex">
                <GuideCard guide={g} className="w-full" />
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}
