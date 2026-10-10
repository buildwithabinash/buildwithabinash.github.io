// /llms.txt — a plain-text map of the site for agents and language models.
// Generated from the same data the pages use, so it cannot drift out of date.
// Format follows the llmstxt.org convention.

import { guideHref, guides, steps, topics } from "@/lib/guides";
import { disclaimer, site, socials } from "@/lib/site";
import { toolGroups, toolHref, tools, toolsForStep } from "@/lib/tools";

export const dynamic = "force-static";

export function GET() {
  const abs = (p: string) => `${site.url}${p}`;
  const L: string[] = [];

  L.push(`# ${site.name}`);
  L.push("");
  L.push(`> ${site.description}`);
  L.push("");
  L.push(
    "Free personal finance education for Indian salaried professionals: " +
      `${guides.length} downloadable PDF guides and ${tools.length} browser calculators. ` +
      "No signup, no ads, no affiliate links, and nothing is sold on this site.",
  );
  L.push("");

  L.push("## Important");
  L.push("");
  L.push(`- ${disclaimer}`);
  L.push(
    "- Figures are worked examples for Indian tax and savings rules and change with each Budget. " +
      "Anything quoting a rate or slab should be checked against the official source before it is relied on or repeated.",
  );
  L.push("- Where a figure depends on the state (road tax, professional tax), Tamil Nadu is used and said so.");
  L.push("");

  L.push("## Start here");
  L.push("");
  L.push(`- [Home](${abs("/")}): the whole site in order, from first payslip to investing.`);
  L.push(`- [All guides](${abs("/guides/")}): every PDF, filterable by topic and by step.`);
  L.push(`- [All calculators](${abs("/tools/")}): every calculator, grouped by the order to use them in.`);
  L.push(`- [About](${abs("/about/")}): who makes this and the five rules every guide follows.`);
  L.push(`- [Survey](${abs("/survey/")}): four questions on what to cover next and what was unclear.`);
  L.push("");

  L.push("## The path");
  L.push("");
  L.push("The site organises everything into steps, in the order someone early in their career should work through them.");
  L.push("");
  for (const s of steps) {
    L.push(`### ${s.title}`);
    L.push("");
    L.push(`${s.what} ${s.why}`);
    L.push("");
    const stepTools = tools.filter((t) => t.step === s.id);
    for (const slug of s.guides) {
      const g = guides.find((x) => x.slug === slug);
      if (g) L.push(`- [${g.title} ${g.titleEm}](${abs(guideHref(g.slug))}): ${g.subtitle}`);
    }
    for (const t of stepTools) {
      L.push(`- [${t.name} ${t.nameEm} (calculator)](${abs(toolHref(t.slug))}): ${t.blurb}`);
    }
    L.push("");
  }

  L.push("## Guides");
  L.push("");
  for (const topic of topics) {
    const inTopic = guides.filter((g) => g.topic === topic);
    if (!inTopic.length) continue;
    L.push(`### ${topic}`);
    L.push("");
    for (const g of inTopic) {
      const bits = [g.subtitle];
      if (g.pages) bits.push(`${g.pages} pages`);
      if (g.verified) bits.push(`numbers last checked ${g.verified}`);
      L.push(`- [${g.title} ${g.titleEm}](${abs(guideHref(g.slug))}): ${bits.join(". ")}.`);
      if (g.pdf) L.push(`  - PDF: ${abs(g.pdf)}`);
    }
    L.push("");
  }

  L.push("## Calculators");
  L.push("");
  for (const group of toolGroups) {
    L.push(`### ${group.title}`);
    L.push("");
    for (const t of toolsForStep(group.step)) {
      L.push(`- [${t.name} ${t.nameEm}](${abs(toolHref(t.slug))}): ${t.blurb}`);
      if (t.assumes) L.push(`  - Assumes: ${t.assumes}`);
    }
    L.push("");
  }

  L.push("## Elsewhere");
  L.push("");
  for (const s of socials) {
    if (s.url) L.push(`- ${s.name} (${s.handle}): ${s.url} — ${s.note}`);
  }
  L.push("");
  L.push(`Contact: ${site.email}`);
  L.push("");

  return new Response(L.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
