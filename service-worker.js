// Nom du cache
const CACHE_NAME = 'eden-engine-cache-v1';

// Liste des fichiers à mettre en cache
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/main.js',
  '/style.css',
  '/icon-192.png',
  '/icon-512.png'
];

// 💾 INSTALLATION : Mise en cache initiale
self.addEventListener('install', event => {
  console.log('📦 Installation du service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Fichiers ajoutés au cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ⚙️ ACTIVATION : Nettoyage des anciens caches
self.addEventListener('activate', event => {
  console.log('🚀 Activation du service worker');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🧹 Suppression ancien cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 🌐 FETCH : Interception des requêtes
self.addEventListener('fetch', event => {
  // Stratégie cache-first
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('📁 Fichier chargé depuis le cache:', event.request.url);
        return response;
      }

      console.log('🌍 Fichier récupéré sur le réseau:', event.request.url);
      return fetch(event.request).then(networkResponse => {
        // Enregistre la réponse en cache pour usage futur
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Page de secours si hors ligne
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
