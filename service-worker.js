const CACHE_NAME = 'vetvita-v4';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/js/script.js'
  // Removi as imagens para testar primeiro
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto, adicionando recursos...');
        // Usando Promise.allSettled para não falhar se algum arquivo não existir
        return Promise.allSettled(
          ASSETS.map(asset => {
            return cache.add(asset).catch(err => {
              console.warn(`Não foi possível cachear: ${asset}`, err);
              return null;
            });
          })
        );
      })
      .then(() => {
        console.log('Todos os recursos processados');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Erro durante instalação:', err);
        return self.skipWaiting(); // Continua mesmo com erro
      })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('Deletando cache antigo:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => {
        // Retorna do cache se encontrou, senão faz fetch
        return response || fetch(e.request);
      })
      .catch(err => {
        console.warn('Erro no fetch:', err);
        return fetch(e.request); // Fallback para fetch normal
      })
  );
});