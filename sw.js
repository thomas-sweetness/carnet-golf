// Hors ligne : l'appli est servie depuis le cache tout de suite et mise à jour en arrière-plan.
// Les tuiles satellite déjà vues sont gardées pour le parcours (cache séparé, plafonné).
var CACHE = "carnet-golf-v5";
var TILES = "carnet-golf-tiles";
var MAX_TILES = 1500;
var FILES = [
  "./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "barbaroux-geo.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE && k !== TILES; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function trimTiles(cache) {
  cache.keys().then(function (keys) {
    if (keys.length > MAX_TILES) {
      keys.slice(0, keys.length - MAX_TILES).forEach(function (k) { cache.delete(k); });
    }
  });
}

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = e.request.url;

  // Tuiles satellite : cache d'abord (ça ne change pas), réseau sinon
  if (url.indexOf("arcgisonline.com") !== -1) {
    e.respondWith(caches.open(TILES).then(function (cache) {
      return cache.match(e.request).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) { cache.put(e.request, res.clone()); trimTiles(cache); }
          return res;
        });
      });
    }));
    return;
  }

  // Recherches en ligne (cartes, lieux) : jamais en cache
  if (url.indexOf("overpass") !== -1 || url.indexOf("nominatim") !== -1) return;

  e.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok) cache.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
