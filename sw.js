const C = 'loupe-v1';
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(C).then((c) => c.addAll(['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'])).catch(() => {}));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(C).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req).then((m) => m || caches.match('index.html')))
  );
});
