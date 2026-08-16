const CACHE_NAME = "ovara-v6";

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

  /*
   * HTML pages:
   * Always request the newest version from GitHub Pages.
   */

  if (
    event.request.mode === "navigate" ||
    event.request.destination === "document"
  ) {

    event.respondWith(

      fetch(event.request)
        .then(response => {

          return response;

        })
        .catch(() => {

          return caches.match(event.request);

        })

    );

    return;

  }


  /*
   * Other files can use the cache.
   */

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        return cachedResponse || fetch(event.request);

      })

  );

});
