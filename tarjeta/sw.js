/* Service worker de las tarjetas CRIZA — scope /tarjeta/
   Objetivo: que una tarjeta ya visitada abra al instante y funcione sin señal
   (p. ej. en un Congreso con wifi malo). Estrategia: stale-while-revalidate. */
var CACHE = "criza-tarjeta-v1";
var EXTRA = ["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com"];

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && EXTRA.indexOf(url.hostname) === -1) return;
  if (url.searchParams.has("nc")) return; // dejar pasar los chequeos con cache-bust

  e.respondWith((async function () {
    var cache = await caches.open(CACHE);
    var cached = await cache.match(req);
    var network = fetch(req).then(function (res) {
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      return res;
    }).catch(function () { return null; });
    return cached || (await network) || new Response("", { status: 504, statusText: "sin conexión" });
  })());
});
