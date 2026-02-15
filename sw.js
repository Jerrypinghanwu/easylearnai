const CACHE_NAME = 'ailearn-cache-v5';
const CORE_ASSETS = [
  'index.html',
  'styles.min.css',
  'script.min.js',
  'image/unnamed77.jpg',
  'image/unnamed%20(41).jpg',
  'image/AI%20QR%20code.png',
  'image/mapword_light.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (resp.ok && request.url.startsWith(self.location.origin)) {
            cache.put(request, copy);
          }
        });
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
