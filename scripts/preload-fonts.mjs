/**
 * Adds <link rel="preload"> for the three font files used above the fold.
 *
 * Why this is a post-build step rather than a <link> in layout.tsx: the font
 * files come from the CSS that fontsource ships, so their URLs are hashed at
 * build time and are not knowable from React. Importing the .woff2 from JS to
 * get its URL needs a custom webpack rule, and that emits a *second* copy of
 * each file, so the browser downloads both. Reading the real URLs back out of
 * the built stylesheet avoids all of it.
 *
 * Measured on the home page (Lighthouse 12, mobile preset, gzip, 3 runs):
 *   without  FCP 1955ms  CLS 0.067
 *   with     FCP 1355ms  CLS 0
 * The CLS goes to zero because the fonts arrive before first paint, so the
 * swap from the fallback never reflows the hero.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";

// The faces that render above the fold: the serif headline, its italic half,
// and body text. Preloading more than this just contends for bandwidth.
const WANTED = ["lora-latin-wght-normal", "lora-latin-wght-italic", "poppins-latin-400-normal"];

function fail(msg) {
  console.error(`preload-fonts: ${msg}`);
  process.exit(1);
}

const cssDir = join(OUT, "_next", "static", "css");
let css = "";
try {
  for (const f of readdirSync(cssDir)) if (f.endsWith(".css")) css += readFileSync(join(cssDir, f), "utf8");
} catch {
  fail(`no stylesheets under ${cssDir} — run next build first`);
}

const urls = [];
for (const name of WANTED) {
  const m = css.match(new RegExp(`/_next/static/media/${name}[^)"']*\\.woff2`));
  // A fontsource upgrade could rename these. Better to break the build than to
  // silently stop preloading and quietly lose 600ms.
  if (!m) fail(`could not find ${name}.woff2 in the built CSS — has the font package changed?`);
  urls.push(m[0]);
}

const tags = urls
  .map((u) => `<link rel="preload" href="${u}" as="font" type="font/woff2" crossorigin="anonymous"/>`)
  .join("");

const pages = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".html")) pages.push(p);
  }
})(OUT);

let patched = 0;
for (const p of pages) {
  const html = readFileSync(p, "utf8");
  if (html.includes('rel="preload"') && html.includes(urls[0])) continue; // already done
  const i = html.indexOf("</head>");
  if (i === -1) continue;
  writeFileSync(p, html.slice(0, i) + tags + html.slice(i));
  patched++;
}

const kb = urls.reduce((a, u) => {
  try {
    return a + statSync(join(OUT, u)).size;
  } catch {
    return a;
  }
}, 0) / 1024;

console.log(`preload-fonts: added ${urls.length} preloads (${kb.toFixed(0)} KB) to ${patched} pages`);
