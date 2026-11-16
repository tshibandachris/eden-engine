const CACHE_PREFIX = "eden-engine-";
const CACHE_NAME = `${CACHE_PREFIX}shell-v2`;
const SHELL_FILES = ["./", "./index.html", "./manifest.json", "./icon.svg"];
const SHELL_URL = new URL("./index.html", self.registration.scope).toString();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const networkResponse = fetch(event.request);
  event.waitUntil(
    networkResponse.then((response) => {
      if (!response || !response.ok) return;
      return caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    }).catch(() => undefined)
  );

  event.respondWith(
    networkResponse.catch(async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      if (event.request.mode === "navigate") return cache.match(SHELL_URL);
      return Response.error();
    })
  );
});
