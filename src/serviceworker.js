const MATCH_ALL_FILTER = {includeUncontrolled: true};
const VERSION = 4;

const CACHE_NAMES = {
  app: `app-v${VERSION}`,
  images: 'images',
  api: 'api'
};

const APP_FILES = [
  '/',
  '/js/app.js',
  '/js/material.min.js',
  '/css/material.blue-red.min.css',
  '/fonts/MaterialIcons-Regular.ttf',
  '/fonts/MaterialIcons-Regular.woff',
  '/fonts/MaterialIcons-Regular.woff2'
];

console.log('[SW] Started version', VERSION, this);

this.addEventListener('install', event => {
  console.log('[SW] Installed', event);
  let responsePromise = caches.open(CACHE_NAMES.app)
    .then(cache => { return cache.addAll(APP_FILES); })
    .then(() => {
      this.clients.matchAll(MATCH_ALL_FILTER).then(currentClients => {
        currentClients.forEach(client => client.postMessage('install-complete'));
      });
    })
    .then(() => this.skipWaiting());
});

this.addEventListener('activate', event => {
  console.log('[SW] Activated', event);
  event.waitUntil(this.clients.claim());
});

this.addEventListener('fetch', event => {
  // console.log('[SW] Fetch', event);
  let responsePromise = caches.match(event.request).then(response => {
    if (response) {
      return response;
    }

    let requestClone = event.request.clone();
    return fetch(event.request).then(response => {
      if(!response) {
        return response;
      }

      let responseClone = response.clone();
      if(event.request.url.startsWith('https://api.unsplash.com/')) {
        caches.open(CACHE_NAMES.api)
          .then(cache => cache.put(requestClone, responseClone));
      }

      if(event.request.url.startsWith('https://images.unsplash.com/')) {
        caches.open(CACHE_NAMES.images)
          .then(cache => cache.put(requestClone, responseClone));
      }

      return response;
    });
  });

  event.respondWith(responsePromise);
});
