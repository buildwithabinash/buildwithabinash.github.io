import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { ogImage, site } from "@/lib/site";

const description =
  "The terms for using the free guides and calculators: education only, not advice, numbers that are estimates, and how the PDFs can be shared.";

export const metadata: Metadata = {
  title: "Terms of use",
  description,
  alternates: { canonical: "/terms/" },
  openGraph: { title: "Terms of use", description, url: `${site.url}/terms/`, images: [ogImage] },
};

export default function TermsPage() {
  return (
    <LegalPage
      path="/terms/"
      kicker="Plain words · Free to use"
      title="Terms"
      titleEm="of use."
      intro={`By using ${site.name} you agree to these terms. They are short, and mostly say what the site is and is not.`}
      updated="16 October 2026"
      sections={[
        {
          heading: "Education, not advice",
          body: (
            <>
              <p>
                Everything here is for learning. It is not investment, tax, legal or financial advice, and it does not
                recommend any specific product, fund, scheme or company.
              </p>
              <p>
                I am not a SEBI-registered investment adviser or research analyst, and not a chartered accountant.
                Before you act on anything, check the official source, and for decisions that matter to you, speak to
                a SEBI-registered adviser or a qualified tax professional.
              </p>
            </>
          ),
        },
        {
          heading: "The calculators give estimates",
          body: (
            <>
              <p>
                Each calculator works from the assumptions written on its page and from rules and rates as I last
                checked them, which are shown there too. Real returns vary, rates and laws change, and your own
                situation can differ in ways a calculator cannot know.
              </p>
              <p>
                I work to get the numbers right, but I cannot promise they are free of mistakes. Treat a result as a
                starting point to check, not a figure to rely on. If you find an error, please{" "}
                <a href={`mailto:${site.email}`}>tell me</a> and I will correct it.
              </p>
            </>
          ),
        },
        {
          heading: "Using and sharing the guides",
          body: (
            <>
              <p>
                The guides, PDFs, calculators, text and images are my work. You are welcome to download the PDFs, keep
                them, print them and share them with anyone, as long as you share them unchanged and free.
              </p>
              <p>
                Please do not sell them, put your own name or branding on them, or republish edited versions without
                asking me first.
              </p>
            </>
          ),
        },
        {
          heading: "Names and links",
          body: (
            <p>
              Government schemes, banks, funds and other products are named only to explain them. This site is not
              connected to, approved by or paid by any of them, or by any government body. Links to other sites are
              there for your convenience; I am not responsible for what they say or do.
            </p>
          ),
        },
        {
          heading: "Limits",
          body: (
            <p>
              The site is provided as it is, free of charge. As far as the law allows, I am not liable for any loss
              that comes from using it or relying on it, including decisions made from a guide or a calculator.
            </p>
          ),
        },
        {
          heading: "Your privacy",
          body: (
            <p>
              What the site collects, which is very little, is set out in the <Link href="/privacy/">privacy policy</Link>.
            </p>
          ),
        },
        {
          heading: "Changes and the law",
          body: (
            <p>
              These terms may be updated; the date at the top shows when they last changed. They are governed by the
              laws of India. Questions go to <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>
          ),
        },
      ]}
    />
  );
}
