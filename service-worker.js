// === Eden Engine - Service Worker ===
// Auteur : Christian Tshibanda (Chris)
// Version : 1.0.0

const CACHE_NAME = "eden-engine-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png"
];

// === Installation du service worker ===
self.addEventListener("install", (event) => {
  console.log("⚙️ Installation du Service Worker Eden Engine...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Mise en cache initiale des fichiers...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// === Activation et nettoyage des anciens caches ===
self.addEventListener("activate", (event) => {
  console.log("♻️ Activation du Service Worker...");
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("🗑️ Suppression de l'ancien cache :", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// === Interception des requêtes réseau ===
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log("📁 Fichier récupéré depuis le cache :", event.request.url);
        return response;
      }
      console.log("🌐 Récupération en ligne :", event.request.url);
      return fetch(event.request)
        .then((response) => {
          // Met en cache la nouvelle ressource pour une utilisation future
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() =>
          caches.match("/index.html") // fallback
        );
    })
  );
});
