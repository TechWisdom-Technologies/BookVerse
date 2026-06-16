const CACHE_NAME = "bookverse-cache-v6";
const OFFLINE_PAGE = "/offline.html";

const ASSETS_TO_CACHE = [
  "/offline.html",
  "/manifest.json",
  "/site.webmanifest",
  "/bookverse.png",
  "/apple-touch-icon.png"
];

// Install: pre-cache the offline fallback page and core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
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

// Fetch: network-first with offline fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) return;

  // Skip HMR/webpack dev-only requests (hot reload, etc.)
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  // For navigation requests (full page loads), use offline fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Network failed — go straight to offline page.
        // Don't serve cached HTML because dynamic server-rendered pages
        // contain stale data and cause a confusing flash before
        // Next.js hydration fails and shows the error boundary.
        return caches.match(OFFLINE_PAGE);
      })
    );
    return;
  }

  // For /_next/static/ assets (JS bundles, CSS) — cache-first since they're content-hashed
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === "basic"
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // For /_next/ RSC/data requests (client-side navigation payloads) — network only,
  // but return a proper error response when offline so Next.js error boundary triggers
  // instead of hanging forever on the skeleton loader
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return a 503 response so Next.js knows the request failed
        // and can trigger the error boundary instead of hanging
        return new Response(
          JSON.stringify({ error: "offline", message: "You are currently offline" }),
          {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "application/json" }
          }
        );
      })
    );
    return;
  }

  // For API calls — return proper error response when offline
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(
          JSON.stringify({ error: "offline", message: "You are currently offline" }),
          {
            status: 503,
            statusText: "Service Unavailable",
            headers: { "Content-Type": "application/json" }
          }
        );
      })
    );
    return;
  }

  // For other same-origin requests (images, fonts, etc.) — network-first with cache fallback
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});


