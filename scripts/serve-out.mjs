/**
 * Serves the static export in out/ the way GitHub Pages does: /tools/ is
 * /tools/index.html, anything missing gets 404.html with a 404 status.
 * Used by the Playwright tests. Python's http.server dropped connections
 * once the tests ran in parallel; this handles them all.
 *
 *   node scripts/serve-out.mjs 4173
 */
import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = "out";
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
};

/** The file a path maps to, or null. Never leaves out/. */
function resolve(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  for (const candidate of [clean, join(clean, "index.html"), `${clean}.html`]) {
    const file = join(ROOT, candidate);
    try {
      if (statSync(file).isFile()) return file;
    } catch {
      /* try the next one */
    }
  }
  return null;
}

createServer((req, res) => {
  const file = resolve(req.url ?? "/");
  const status = file ? 200 : 404;
  const body = file ?? join(ROOT, "404.html");
  res.writeHead(status, { "Content-Type": TYPES[extname(body)] ?? "application/octet-stream" });
  createReadStream(body).pipe(res);
}).listen(PORT, () => console.log(`serving ${ROOT}/ on http://localhost:${PORT}`));
