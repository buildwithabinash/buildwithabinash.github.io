"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "@/components/Icons";
import { type ModuleId, type Tool, modules, toolHref, tools } from "@/lib/tools";

type Filter = "all" | ModuleId;

/**
 * Name and one line. The longer blurb is on the tool's own page; here it
 * turned 41 tools into a wall of paragraphs, and the whole card is the
 * link, so it needs no "open" line of its own.
 */
function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={toolHref(tool.slug)}
      className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4 transition-shadow hover:shadow-lg md:px-6 md:py-5"
    >
      <span className="min-w-0">
        <span className="block font-serif text-lg font-bold text-ink md:text-xl">
          {tool.name} <em className="font-normal text-green">{tool.nameEm}</em>
        </span>
        <span className="mt-1 block text-sm leading-snug text-soft md:text-[15px]">{tool.short}</span>
      </span>
      <span aria-hidden className="flex-none text-lg text-green transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}

/**
 * The library, browsed by module. With nothing picked every module is
 * shown under its own heading, so /tools/#loans and the like land on the
 * right group without JavaScript; picking one narrows to it.
 *
 * Search and the module chips are two ways in, not two filters stacked.
 * Typing searches every calculator, and picking a module clears the
 * search. Stacked, "EMI" typed with Investing picked said there was no
 * EMI calculator.
 */
export function ToolsBrowser() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () =>
      tools.filter(
        (t) =>
          (q ? true : filter === "all" || t.module === filter) &&
          (!q || [t.name, t.nameEm, t.short, t.blurb, t.slug].join(" ").toLowerCase().includes(q)),
      ),
    [filter, q],
  );

  const shownModules = modules.filter((m) => q || filter === "all" || m.id === filter);

  const search = (v: string) => {
    setQuery(v);
    if (v.trim()) setFilter("all");
  };
  const pick = (f: Filter) => {
    setFilter(f);
    setQuery("");
  };

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="relative mt-5 max-w-lg md:mt-8">
          <label htmlFor="tool-search" className="sr-only">
            Search calculators
          </label>
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            id="tool-search"
            type="search"
            value={query}
            onChange={(e) => search(e.target.value)}
            placeholder="Search, like HRA or EMI"
            className="w-full rounded-full border border-rule bg-surface py-3.5 pl-11 pr-5 text-base text-body placeholder:text-muted focus:border-green focus:outline-none"
          />
        </div>
      </div>

      <div
        role="group"
        aria-label="Filter by module"
        className="no-scrollbar mx-auto mt-3.5 flex max-w-6xl gap-2 overflow-x-auto px-5 pb-2 pt-1 md:mt-5 md:flex-wrap md:gap-2.5 md:px-6"
      >
        {[{ id: "all" as Filter, title: "All" }, ...modules].map((m) => {
          const on = m.id === filter && !q;
          const count = m.id === "all" ? tools.length : tools.filter((t) => t.module === m.id).length;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => pick(m.id)}
              aria-pressed={on}
              className={`h-11 flex-none whitespace-nowrap rounded-full border px-4 text-sm font-medium md:px-[18px] ${
                on ? "border-fill-deep bg-fill-deep text-white" : "border-rule bg-surface text-body hover:border-green"
              }`}
            >
              {m.title} <span className={on ? "text-white/70" : "text-muted"}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-10 pt-4 md:px-6 md:pb-16 md:pt-10">
        {matches.length === 0 && (
          <p className="rounded-2xl border border-dashed border-rule px-5 py-8 text-center text-muted">
            No calculator for &quot;{query.trim()}&quot; yet.{" "}
            <Link href="/survey/" className="font-semibold text-green underline">
              Ask for it in the survey
            </Link>{" "}
            and it may be the next one.
          </p>
        )}
        {shownModules.map((m, mi) => {
          const inModule = matches.filter((t) => t.module === m.id);
          if (inModule.length === 0) return null;
          return (
            <div key={m.id} id={m.id} className={`scroll-mt-24 ${mi > 0 ? "mt-12 md:mt-16" : ""}`}>
              <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-b border-rule pb-3">
                <span className="font-serif text-[22px] font-bold leading-none text-green md:text-[26px]">
                  {String(modules.indexOf(m) + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-xl font-bold text-ink md:text-2xl">{m.title}</h2>
                <span className="ml-auto text-[13px] text-muted">
                  {inModule.length} {inModule.length === 1 ? "tool" : "tools"}
                </span>
                <p className="w-full text-sm text-muted md:text-[15px]">{m.short}</p>
              </div>

              <div className="mt-4 grid gap-2.5 md:mt-6 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
                {inModule.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
