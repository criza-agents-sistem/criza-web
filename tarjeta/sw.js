/* Service worker de las tarjetas CRIZA — scope /tarjeta/
   - La página (documento) va por red primero, con la copia cacheada como
     respaldo si no hay señal. Así un cambio en la tarjeta se ve al toque.
   - Los recursos (fuentes, íconos, foto, librería del QR) van por
     stale-while-revalidate: cargan al instante y se refrescan en segundo plano. */
var CACHE = "criza-tarjeta-v2";
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

  var isDoc = req.mode === "navigate" || req.destination === "document";

  if (isDoc) {
    e.respondWith((async function () {
      var cache = await caches.open(CACHE);
      try {
        var res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        var hit = await cache.match(req, { ignoreSearch: true });
        return hit || new Response("Sin conexión.", {
          status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" }
        });
      }
    })());
    return;
  }

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
