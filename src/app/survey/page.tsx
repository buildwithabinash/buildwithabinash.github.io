import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbs, graph, siteId } from "@/lib/schema";
import { ogImage, site } from "@/lib/site";
import { SurveyForm } from "./SurveyForm";

const description =
  "Tell me which money topic to cover next, and what was confusing or missing in the free guides and calculators. Four questions, no signup.";

export const metadata: Metadata = {
  title: "What should I cover next?",
  description,
  alternates: { canonical: "/survey/" },
  openGraph: { title: "What should I cover next?", description, url: `${site.url}/survey/`, images: [ogImage] },
};

const pageSchema = {
  "@type": "WebPage",
  "@id": `${site.url}/survey/#page`,
  url: `${site.url}/survey/`,
  name: "What should I cover next?",
  description,
  inLanguage: "en-IN",
  isPartOf: { "@id": siteId },
};

export default function SurveyPage() {
  return (
    <>
      <JsonLd
        data={graph(
          pageSchema,
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Survey", path: "/survey/" },
          ]),
        )}
      />

      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-8 md:px-6 md:pb-12 md:pt-[72px]">
          <p className="kicker text-green">Four questions · No signup</p>
          <h1 className="mt-2.5 font-serif text-[34px] font-bold leading-[1.12] text-ink md:mt-3 md:text-[54px] md:leading-[1.1]">
            What should I <em className="font-normal text-green">cover next?</em>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">
            The guides come from what people actually ask. This is the quickest way to put your question in that
            pile, and to tell me where something on the site did not make sense.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-5 py-8 md:px-6 md:py-12">
          <SurveyForm />

          <p className="mt-6 text-[13px] leading-relaxed text-muted md:text-sm">
            Answers go to a form service, not to this site, which has no server of its own. Nothing here asks who you
            are, and please do not send account numbers, income details or anything else private: this is for
            deciding what to write, not for looking at your situation.
          </p>
        </div>
      </section>
    </>
  );
}
