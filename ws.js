// Instalación del Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open('clima-cache-v1').then(cache => {
            return cache.addAll([
                "./",
                "./index.html",
                './manifest.json',
                './app.js',
                
                './styles.css',

                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css',

                './img/logo.png',
                './img/fondo.jpg',
                './img/icono192.png',
                './img/icono512.png',
                './img/sc/sc_pc.png',
                './img/sc/sc_mb.png',

                "./ws.js"
            ]);
        })
    );
});


// Activación del Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['clima-cache-v1'];
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // Devuelve el archivo desde la caché
            }

            return fetch(event.request)
                .then((networkResponse) => {
                    return caches.open('clima-cache-v1').then((cache) => {
                        cache.put(event.request, networkResponse.clone()); // Almacena en caché
                        return networkResponse;
                    });
                })
                .catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html'); // Devuelve una página alternativa si falla
                    }
                });
        })
    );
});
