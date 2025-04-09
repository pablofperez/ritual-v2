const CACHE_NAME = 'ritual-cache-v1';
const urlsToCache = ['/', '/index.html', '/style.css', '/script.js', '/manifest.json'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })))); });
self.addEventListener('fetch', event => { event.respondWith(caches.match(event.request).then(response => response || fetch(event.request).then(res => caches.open(CACHE_NAME).then(cache => { cache.put(event.request, res.clone()); return res; })))); });