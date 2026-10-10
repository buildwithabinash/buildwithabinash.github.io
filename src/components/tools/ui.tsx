"use client";

import { useId } from "react";

const clamp = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;

/** A labelled number, typed in the box or dragged on the slider. */
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
}) {
  const id = useId();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <label htmlFor={id} className="text-sm font-medium text-soft md:text-[15px]">
          {label}
        </label>
        <span className="flex items-center gap-1 rounded-xl border border-line bg-white px-2.5 py-1.5">
          {prefix && <span className="text-sm text-muted">{prefix}</span>}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => set(clamp(Number(e.target.value), min, max))}
            className="w-[88px] bg-transparent text-right text-[15px] font-semibold text-ink outline-none"
          />
          {suffix && <span className="text-sm text-muted">{suffix}</span>}
        </span>
      </div>
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
  return (
    <div>
      <p className="text-sm font-medium text-soft md:text-[15px]">{label}</p>
      <div className="mt-2.5 flex gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => set(o.value)}
            className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
              value === o.value
                ? "border-green bg-green text-white"
                : "border-line bg-white text-soft hover:border-green"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
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
  /** Two parts of a whole, drawn as one bar. */
  split?: { aLabel: string; a: number; bLabel: string; b: number };
  tone?: "mint" | "rose";
}) {
  const total = split ? split.a + split.b : 0;
  const aPct = split && total > 0 ? (split.a / total) * 100 : 0;
  const shell =
    tone === "rose" ? "border-[#e8cccc] bg-rose" : "border-[#cfe3d8] bg-mint";
  const rule = tone === "rose" ? "border-[#e8cccc]" : "border-[#cfe3d8]";
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
          <div className="flex h-2.5 overflow-hidden rounded-full bg-white">
            <span className="bg-deep" style={{ width: `${aPct}%` }} />
            <span className="flex-1 bg-signal" />
          </div>
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-soft">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-deep" />
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
        <dl className={`mt-6 divide-y border-t ${rule} divide-current/10`}>
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
  const side = (s: typeof left) => (
    <div
      className={`rounded-2xl border p-4 md:p-5 ${
        s.won ? "border-green bg-mint" : "border-line bg-white"
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
      <div className="rounded-2xl border border-[#cfe3d8] bg-mint p-5 md:p-7">
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

export function Panel({ inputs, result }: { inputs: React.ReactNode; result: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10">
      {/* On a phone the answer goes first: some of these have seven fields,
          and scrolling past all of them to reach the number is no good.
          On a wide screen it sits beside them and follows you down. */}
      <div className="order-first md:order-last md:sticky md:top-[104px]">{result}</div>
      <div className="flex flex-col gap-7">{inputs}</div>
    </div>
  );
}
