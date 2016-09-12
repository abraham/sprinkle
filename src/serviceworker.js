const VERSION = 2;

const CACHE_NAMES = {
  app: 'app',
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

console.log('[SW] Started', VERSION, this);

this.addEventListener('install', event => {
  console.log('[SW] Installed', event);
  let responsePromise = caches.open(CACHE_NAMES.app)
    .then(cache => { return cache.addAll(APP_FILES); })
    .then(() => self.skipWaiting());
});

this.addEventListener('activate', event => {
  console.log('[SW] Activated', event);
  event.waitUntil(self.clients.claim());
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

// function sendMessage(message) {
//   console.log('[SW] sendMessage', message);
//   // return new Promise(function(resolve, reject) {
//   //   var messageChannel = new MessageChannel();
//   //   messageChannel.port1.onmessage = function(event) {
//   //     if (event.data.error) {
//   //       reject(event.data.error);
//   //     } else {
//   //       resolve(event.data);
//   //     }
//   //   };
//   return self.clients.matchAll().then(function(clients) {
//     console.log('[SW] clients', clients);
//     return Promise.all(clients.map(function(client) {
//       return client.postMessage('The service worker has activated and taken control.');
//     }));
//   });
//   // setTimeout(function(){
//   //   console.log('[SW] setTimeout triggered');
//   //   clients.matchAll().then(function(clients) {
//   //     console.log('[SW] clients2', clients);
//   //     clients.forEach((client) => {
//   //       console.log('[SW] client2', client);
//   //     });
//   //     // for(i = 0 ; i < clients.length ; i++) {
//   //     //   if(clients[i] === 'index.html') {
//   //     //     clients.openWindow(clients[i]);
//   //     //     // or do something else involving the matching client
//   //     //   }
//   //     // }
//   //   });
//   // }, 2000);
//     // navigator.serviceWorker.controller.postMessage(message,
//     //   [messageChannel.port2]);
//   // });
// }
