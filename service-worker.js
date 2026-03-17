const CACHE_NAME = 'premium-static-v1';
const BASE = new URL(self.registration.scope).pathname;

const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'start.html',
  BASE + 'building.html',
  BASE + 'manifest.json',
  BASE + 'pwa-register.js',
  BASE + 'styles/pwa.css',
  BASE + 'images/background.png',
  BASE + 'images/logo.png',
  BASE + 'icons/icon-72x72.png',
  BASE + 'icons/icon-96x96.png',
  BASE + 'icons/icon-128x128.png',
  BASE + 'icons/icon-144x144.png',
  BASE + 'icons/icon-152x152.png',
  BASE + 'icons/icon-184x184.png',
  BASE + 'icons/icon-192x192.png',
  BASE + 'icons/icon-192x192-maskable.png',
  BASE + 'icons/icon-384x384.png',
  BASE + 'icons/icon-512x512.png',
  BASE + 'icons/icon-512x512-maskable.png',
  BASE + 'news/allnews.html',
  BASE + 'news/newswork.html',
  BASE + 'news/news1.html',
  BASE + 'news/news2.html',
  BASE + 'news/news3.html',
  BASE + 'news/news4.html',
  BASE + 'news/news5.html',
  BASE + 'news/news6.html',
  BASE + 'news/news7.html',
  BASE + 'news/news8.html',
  BASE + 'news/news9.html',
  BASE + 'news/news10.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match(BASE + 'index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});
