const CACHE_NAME = 'osem-static-v1';
const BASE = new URL(self.registration.scope).pathname;

const CORE_ASSETS = [
  BASE,
  BASE + 'index_osem.html',
  BASE + 'manifest.json',
  BASE + 'pwa-register.js',
  BASE + 'styles/pwa.css',
  BASE + 'building.html',
  BASE + 'allprd.html',
  BASE + 'workaud-8.html',

  // Icons
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

  // Images
  BASE + 'images/logo.png',
  BASE + 'images/bgosem.png',
  BASE + 'images/aud.png',
  BASE + 'images/eye.png',
  BASE + 'images/idea.png',
  BASE + 'images/p1.png',
  BASE + 'images/p2.png',
  BASE + 'images/p3.png',
  BASE + 'images/physical.png',
  BASE + 'images/pin.png',
  BASE + 'images/vs.png',
  BASE + 'images/news1.png',
  BASE + 'images/news2.png',
  BASE + 'images/news3.png',
  BASE + 'images/news4.png',
  BASE + 'images/news5.png',
  BASE + 'images/news6.png',
  BASE + 'images/news7.png',
  BASE + 'images/news8.png',
  BASE + 'images/news9.png',
  BASE + 'images/news10.png',
  BASE + 'images/pitchosem.png',
  BASE + 'images/posterosem.png',
  BASE + 'images/promptosem.png',

  // News
  BASE + 'news/allnews.html',
  BASE + 'news/newswork.html',
  BASE + 'news/newswork4-1.html',
  BASE + 'news/newswork4-2.html',
  BASE + 'news/shortnews.html',
  BASE + 'news/news1.html',
  BASE + 'news/news2.html',
  BASE + 'news/news3.html',
  BASE + 'news/news4.html',
  BASE + 'news/news5.html',
  BASE + 'news/news6.html',
  BASE + 'news/news7.html',
  BASE + 'news/news8.html',
  BASE + 'news/news9.html',
  BASE + 'news/news10.html',

  // Newsletters
  BASE + 'newsletter4.html',
  BASE + 'newsletter5.html',
  BASE + 'newsletter6.html',
  BASE + 'newsletter7.html',
  BASE + 'newsletter8.html',
  BASE + 'newsletter9.html',
  BASE + 'newsletter10.html',
  BASE + 'newsletter11.html',

  // Mentoring
  BASE + 'mentoring/workmentoring.html',
  BASE + 'mentoring/mentoringosem.png',
  BASE + 'mentoring/mentorosem.png',
  BASE + 'mentoring/next.png',
  BASE + 'mentoring/opinion.png',
  BASE + 'mentoring/question.png',
  BASE + 'mentoring/what.png',

  // Creative idea
  BASE + 'creativeidea/creative.html',
  BASE + 'creativeidea/need.html',
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
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match(BASE + 'index_osem.html'))
        )
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
