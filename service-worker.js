const CACHE_NAME = 'premium-static-v6';
const BASE = new URL(self.registration.scope).pathname;

const CORE_ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'index_osem.html',
  BASE + 'index_start.html',
  BASE + 'start.html',
  BASE + 'manifest.json',
  BASE + 'pwa-register.js',
  BASE + 'styles/pwa.css',

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

  // Root images
  BASE + 'images/logo.png',
  BASE + 'images/bg.png',
  BASE + 'images/bgosem.png',
  BASE + 'images/marvell-bg.png',
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

  // Root news
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

  // Root newsletters
  BASE + 'newsletter4.html',
  BASE + 'newsletter5.html',
  BASE + 'newsletter6.html',
  BASE + 'newsletter7.html',
  BASE + 'newsletter8.html',
  BASE + 'newsletter9.html',

  // Root mentoring
  BASE + 'mentoring/workmentoring.html',

  // Root creativeidea
  BASE + 'creativeidea/creative.html',
  BASE + 'creativeidea/need.html',

  // Root workaud
  BASE + 'workaud-8.html',

  // --- Marvell web ---
  BASE + 'marvell_web/index-marvell.html',
  BASE + 'marvell_web/marvell-theme.css',
  BASE + 'marvell_web/allprd.html',
  BASE + 'marvell_web/workaud-8.html',

  // Marvell newsletters
  BASE + 'marvell_web/newsletter4.html',
  BASE + 'marvell_web/newsletter5.html',
  BASE + 'marvell_web/newsletter6.html',
  BASE + 'marvell_web/newsletter7.html',
  BASE + 'marvell_web/newsletter8.html',
  BASE + 'marvell_web/newsletter9.html',

  // Marvell creativeidea
  BASE + 'marvell_web/creativeidea/creative.html',
  BASE + 'marvell_web/creativeidea/enter.html',
  BASE + 'marvell_web/creativeidea/need.html',

  // Marvell news
  BASE + 'marvell_web/news/allnews.html',
  BASE + 'marvell_web/news/activity.html',
  BASE + 'marvell_web/news/shortnews.html',
  BASE + 'marvell_web/news/newswork4-1.html',
  BASE + 'marvell_web/news/newswork4-2.html',
  BASE + 'marvell_web/news/news1.html',
  BASE + 'marvell_web/news/news2.html',
  BASE + 'marvell_web/news/news3.html',
  BASE + 'marvell_web/news/news4.html',
  BASE + 'marvell_web/news/news5.html',
  BASE + 'marvell_web/news/news6.html',
  BASE + 'marvell_web/news/news7.html',
  BASE + 'marvell_web/news/news8.html',
  BASE + 'marvell_web/news/news9.html',
  BASE + 'marvell_web/news/news10.html',
  BASE + 'marvell_web/news/news11.html',
  BASE + 'marvell_web/news/news12.html',

  // Marvell mentoring
  BASE + 'marvell_web/mentoring/workmentoring.html',

  // Marvell prd-6
  BASE + 'marvell_web/prd-6/work-6.html',

  // Marvell images
  BASE + 'marvell_web/images/logo.png',
  BASE + 'marvell_web/images/aud.png',
  BASE + 'marvell_web/images/eye.png',
  BASE + 'marvell_web/images/idea.png',
  BASE + 'marvell_web/images/ideaprd.png',
  BASE + 'marvell_web/images/p1.png',
  BASE + 'marvell_web/images/p2.png',
  BASE + 'marvell_web/images/p3.png',
  BASE + 'marvell_web/images/physical.png',
  BASE + 'marvell_web/images/digitali.png',
  BASE + 'marvell_web/images/app.png',
  BASE + 'marvell_web/images/pin.png',
  BASE + 'marvell_web/images/etgar.png',
  BASE + 'marvell_web/images/flow.png',
  BASE + 'marvell_web/images/friction.png',
  BASE + 'marvell_web/images/tree.png',
  BASE + 'marvell_web/images/1.png',
  BASE + 'marvell_web/images/2.png',
  BASE + 'marvell_web/images/3.png',
  BASE + 'marvell_web/images/4.png',
  BASE + 'marvell_web/images/5.png',
  BASE + 'marvell_web/images/6.png',
  BASE + 'marvell_web/images/7.png',
  BASE + 'marvell_web/images/8.png',
  BASE + 'marvell_web/images/9.png',
  BASE + 'marvell_web/images/10.png',
  BASE + 'marvell_web/images/11.png',
  BASE + 'marvell_web/images/12.png',
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
