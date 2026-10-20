"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import { rupees as rupeesFull, rupeesShort } from "@/lib/money";

const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

/** A field's key in the address: "Every month I invest" becomes every-month-i-invest. */
const paramKey = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

/**
 * Keeps one input in the page address, so a link carries the numbers it
 * was made with: work out your SIP, send the link, and it opens on yours.
 *
 * Read once after the page loads (the static HTML is built with the
 * defaults), and written back with replaceState so it adds no history
 * entries. A value still at its default is left out of the address.
 * `apply` gets the raw text and must check it: links can be edited.
 */
function useUrlParam(label: string, value: string, apply: (raw: string) => void) {
  const key = paramKey(label);
  const latest = useRef(value);
  latest.current = value;
  const applyRef = useRef(apply);
  applyRef.current = apply;
  const [fallback, setFallback] = useState<string | null>(null);

  useEffect(() => {
    // The default is the value a field first shows on its page, remembered
    // per page, so a field that hides and comes back with a value you set
    // does not mistake that value for the default and drop it.
    const k = `${window.location.pathname}|${key}`;
    if (!pageDefaults.has(k)) pageDefaults.set(k, latest.current);
    setFallback(pageDefaults.get(k)!);
    const raw = new URLSearchParams(window.location.search).get(key);
    if (raw !== null) applyRef.current(raw);
  }, [key]);

  useEffect(() => {
    if (fallback === null) return;
    const url = new URL(window.location.href);
    if (value === fallback) url.searchParams.delete(key);
    else url.searchParams.set(key, value);
    if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
  }, [key, value, fallback]);
}

const pageDefaults = new Map<string, string>();

/** How a quick pick reads: ₹5k, ₹10 L, ₹1 Cr, 12%, 10 yrs. */
function presetLabel(n: number, prefix?: string, suffix?: string) {
  if (prefix === "₹") {
    const short = (v: number) => String(Number(v.toFixed(2)));
    if (n >= 1e7) return `₹${short(n / 1e7)} Cr`;
    if (n >= 1e5) return `₹${short(n / 1e5)} L`;
    if (n >= 1e3) return `₹${short(n / 1e3)}k`;
    return `₹${n}`;
  }
  if (!suffix) return String(n);
  // "% of CTC" and the like: the label beside the box already says what of.
  return suffix.startsWith("%") ? `${n}%` : `${n} ${suffix}`;
}

/** A labelled number, typed in the box, picked from common values, or dragged on the slider. */
export function Field({
  label,
  value,
  set,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
  presets,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  hint?: string;
  /** Common values, one tap each. Quicker than a slider on a phone. */
  presets?: number[];
}) {
  const id = useId();
  // What is in the box while you type. Clamping on every keystroke made it
  // impossible to clear the box and type a new number: deleting down to
  // "2" snapped straight back to the minimum. So the box holds whatever
  // you type, the answer follows as soon as it is a valid number, and it
  // only settles into range when you leave the box.
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Clamped on the way in, so an edited link cannot ask for a 10,000-year loan.
  useUrlParam(label, String(value), (raw) => {
    const n = Number(raw);
    if (raw !== "" && Number.isFinite(n)) set(clamp(n, min, max));
  });
  const shown = draft ?? value.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  const parse = (raw: string) => Number(raw.replace(/[^\d.]/g, ""));
  const typed = (raw: string) => {
    setDraft(raw);
    const n = parse(raw);
    if (/\d/.test(raw) && Number.isFinite(n) && n >= min) set(Math.min(max, n));
  };
  const settle = () => {
    if (draft !== null && /\d/.test(draft)) set(clamp(parse(draft), min, max));
    setDraft(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <label htmlFor={id} className="text-sm font-medium text-soft md:text-[15px]">
          {label}
        </label>
        {/* A tap anywhere on the box focuses it, not just on the digits. */}
        <span
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text items-center gap-1 rounded-xl border border-line bg-surface px-3 py-2.5 focus-within:border-green md:px-2.5 md:py-1.5"
        >
          {prefix && <span className="text-sm text-muted">{prefix}</span>}
          <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={shown}
            onFocus={(e) => e.target.select()}
            onChange={(e) => typed(e.target.value)}
            onBlur={settle}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            className="w-[104px] bg-transparent text-right text-[15px] font-semibold text-ink outline-none"
          />
          {suffix && <span className="text-sm text-muted">{suffix}</span>}
        </span>
      </div>
      {presets && (
        <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label={`Common values for ${label}`}>
          {presets
            .filter((n) => n >= min && n <= max)
            .map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={value === n}
                onClick={() => {
                  setDraft(null);
                  set(n);
                }}
                className={`h-10 rounded-full border px-3.5 text-[13px] font-medium transition-colors md:h-8 md:px-3 ${
                  value === n ? "border-fill-deep bg-fill-deep text-white" : "border-line bg-surface text-soft hover:border-green"
                }`}
              >
                {presetLabel(n, prefix, suffix)}
              </button>
            ))}
        </div>
      )}
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-rule accent-green"
      />
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

/** A labelled line of text, for the few tools that need names or dates. */
export function TextField({
  label,
  value,
  set,
  type = "text",
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  type?: "text" | "month" | "date";
  placeholder?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-soft md:text-[15px]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-[15px] text-ink placeholder:text-muted focus:border-green focus:outline-none"
      />
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
    </div>
  );
}

/** Two or three mutually exclusive choices. */
export function Choice<T extends string>({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: T;
  set: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  useUrlParam(label, value, (raw) => {
    const match = options.find((o) => o.value === raw);
    if (match) set(match.value);
  });
  // A radio group takes one Tab stop, and the arrow keys move the choice,
  // as screen reader users expect from anything announced as radios.
  const groupRef = useRef<HTMLDivElement>(null);
  const move = (from: number, by: number) => {
    const next = (from + by + options.length) % options.length;
    set(options[next].value);
    groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
  };

  return (
    <div>
      <p className="text-sm font-medium text-soft md:text-[15px]">{label}</p>
      <div ref={groupRef} className="mt-2.5 flex gap-2" role="radiogroup" aria-label={label}>
        {options.map((o, i) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            tabIndex={value === o.value ? 0 : -1}
            onClick={() => set(o.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                move(i, 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                move(i, -1);
              }
            }}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
              value === o.value
                ? "border-fill bg-fill text-white"
                : "border-line bg-surface text-soft hover:border-green"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

type Answer = { caption: string; headline: string; tone: "mint" | "rose" };

/** Lets the answer inside a Panel tell it what to show in the phone bar. */
const AnswerContext = createContext<((a: Answer) => void) | null>(null);

function useAnswer(caption: string, headline: string, tone: Answer["tone"]) {
  const report = useContext(AnswerContext);
  useEffect(() => {
    report?.({ caption, headline, tone });
  }, [report, caption, headline, tone]);
}

/** The answer: one number that matters, then the parts it is made of. */
export function Result({
  caption,
  headline,
  sub,
  rows,
  split,
  tone = "mint",
}: {
  caption: string;
  headline: string;
  sub?: string;
  rows: { label: string; value: string }[];
  /**
   * Two parts of a whole, drawn as one bar. With `byYear`, one bar per
   * year instead, so you can see when the growth (or the interest) piles up.
   */
  split?: {
    aLabel: string;
    a: number;
    bLabel: string;
    b: number;
    byYear?: { a: number; b: number }[];
    /** What a and b mean for a single year, when that differs from the totals. */
    yearLabels?: [string, string];
  };
  tone?: "mint" | "rose";
}) {
  useAnswer(caption, headline, tone);
  const total = split ? split.a + split.b : 0;
  // Rounded: browsers trim style values to four decimals, and the
  // unrounded number made the server HTML disagree with the client.
  const aPct = split && total > 0 ? Math.round((split.a / total) * 10000) / 100 : 0;
  const shell =
    tone === "rose" ? "border-rose-line bg-rose" : "border-mint-line bg-mint";
  const rule = tone === "rose" ? "border-rose-line" : "border-mint-line";
  const headlineColor = tone === "rose" ? "text-alert" : "text-deep";

  return (
    <div className={`rounded-2xl border p-5 md:p-7 ${shell}`}>
      <p className={`kicker ${tone === "rose" ? "text-alert" : "text-green"}`}>{caption}</p>
      <p className={`mt-2.5 font-serif text-[32px] font-bold leading-none md:text-[42px] ${headlineColor}`}>
        {headline}
      </p>
      {sub && <p className="mt-2.5 text-sm leading-relaxed text-soft md:text-[15px]">{sub}</p>}

      {split && total > 0 && (
        <div className="mt-6">
          {split.byYear && split.byYear.length > 1 ? (
            <YearBars years={split.byYear} labels={split.yearLabels ?? [split.aLabel, split.bLabel]} />
          ) : (
            <div className="flex h-2.5 overflow-hidden rounded-full bg-surface">
              <span className="bg-fill-deep" style={{ width: `${aPct}%` }} />
              <span className="flex-1 bg-signal" />
            </div>
          )}
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-soft">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-fill-deep" />
              {split.aLabel}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-signal" />
              {split.bLabel}
            </span>
          </div>
        </div>
      )}

      {rows.length > 0 && (
        <dl className={`mt-6 border-t ${rule}`}>
          {rows.map((r) => (
            <div key={r.label} className={`flex items-baseline justify-between gap-4 border-b py-3 last:border-b-0 ${rule}`}>
              <dt className="text-sm text-soft md:text-[15px]">{r.label}</dt>
              <dd className="font-serif text-lg font-bold text-ink md:text-xl">{r.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/**
 * One stacked bar per year. Tap, hover or arrow-key to a year to read it;
 * it starts on the last year, which matches the totals below.
 */
function YearBars({ years, labels }: { years: { a: number; b: number }[]; labels: [string, string] }) {
  const [picked, setPicked] = useState<number | null>(null);
  const at = Math.min(picked ?? years.length - 1, years.length - 1);
  const peak = Math.max(...years.map((y) => y.a + y.b), 1);
  const y = years[at];
  const move = (d: number) => setPicked(Math.max(0, Math.min(years.length - 1, at + d)));

  return (
    <div>
      <p className="text-[13px] text-soft" aria-live="polite">
        <span className="font-semibold text-ink">Year {at + 1}</span> · {labels[0]} {rupeesShort(y.a)} · {labels[1]}{" "}
        {rupeesShort(y.b)}
      </p>
      <div
        role="group"
        tabIndex={0}
        aria-label={`Year by year, ${years.length} years. Use the arrow keys to move between years.`}
        onKeyDown={(e) => {
          if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
          e.preventDefault();
          move(e.key === "ArrowLeft" ? -1 : 1);
        }}
        onMouseLeave={() => setPicked(null)}
        className="mt-2 flex h-28 items-end gap-[2px] rounded-lg md:h-32"
      >
        {years.map((v, i) => {
          const h = ((v.a + v.b) / peak) * 100;
          const aShare = v.a + v.b > 0 ? (v.a / (v.a + v.b)) * 100 : 0;
          return (
            <span
              key={i}
              onMouseEnter={() => setPicked(i)}
              onClick={() => setPicked(i)}
              className={`flex h-full flex-1 cursor-pointer flex-col justify-end ${i === at ? "" : "opacity-60"}`}
            >
              <span className="flex flex-col overflow-hidden rounded-t-[3px]" style={{ height: `${Math.round(h * 100) / 100}%` }}>
                <span className="flex-1 bg-signal" />
                <span className="bg-fill-deep" style={{ height: `${Math.round(aShare * 100) / 100}%` }} />
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** Two options weighed against each other, with the verdict on top. */
export function Compare({
  verdict,
  detail,
  left,
  right,
}: {
  verdict: string;
  detail: string;
  left: { title: string; value: string; won: boolean; rows: { label: string; value: string }[] };
  right: { title: string; value: string; won: boolean; rows: { label: string; value: string }[] };
}) {
  useAnswer("The answer", verdict, "mint");
  const side = (s: typeof left) => (
    <div
      className={`rounded-2xl border p-4 md:p-5 ${
        s.won ? "border-green bg-mint" : "border-line bg-surface"
      }`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-serif text-lg font-bold text-ink md:text-xl">{s.title}</p>
        {s.won && <span className="kicker text-[10px] text-green">Better</span>}
      </div>
      <p className={`mt-1.5 font-serif text-[26px] font-bold leading-none md:text-[30px] ${s.won ? "text-deep" : "text-soft"}`}>
        {s.value}
      </p>
      <dl className="mt-4 space-y-2">
        {s.rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-3 text-[13px] md:text-sm">
            <dt className="text-muted">{r.label}</dt>
            <dd className="font-semibold text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <div>
      <div className="rounded-2xl border border-mint-line bg-mint p-5 md:p-7">
        <p className="kicker text-green">The answer</p>
        <p className="mt-2.5 font-serif text-[26px] font-bold leading-tight text-deep md:text-[34px]">{verdict}</p>
        <p className="mt-2.5 text-sm leading-relaxed text-soft md:text-[15px]">{detail}</p>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {side(left)}
        {side(right)}
      </div>
    </div>
  );
}

/** One step in how an answer is worked out. */
export type Step = { op?: "+" | "−" | "×" | "÷" | "=" | "→"; label: string; value: string };

const opWords: Record<NonNullable<Step["op"]>, string> = {
  "+": "plus",
  "−": "minus",
  "×": "times",
  "÷": "divided by",
  "=": "equals",
  "→": "then",
};

/**
 * The answer as arithmetic, drawn with the visitor's own numbers: each
 * step a card, the operator in a disc where two cards meet, the last card
 * the answer. A row of cards on a wide screen, a stack of lines on a phone.
 */
export function HowItWorks({ steps, note }: { steps: Step[]; note?: string }) {
  return (
    <section aria-label="How the answer is worked out" className="how rounded-2xl border border-line bg-surface p-5 md:p-7">
      <p className="kicker text-green">How it adds up</p>
      {/* Rows balanced on a wide screen: eight steps go four and four, not six and two. */}
      <ol
        className="mt-4 grid gap-2 md:mt-5 md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-x-4 md:gap-y-3"
        style={{ "--cols": steps.length <= 6 ? steps.length : Math.ceil(steps.length / 2) } as React.CSSProperties}
      >
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <li
              key={i}
              className={`relative flex items-center gap-3 rounded-xl border px-3.5 py-3 md:flex-col md:items-stretch md:px-5 md:py-4 ${
                last ? "border-mint-line bg-mint" : "border-line bg-cream"
              }`}
            >
              {s.op && (
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-fill-deep text-[15px] font-bold leading-none text-white md:absolute md:-left-[18px] md:top-1/2 md:-translate-y-1/2">
                  <span aria-hidden>{s.op}</span>
                  <span className="sr-only">{opWords[s.op]}</span>
                </span>
              )}
              <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3 md:flex-col md:items-start md:justify-between md:gap-1.5">
                <span className="text-[13px] leading-snug text-soft">{s.label}</span>
                <span
                  className={`flex-none font-serif text-[17px] font-bold md:text-xl ${last ? "text-deep" : "text-ink"}`}
                >
                  {s.value}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      {note && <p className="mt-3 text-[13px] leading-relaxed text-muted">{note}</p>}
    </section>
  );
}

/**
 * When the answer is a choice rather than a sum: the options side by side,
 * the one the rule picks marked. HRA, for one, is the smallest of three.
 */
export function Picks({
  rule,
  pick,
  options,
  note,
}: {
  rule: string;
  pick: "min" | "max";
  options: { label: string; value: number; detail?: string; disabled?: boolean }[];
  note?: string;
}) {
  const live = options.filter((o) => !o.disabled);
  const best = live.length
    ? live.reduce((b, o) => ((pick === "min" ? o.value < b.value : o.value > b.value) ? o : b))
    : null;
  return (
    <section aria-label="How the answer is worked out" className="how rounded-2xl border border-line bg-surface p-5 md:p-7">
      <p className="kicker text-green">How it is decided</p>
      <p className="mt-2 text-[15px] text-body">{rule}</p>
      <ul className="mt-4 grid gap-2 md:mt-5 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] md:gap-3">
        {options.map((o) => {
          const won = o === best;
          return (
            <li
              key={o.label}
              className={`rounded-xl border px-4 py-3.5 md:px-5 md:py-4 ${
                won ? "border-green bg-mint" : "border-line bg-cream"
              } ${o.disabled ? "opacity-60" : ""}`}
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-soft">{o.label}</span>
                {won && <span className="kicker text-[10px] text-green">{pick === "min" ? "Smallest" : "Ahead"}</span>}
              </span>
              <span className={`mt-1 block font-serif text-xl font-bold ${won ? "text-deep" : "text-ink"}`}>
                {o.disabled ? "Not allowed" : rupeesFull(o.value)}
              </span>
              {o.detail && <span className="mt-1 block text-[13px] leading-snug text-muted">{o.detail}</span>}
            </li>
          );
        })}
      </ul>
      {note && <p className="mt-3 text-[13px] leading-relaxed text-muted">{note}</p>}
    </section>
  );
}

export function Panel({
  inputs,
  result,
  how,
}: {
  inputs: React.ReactNode;
  result: React.ReactNode;
  /** The answer worked out step by step, under the inputs and the result. */
  how?: React.ReactNode;
}) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [resultInView, setResultInView] = useState(true);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = resultRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setResultInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showBar = answer !== null && !resultInView;

  return (
    <AnswerContext.Provider value={setAnswer}>
      {/* Inputs first, then the answer. On a wide screen the answer sits
          beside the inputs and follows you down. On a phone it is below
          them, and while it is off screen the bar at the bottom carries
          the headline number, so every change you make shows up where
          you are looking instead of a scroll away. */}
      <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10">
        <div className="flex flex-col gap-7">{inputs}</div>
        <div ref={resultRef} className="scroll-mt-24 md:sticky md:top-[104px]">
          {result}
        </div>
      </div>
      {how && <div className="mt-8 md:mt-12">{how}</div>}

      <button
        type="button"
        onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
        aria-hidden={!showBar}
        tabIndex={showBar ? 0 : -1}
        className={`sticky-answer fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-line bg-surface/95 px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 text-left shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur transition-transform md:hidden ${
          showBar ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
      >
        <span className="min-w-0">
          <span className={`kicker block truncate text-[10px] ${answer?.tone === "rose" ? "text-alert" : "text-green"}`}>
            {answer?.caption}
          </span>
          <span
            className={`mt-1 block truncate font-serif text-[22px] font-bold leading-tight ${
              answer?.tone === "rose" ? "text-alert" : "text-deep"
            }`}
          >
            {answer?.headline}
          </span>
        </span>
        <span className="flex-none text-[13px] font-semibold text-green">Full breakdown ↓</span>
      </button>
    </AnswerContext.Provider>
  );
}
