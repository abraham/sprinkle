console.log('Started', this);

const CACHE_NAMES = {
  app: 'app',
  images: 'images',
  api: 'api'
};
const APP_CACHE_NAME = 'app';

this.addEventListener('install', (event) => {
  console.log('Installed', event);
  let responsePromise = caches.open(CACHE_NAMES.app)
    .then(function(cache) {
      return cache.addAll([
        '/',
        '/js/app.js',
        '/js/material.min.js',
        '/css/material.blue-red.min.css',
        '/fonts/MaterialIcons-Regular.ttf',
        '/fonts/MaterialIcons-Regular.woff',
        '/fonts/MaterialIcons-Regular.woff2'
      ]);
    }).then(function() {
      console.log('trying to sendMessage');
      // return sendMessage('sendMessage.install');
    });
    event.waitUntil(responsePromise);
    this.skipWaiting();
});

this.addEventListener('activate', (event) => {
  let responsePromise = new Promise((resolve, reject) => {
    return resolve(this.clients.claim());
  }).then(() => {
    // return sendMessage('sendMessage.activate');
  }).then(() => {
    // return setTimeout(() => { sendMessage('sendMessage.activate') }, 1000);
  }).then(() => {
    console.log('Activated', event);
  });

  event.waitUntil(responsePromise);
});

this.addEventListener('fetch', (event) => {
  let responsePromise = caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      }
      let requestClone = event.request.clone();

      return fetch(event.request)
        .then(function(response) {
          let responseClone = response.clone();

          if(!response) {
            return response;
          }

          if(event.request.url.startsWith('https://api.unsplash.com/')) {
            caches.open(CACHE_NAMES.api)
              .then(function(cache) {
                cache.put(requestClone, responseClone);
              });
          }

          if(event.request.url.startsWith('https://images.unsplash.com/')) {
            caches.open(CACHE_NAMES.images)
              .then(function(cache) {
                cache.put(requestClone, responseClone);
              });
          }

          return response;
        });
    });

  event.respondWith(responsePromise);
});

// function sendMessage(message) {
//   console.log('sendMessage', message);
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
//     console.log('clients', clients);
//     return Promise.all(clients.map(function(client) {
//       return client.postMessage('The service worker has activated and taken control.');
//     }));
//   });
//   // setTimeout(function(){
//   //   console.log('setTimeout triggered');
//   //   clients.matchAll().then(function(clients) {
//   //     console.log('clients2', clients);
//   //     clients.forEach((client) => {
//   //       console.log('client2', client);
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
