const CACHE_NAME = 'ailearn-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/image/unnamed%20(4).jpg',
  '/image/unnamed77.jpg',
  '/image/unnamed%20(41).jpg',
  '/image/AI%20QR%20code.png',
  '/image/mapword.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve()))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // 只緩存成功回應
          if (resp.ok && (request.url.startsWith(self.location.origin))) {
            cache.put(request, copy);
          }
        });
        return resp;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

