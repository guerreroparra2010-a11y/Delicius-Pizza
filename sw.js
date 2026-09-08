// Service Worker para Delicius Pizza (Capacidad PWA multiplataforma)
const CACHE_NAME = 'delicius-pizza-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './html/index.html',
  './html/menu.html',
  './html/pizzas.html',
  './html/bebidas.html',
  './html/nosotros.html',
  './html/resenas.html',
  './html/creadores.html',
  './pizza/index.html',
  './pizza/style.css',
  './pizza/script.js',
  './css/styles.css',
  './js/main.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Algunos recursos no pudieron precargarse:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Devuelve cache y actualiza en segundo plano (stale-while-revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // En caso de estar sin conexión
        return caches.match('./html/index.html');
      });
    })
  );
});
