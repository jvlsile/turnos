// Service worker de TurnosPro
// - Página y manifest: primero red (así siempre se ve la última versión), caché si no hay conexión.
// - Las llamadas a Google Apps Script NO se cachean.
const CACHE_NAME = 'turnos-pwa-v12';
const PRECACHE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './assets/archivo-var.woff2', './assets/fa-solid-900.woff2'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // CDN y Google: directo a la red

  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
