"use client";

import { useId, useState } from "react";
import { topics } from "@/lib/guides";
import { surveyEndpoint } from "@/lib/site";

type State = "idle" | "sending" | "sent" | "error";

const LEGEND = "font-serif text-lg font-bold text-ink md:text-xl";

/**
 * The survey. It is a real <form> with an action, so it still submits if
 * JavaScript never runs; the handler below only upgrades that to an in-page
 * thank you. Nothing here asks for a name, an email or any money detail, so
 * there is nothing to protect if a response goes astray.
 */
export function SurveyForm() {
  const [state, setState] = useState<State>("idle");
  const [picked, setPicked] = useState<string[]>([]);
  const topicsId = useId();
  const usedId = useId();

  const toggle = (t: string) =>
    setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!surveyEndpoint) return;
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch(surveyEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-2xl border border-line bg-mint px-5 py-7 md:px-8 md:py-9">
        <p className="kicker text-green">Thank you</p>
        <p className="mt-2 font-serif text-xl font-bold text-ink md:text-2xl">That is genuinely useful.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-soft md:text-base">
          The most asked questions become the next guide. Nothing you sent identifies you.
        </p>
      </div>
    );
  }

  const disabled = !surveyEndpoint || state === "sending";

  return (
    <form
      action={surveyEndpoint ?? undefined}
      method="post"
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-white p-5 md:p-8"
    >
      {!surveyEndpoint && (
        <p className="mb-6 rounded-xl bg-rose px-4 py-3 text-[13px] leading-relaxed text-alert md:text-sm">
          The survey is not collecting answers yet. It goes live once the form endpoint is set.
        </p>
      )}

      {/* Bots fill every field they find; people never see this one. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <fieldset disabled={disabled}>
        <legend className={LEGEND}>
          Which should I cover next?
        </legend>
        <p className="mt-1.5 text-sm text-muted">Pick as many as you like.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {topics.map((t) => {
            const id = `${topicsId}-${t}`;
            const on = picked.includes(t);
            return (
              <span key={t}>
                <input
                  type="checkbox"
                  id={id}
                  name="topics"
                  value={t}
                  checked={on}
                  onChange={() => toggle(t)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={`inline-block cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green ${
                    on ? "border-green bg-green text-paper" : "border-line bg-cream text-soft hover:border-green"
                  }`}
                >
                  {t}
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="mt-8">
        <legend className={LEGEND}>
          A money question nothing here answers?
        </legend>
        <p className="mt-1.5 text-sm text-muted">The most asked ones become the next guide.</p>
        <textarea
          name="question"
          rows={3}
          maxLength={600}
          placeholder="For example: how much term cover do I actually need?"
          className="mt-3 w-full rounded-xl border border-line bg-cream px-4 py-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted focus:border-green"
        />
      </fieldset>

      <fieldset disabled={disabled} className="mt-8">
        <legend className={LEGEND}>
          Have you used the guides or calculators?
        </legend>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {["The guides", "The calculators", "Both", "Not yet"].map((opt) => {
            const id = `${usedId}-${opt}`;
            return (
              <span key={opt}>
                <input type="radio" id={id} name="used" value={opt} className="peer sr-only" />
                <label
                  htmlFor={id}
                  className="inline-block cursor-pointer rounded-full border border-line bg-cream px-4 py-2 text-sm text-soft transition-colors hover:border-green peer-checked:border-green peer-checked:bg-green peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-green"
                >
                  {opt}
                </label>
              </span>
            );
          })}
        </div>
      </fieldset>

      <fieldset disabled={disabled} className="mt-8">
        <legend className={LEGEND}>
          Was anything confusing or missing?
        </legend>
        <p className="mt-1.5 text-sm text-muted">
          Where a guide lost you, or a calculator did not have the input you needed.
        </p>
        <textarea
          name="feedback"
          rows={3}
          maxLength={600}
          placeholder="Optional, but the most useful box on this page."
          className="mt-3 w-full rounded-xl border border-line bg-cream px-4 py-3 text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted focus:border-green"
        />
      </fieldset>

      {state === "error" && (
        <p className="mt-6 rounded-xl bg-rose px-4 py-3 text-[13px] leading-relaxed text-alert md:text-sm">
          That did not send. Please try again, or write to me instead.
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary px-6 py-3.5" aria-disabled={disabled} disabled={disabled}>
          {state === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="text-[13px] text-muted md:text-sm">No name, no email, nothing that identifies you.</p>
      </div>
    </form>
  );
}
