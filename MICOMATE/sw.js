const CACHE_NAME = "micomate-v1";

const FILES = [
"./",
"./index.html",
"./manifest.json"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(FILES);
})
);

self.skipWaiting();
});

self.addEventListener("activate", event => {
event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request);
})
);
});

self.addEventListener("notificationclick", event => {

event.notification.close();

event.waitUntil(
clients.matchAll({
type: "window",
includeUncontrolled: true
}).then(clientList => {

  for (const client of clientList) {

    if ("focus" in client) {
      return client.focus();
    }

  }

  if (clients.openWindow) {
    return clients.openWindow("./");
  }

})


);

});
