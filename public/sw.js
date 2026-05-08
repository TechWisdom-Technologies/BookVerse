const CACHE_NAME = "bookverse-cache-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/manifest.json",
  "/site.webmanifest",
  "/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  // Stale-while-revalidate strategy for navigation requests and assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // Don't cache non-200 responses or API/external requests
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic" ||
            event.request.url.includes("/api/")
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If network fails, return cached response if available
          if (cachedResponse) {
            return cachedResponse;
          }
          // Optional: Return a generic offline page here if we had one
        });

      return cachedResponse || fetchPromise;
    })
  );
});
