const CACHE_NAME = 'borneo-cache-v1';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg',
  '/style.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle tile caching (OpenStreetMap)
  if (url.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // Handle API Requests (Backend)
  if (url.pathname.startsWith('/attractions') || url.pathname.startsWith('/wildlife') || url.pathname.startsWith('/trails')) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(JSON.stringify({ data: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
    );
    return;
  }

  // Default Stale-while-revalidate for other assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        console.warn('Fetch failed, returning cache if available', err);
        return new Response('', { status: 408, statusText: 'Offline' });
      });

      event.waitUntil(fetchPromise);

      return cachedResponse || fetchPromise;
    })
  );
});
