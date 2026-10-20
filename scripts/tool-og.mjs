/**
 * Draws the 1200x630 social card for every calculator, into
 * public/tools/og/<slug>.jpg. Run it after adding or renaming a tool:
 *
 *   npm run og:tools
 *
 * Same look as the guide cards: midnight with the green glow, the serif
 * name with its italic half, and the handle at the bottom. On the right, in
 * place of a PDF cover, a result card drawn from the brand's own bars.
 *
 * The cards are rendered by a real browser (Playwright's Chromium) rather
 * than by next/og, because the site's Lora font ships only as woff2, which
 * next/og cannot read. The fonts are the site's own, inlined, so the card
 * matches the pages exactly. The images are committed, like the guide
 * cards; the tests fail if a tool has none.
 */
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { modules, tools } from "../src/lib/tools.ts";

const OUT = "public/tools/og";
mkdirSync(OUT, { recursive: true });

const font = (pkg, file) =>
  `url(data:font/woff2;base64,${readFileSync(join("node_modules", pkg, "files", file)).toString("base64")}) format("woff2")`;

const css = `
@font-face { font-family: Lora; font-weight: 400 700; font-style: normal; src: ${font("@fontsource-variable/lora", "lora-latin-wght-normal.woff2")}; }
@font-face { font-family: Lora; font-weight: 400 700; font-style: italic; src: ${font("@fontsource-variable/lora", "lora-latin-wght-italic.woff2")}; }
@font-face { font-family: Lora; font-weight: 400 700; font-style: normal; unicode-range: U+20B9; src: ${font("@fontsource-variable/lora", "lora-latin-ext-wght-normal.woff2")}; }
@font-face { font-family: Poppins; font-weight: 500; src: ${font("@fontsource/poppins", "poppins-latin-500-normal.woff2")}; }
@font-face { font-family: Poppins; font-weight: 600; src: ${font("@fontsource/poppins", "poppins-latin-600-normal.woff2")}; }
* { box-sizing: border-box; margin: 0; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Poppins, sans-serif; color: #f2f0e8;
  background:
    radial-gradient(60% 80% at 18% 10%, rgba(58,217,113,.20), transparent 62%),
    radial-gradient(50% 60% at 95% 100%, rgba(18,74,58,.55), transparent 70%),
    #0c1712; }
.left { position: absolute; left: 72px; top: 92px; width: 600px; }
.bar { width: 48px; height: 4px; border-radius: 2px; background: #3ad971; }
.kicker { margin-top: 30px; font-size: 19px; font-weight: 600; letter-spacing: .17em; white-space: nowrap; text-transform: uppercase; color: #3ad971; }
h1 { margin-top: 26px; font-family: Lora, serif; font-weight: 700; font-size: 66px; line-height: 1.08; }
h1 em { display: block; font-weight: 400; color: #3ad971; }
.short { margin-top: 24px; font-size: 25px; line-height: 1.4; color: #b9c6bd; }
.foot { position: absolute; left: 72px; bottom: 58px; width: 600px; border-top: 1px solid rgba(242,240,232,.16); padding-top: 26px;
  font-size: 23px; color: #c9d4cc; display: flex; justify-content: space-between; }
.foot span:last-child { color: #93a798; }
.card { position: absolute; right: 72px; top: 96px; width: 380px; height: 438px; border-radius: 22px; padding: 34px;
  background: #13241b; border: 1px solid rgba(58,217,113,.28); box-shadow: 0 30px 60px -20px rgba(0,0,0,.6); }
.card .k { font-size: 15px; font-weight: 600; letter-spacing: .22em; text-transform: uppercase; color: #3ad971; }
.card .n { margin-top: 14px; font-family: Lora, serif; font-weight: 700; font-size: 54px; color: #a6e8c2; }
.bars { position: absolute; left: 34px; right: 34px; bottom: 34px; height: 210px; display: flex; align-items: flex-end; gap: 6px; }
.bars span { flex: 1; border-radius: 4px 4px 0 0; display: flex; flex-direction: column; overflow: hidden; }
.bars i { display: block; background: #3ad971; }
.bars b { display: block; background: #176047; flex: 1; }
`;

/** A climbing set of bars, the same shape for every card. */
const bars = Array.from({ length: 14 }, (_, i) => {
  const h = 14 + Math.pow(i / 13, 1.8) * 86;
  const growth = Math.min(70, (i / 13) * 72);
  return `<span style="height:${h.toFixed(1)}%"><i style="height:${growth.toFixed(1)}%"></i><b></b></span>`;
}).join("");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const t of tools) {
  const mod = modules.find((m) => m.id === t.module);
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
      <div class="left">
        <div class="bar"></div>
        <p class="kicker">Free calculator · ${esc(mod.title)}</p>
        <h1>${esc(t.name)} <em>${esc(t.nameEm)}</em></h1>
        <p class="short">${esc(t.short)}</p>
      </div>
      <div class="foot"><span>@buildwithabinash</span><span>Free · no signup</span></div>
      <div class="card"><p class="k">Your numbers</p><p class="n">₹ · % · yrs</p><div class="bars">${bars}</div></div>
    </body></html>`,
    { waitUntil: "load" },
  );
  await page.evaluate(() => document.fonts.ready);
  // A long name or line must never run into the footer or off the card.
  const clash = await page.evaluate(() => {
    const left = document.querySelector(".left").getBoundingClientRect();
    const foot = document.querySelector(".foot").getBoundingClientRect();
    const kicker = document.querySelector(".kicker");
    return left.bottom > foot.top - 24 || kicker.scrollWidth > 600;
  });
  if (clash) throw new Error(`tool-og: the card for ${t.slug} does not fit; shorten its name or short line`);
  await page.screenshot({ path: join(OUT, `${t.slug}.jpg`), type: "jpeg", quality: 86 });
}

await browser.close();
console.log(`tool-og: drew ${tools.length} cards into ${OUT}`);
