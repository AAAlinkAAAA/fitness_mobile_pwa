// mobile_app/service-worker.js
const CACHE_NAME = 'fitness-pwa-v1';
const API_CACHE = 'api-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker и удаление старых кэшей
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME && cache !== API_CACHE) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Обработка запросов
self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // Для API-запросов
  if (requestUrl.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Кэшировать успешные ответы
          if (response.ok) {
            const clone = response.clone();
            caches.open(API_CACHE).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Вернуть кэшированный ответ, если офлайн
          return caches.match(event.request);
        })
    );
  } else {
    // Для статических ресурсов
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .catch(() => caches.match('/index.html')) // Fallback на index.html
    );
  }
});