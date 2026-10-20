"use client";

import { useEffect, useState } from "react";

/**
 * Print or save as PDF. The print stylesheet strips the page down to the
 * inputs, the answer and how it was worked out; this adds the date and a
 * link that reopens the same numbers, so the paper copy can be checked
 * later or handed to a CA.
 */
export function PrintButton() {
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    const update = () =>
      setStamp(
        `Worked out on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}. Open these numbers again: ${window.location.href}`,
      );
    update();
    window.addEventListener("beforeprint", update);
    return () => window.removeEventListener("beforeprint", update);
  }, []);

  return (
    <>
      <button type="button" onClick={() => window.print()} className="no-print btn btn-ghost mt-6 px-5 py-3 text-sm">
        Print or save as PDF
      </button>
      <p className="print-only mt-6 break-all text-xs text-soft">{stamp}</p>
    </>
  );
}
