/*
 * Makes the site work offline once a page has been opened, and lets it be
 * installed like an app.
 *
 * Pages: network first, so a new deploy shows up straight away; the saved
 * copy is used only when there is no connection. A calculator link with
 * numbers after "?" falls back to the saved page, which reads them itself.
 * Never-opened pages get the offline page.
 *
 * Built files under /_next/static carry a hash in their name, so they never
 * change and can come straight from the saved copy. Fonts and images: the
 * saved copy, refreshed in the background. PDFs and other sites: left alone.
 *
 * Bump VERSION to drop everything saved by an older version of this file.
 */
const VERSION = "v1";
const CACHE = `bwa-${VERSION}`;
const OFFLINE = "/offline.html";
const PRECACHE = ["/", "/tools/", "/guides/", OFFLINE];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("bwa-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const save = async (request, response) => {
  // Never a redirect: replayed for a page load, some browsers refuse it.
  if (response.ok && response.type === "basic" && !response.redirected) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

/** Network first, keyed without the query, so ?numbers maps to the page. */
async function page(request) {
  const key = new URL(request.url);
  key.search = "";
  try {
    return await save(key.href, await fetch(request));
  } catch {
    const cached = await caches.match(key.href);
    if (cached) return cached;
    if (request.mode === "navigate") return (await caches.match(OFFLINE)) ?? Response.error();
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached ?? save(request, await fetch(request));
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fresh = fetch(request)
    .then((r) => save(request, r))
    .catch(() => cached);
  return cached ?? fresh;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".pdf")) return;

  if (request.mode === "navigate" || url.pathname.endsWith(".txt") || url.searchParams.has("_rsc")) {
    event.respondWith(page(request));
  } else if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
  } else if (/\.(woff2|webp|png|jpg|svg|ico)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
