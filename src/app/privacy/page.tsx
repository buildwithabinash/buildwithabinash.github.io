import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { goatcounterCode, ogImage, site, surveyEndpoint } from "@/lib/site";

const description =
  "What this site collects, which is very little: no accounts, no cookies, no ads. What stays on your device, what the survey sends, and how to reach me.";

export const metadata: Metadata = {
  title: "Privacy policy",
  description,
  alternates: { canonical: "/privacy/" },
  openGraph: { title: "Privacy policy", description, url: `${site.url}/privacy/`, images: [ogImage] },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      path="/privacy/"
      kicker="No accounts · No cookies · No ads"
      title="Privacy"
      titleEm="policy."
      intro="This site is built to need as little about you as possible. There are no accounts to make, no cookies, no ads and no tracking across other sites. Here is exactly what does happen."
      updated="16 October 2026"
      sections={[
        {
          heading: "The short version",
          body: (
            <ul>
              <li>Nothing you type into a calculator is sent to me or stored anywhere but your own browser.</li>
              <li>The site sets no cookies.</li>
              <li>The survey asks for no name, no email and no money details.</li>
              <li>You can ask me what I hold about you, and to delete it, at any time.</li>
            </ul>
          ),
        },
        {
          heading: "Calculators",
          body: (
            <>
              <p>
                Every calculation runs in your browser. The numbers you enter are not sent to any server, mine or
                anyone else&apos;s.
              </p>
              <p>
                So that a calculator can be shared, the numbers you change are kept in the page&apos;s address, after
                the &quot;?&quot;. That address stays in your browser&apos;s history like any other, and anyone you
                send the link to will see those numbers. Remove the part after &quot;?&quot; before sharing if you would
                rather not.
              </p>
              <p>
                The rent receipt tool never puts names, addresses or PAN numbers in the address. Those stay on the page
                until you close it.
              </p>
            </>
          ),
        },
        {
          heading: "What is saved on your device",
          body: (
            <p>
              One thing: if you pick light or dark mode with the switch in the header, that choice is saved in your
              browser&apos;s local storage so the site remembers it. It never leaves your device. Choosing the same
              setting as your device removes it again.
            </p>
          ),
        },
        {
          heading: "Visitor counts",
          body: goatcounterCode ? (
            <>
              <p>
                To know which guides and calculators are useful, the site counts page views with{" "}
                <a href="https://www.goatcounter.com/help/privacy" target="_blank" rel="noopener noreferrer">
                  GoatCounter
                </a>
                , an open-source service that sets no cookies and keeps no personal data. It receives the page you
                visited (never the numbers after &quot;?&quot;), the site you came from, and your browser and screen
                size, which it uses for totals only.
              </p>
              <p>
                If your browser sends a &quot;Do Not Track&quot; or Global Privacy Control signal, you are not counted
                at all.
              </p>
            </>
          ) : (
            <p>
              The site does not currently count visitors. If that changes, it will be with a cookie-free service, and
              this section will say which one and what it receives.
            </p>
          ),
        },
        {
          heading: "The survey",
          body: surveyEndpoint ? (
            <p>
              The <Link href="/survey/">survey</Link> sends your answers to{" "}
              <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                Formspree
              </a>
              , a form service, because this site has no server of its own. It asks for no name or email. Formspree
              receives your answers along with the technical details any website sees, such as your IP address. I use
              the answers only to decide what to write next.
            </p>
          ) : (
            <p>The survey is not collecting answers at the moment.</p>
          ),
        },
        {
          heading: "Hosting",
          body: (
            <p>
              The site is hosted on GitHub Pages. Like any web host, GitHub sees the IP address of each visitor and
              may keep it in its logs for security. See{" "}
              <a
                href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub&apos;s privacy statement
              </a>
              . Fonts and images are served from this site itself, not from Google or any other third party.
            </p>
          ),
        },
        {
          heading: "Links to other sites",
          body: (
            <p>
              Links to Instagram, YouTube, Facebook, government sites and others take you to services with their own
              privacy policies. Nothing about you is passed to them by this site.
            </p>
          ),
        },
        {
          heading: "Your rights",
          body: (
            <p>
              Under India&apos;s Digital Personal Data Protection Act, 2023 you can ask what personal data I hold about
              you, ask for it to be corrected or deleted, and raise a complaint. In practice that is only ever an email
              you have sent me. Write to <a href={`mailto:${site.email}`}>{site.email}</a> and I will reply within 30
              days.
            </p>
          ),
        },
        {
          heading: "Children",
          body: <p>The site is written for working adults and does not knowingly collect anything from children.</p>,
        },
        {
          heading: "Changes",
          body: (
            <p>
              If any of this changes, this page will be updated and the date at the top will change with it. Read the{" "}
              <Link href="/terms/">terms of use</Link> for how the guides and calculators may be used.
            </p>
          ),
        },
      ]}
    />
  );
}
