import type { Metadata } from "next";
import { Suspense } from "react";
import { GuidesBrowser } from "./GuidesBrowser";

export const metadata: Metadata = {
  title: "Free guides",
  description:
    "Every free @buildwithabinash PDF guide in one place: SIP, EPF, government schemes, buying a bike or car, and more. Sourced, dated and in plain words.",
};

export default function GuidesPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 pt-8 md:px-6 md:pt-[72px]">
          <p className="kicker text-green">Free guides · No signup</p>
          <h1 className="mt-2.5 font-serif text-[34px] font-bold leading-[1.12] text-ink md:mt-3 md:text-[54px] md:leading-[1.1]">
            Every guide, <em className="font-normal text-green">in plain words.</em>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">
            These are the PDFs I send when you comment &quot;PDF&quot; on a video. Each one has the full numbers, the
            sources, and the date I last checked them.
          </p>
        </div>
        <Suspense>
          <GuidesBrowser />
        </Suspense>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-7 md:px-6 md:pb-24 md:pt-8">
          <div className="flex flex-col gap-4 rounded-3xl bg-mint px-5 py-6 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div>
              <h2 className="font-serif text-[22px] font-bold text-ink md:text-[28px]">Want a guide on something else?</h2>
              <p className="mt-2 text-[15px] leading-relaxed md:text-base">
                Tell me the money question in the comments of any video. The most asked ones become the next guide.
              </p>
            </div>
            <a
              href="https://www.instagram.com/buildwithabinash/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none rounded-full bg-deep px-6 py-3.5 text-center font-semibold text-white hover:bg-green"
            >
              Ask on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
