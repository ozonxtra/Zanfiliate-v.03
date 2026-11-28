// Service worker Zanfiiliate: aplikasi bisa dibuka tanpa internet.
// Halaman utama selalu diambil dari jaringan lebih dulu, jadi update index.html langsung terlihat.
// Naikkan VERSION hanya bila kamu mengganti ikon atau manifest.
const VERSION = 'zf-v170-1';
const EXTRA = 'zf-extra-v1';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/apple-touch-icon.png',
];
// Font Google dan pustaka mp4-muxer (dimuat saat ekspor video) disimpan agar tetap jalan offline.
const EXTRA_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== EXTRA).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return hit || (await fresh) || Response.error();
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (EXTRA_HOSTS.includes(url.hostname)) {
    e.respondWith(staleWhileRevalidate(req, EXTRA));
    return;
  }

  // Server tim/sinkron (/api/) dan domain lain: langsung ke jaringan, tidak pernah di-cache.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('/index.html', copy)); }
          return res;
        })
        .catch(() => caches.match('/index.html').then(r => r || caches.match('/')))
    );
    return;
  }

  e.respondWith(staleWhileRevalidate(req, VERSION));
});
