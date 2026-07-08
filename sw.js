// sw.js — Service Worker LinuxDojo v13
const CACHE = "linuxdojo-v13";
const ASSETS = [
  "./","./index.html","./style.css",
  "./levels.js","./terminal.js","./fx.js","./gameshell.js",
  "./challenges.js","./bandit.js","./boss.js","./kata.js","./certificate.js","./quizzes.js","./glossary.js","./daily.js","./profile.js","./game.js","./objectives.js",
  "./manifest.json",
  "./icons/icon-192.png?v=8","./icons/icon-512.png?v=8"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // Pas de skipWaiting() automatique : on attend le feu vert de l'onglet
  // (voir sw-register.js) pour ne pas recharger la page en pleine mission.
});
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => { e.respondWith(caches.match(e.request).then(c => c || fetch(e.request))); });
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
