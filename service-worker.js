const CACHE_NAME = 'vetvita-v2';
const ASSETS = [
  '/',
  '/manifest.json',
  '/service-worker.js',
  '/css/style.css',
  '/js/script.js',
  '/img/LogoZoone.png',
  '/img/LogoVetVita(ComFundo).png',
  '/img/Dowload.png',
  '/img/WebVetVita.png',
  '/img/MobileVetVita.png',
  '/img/Banner.jpg',
  '/img/icon.png',
  '/img/facebook.svg',
  '/img/instagram.svg',
  '/img/whatsapp.svg',
  '/img/icons/IcoVetVita-192x192.png',
  '/img/icons/IcoVetVita-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});