'use strict';

// Incrementing CACHE_VERSION will kick off the install event and force previously cached
// resources to be cached again.
var CACHE_VERSION = 'v3.5.4-0';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll([
        '/',
        'metadata.json',
        'index.html',
        'css/bundle.min.css',
        'js/vendor.min.js',
        'js/app.min.js',
        'js/templates.min.js',
        'img/stack.svg',
        'favicon.ico',
        'apple-touch-icon.png',
        'blobs/stack.zip',
        'blobs/mvnw.zip',
        'blobs/gradlew.zip',
        'blobs/stack-min.zip'
      ]);
    }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (CACHE_VERSION !== cacheName) {
            return caches.delete(cacheName);
          }
        }));
    }));
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        // always attempt to fetch first
        return fetch(event.request)
          .then(function (response) {
            if (response.ok) {
              return caches.open(CACHE_VERSION).then(function (cache) {
                cache.put(event.request, response.clone());
                return response;
              });
            }
            throw new Error('Failed to fetch resource.');
          })
          .catch(function (err) {
            throw err;
          });
      }
    }));
});
