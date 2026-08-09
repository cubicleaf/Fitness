/* Fit Logs service worker — added 2026-07-16.
   Strategy: network-first for the app shell, stale-while-revalidate for
   supporting assets.
   - Online refreshes receive newly deployed HTML immediately.
   - If the gym has no signal, the last known-good shell remains available.
   Workout data is untouched — it lives in IndexedDB, not this cache. */
var CACHE = 'fitlogs-v3';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(['./', './index.html']);
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;
  var pathname = new URL(e.request.url).pathname;
  /* The worker must be able to update itself. An older worker that serves a
     cached sw.js can otherwise trap the browser on the old cache strategy. */
  if (pathname === '/sw.js') {
    e.respondWith(fetch(e.request, { cache: 'no-store' }));
    return;
  }
  var isAppShell = e.request.mode === 'navigate' || pathname === '/' || pathname === '/index.html';
  if (isAppShell) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).then(function (res) {
        if (res && res.ok) {
          var shellCopy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, shellCopy); });
        }
        return res;
      }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (cached) {
      var fresh = fetch(e.request).then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () { return cached; });
      return cached || fresh;
    })
  );
});
