/* Zanfiiliate service worker
   Ganti VERSION setiap kali kamu mengganti index.html di GitHub (opsional, tapi disarankan). */
const VERSION = 'zanfiiliate-v166-1';
const CORE = ['/', '/manifest.webmanifest', '/icon.svg', '/icon-192.png', '/icon-512.png'];
const CDN = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(req, timeoutMs) {
  return new Promise((resolve) => {
    let done = false;
    const fallback = () => caches.match(req).then((r) => r || caches.match('/')).then((r) => r || Response.error());
    const t = setTimeout(() => { if (!done) { done = true; fallback().then(resolve); } }, timeoutMs);
    fetch(req).then((res) => {
      clearTimeout(t);
      if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      if (!done) { done = true; resolve(res); }
    }).catch(() => {
      clearTimeout(t);
      if (!done) { done = true; fallback().then(resolve); }
    });
  });
}

function staleWhileRevalidate(req) {
  return caches.open(VERSION).then((c) =>
    c.match(req).then((hit) => {
      const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })
  );
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (url.pathname.startsWith('/api/')) return;          // jangan pernah cache API tim/sync
    if (req.mode === 'navigate') { e.respondWith(networkFirst(req, 4000)); return; }
    e.respondWith(staleWhileRevalidate(req));
    return;
  }
  if (CDN.includes(url.hostname)) e.respondWith(staleWhileRevalidate(req));
});
