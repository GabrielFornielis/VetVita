const CACHE_NAME = 'vetvita-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/script.js',
  './img/LogoVetVita(ComFundo).png',
  './img/gato.png',
  './img/cachorro.png',
  './img/mapa.png',
  './img/icon.png',
  './img/facebook.svg',
  './img/instagram.svg',
  './img/whatsapp.svg',
  './img/consulta-geral.png',
  './img/emergencia.png',
  './img/exame-sangue.png',
  './img/ultrassom.png',
  './img/vacina-v8.png',
  './img/vacina-raiva.png',
  './img/icons/IcoVetVita192x192.png',
  './img/icons/IcoVetVita512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
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
    caches.match(e.request).then(resp =>
      resp ||
      fetch(e.request).catch(() =>
        caches.match('./index.html')
      )
    )
  );
});
