const CACHE_NAME = "ovara-v4";

const FILES_TO_CACHE = [
  "./",
  "./manifest.json",
  "./icon-192-2.png",
  "./icon-512-2.png"
];

self.addEventListener("install", event => {

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();

});


self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys => {

      return Promise.all(

        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))

      );

    })

  );

  self.clients.claim();

});


self.addEventListener("fetch", event => {

  // Always get HTML pages from the network first.
  // This prevents old OVARA pages from being stuck in cache.

  if (event.request.mode === "navigate") {

    event.respondWith(

      fetch(event.request)
        .then(response => response)
        .catch(() => caches.match(event.request))

    );

    return;

  }


  // Other files can use the cache.

  event.respondWith(

    caches.match(event.request).then(cachedResponse => {

      return cachedResponse || fetch(event.request);

    })

  );

});
