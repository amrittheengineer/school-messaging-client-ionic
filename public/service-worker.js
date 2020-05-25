// // https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Regular.ttf
const STATIC_CACHE_NAME = "stmarysapp36282";
const ASSETS = [
  "https://cdn.jsdelivr.net/npm/font-proxima-nova@1.0.1/fonts/ProximaNova-Regular.ttf",
];
// Install service worke
self.addEventListener("install", (event) => {
  //   console.log("Service worker have been installe.");
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      cache.addAll(ASSETS);
    })
  );
});

// Listening for fetch event
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return cacheRes || fetch(e.request);
    })
  );
});
