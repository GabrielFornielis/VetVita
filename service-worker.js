const CACHE_NAME = 'vetvita-v5';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
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
  '/img/icons/IcoVetVita192x192.png',  // SEM hífen
  '/img/icons/IcoVetVita512x512.png'   // SEM hífen
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto, adicionando recursos...');
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => {
        console.error('Erro durante instalação:', err);
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});