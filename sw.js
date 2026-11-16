/* Service worker de Carnet de muscu : l'appli fonctionne sans connexion.
   - Tous les fichiers sont mis en cache à l'installation.
   - Pages, scripts et styles : réseau d'abord (les mises à jour arrivent dès qu'on est en ligne),
     cache en secours (hors ligne ou réseau lent).
   - Polices et icônes : cache d'abord.
   Pour publier une nouvelle version, change VERSION : l'ancien cache est supprimé à l'activation. */
var VERSION = 'v3';
var CACHE = 'carnet-muscu-' + VERSION;
var ASSETS = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'illus.js',
  'body.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'fonts/Inter-Regular.latin.woff',
  'fonts/Inter-Medium.latin.woff',
  'fonts/Inter-SemiBold.latin.woff',
  'fonts/Inter-Bold.latin.woff',
  'fonts/SpaceGrotesk-VF.woff2'
];
var NETWORK_TIMEOUT = 4000;

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('carnet-muscu-') === 0 && k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

function fromNetwork(req) {
  return new Promise(function (resolve, reject) {
    var timer = setTimeout(function () { reject(new Error('timeout')); }, NETWORK_TIMEOUT);
    fetch(req).then(function (res) {
      clearTimeout(timer);
      if (res && res.ok) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
      }
      resolve(res);
    }, function (err) { clearTimeout(timer); reject(err); });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  var immutable = /\/(fonts|icons)\//.test(url.pathname);
  if (immutable) {
    e.respondWith(caches.match(req).then(function (hit) { return hit || fromNetwork(req); }));
    return;
  }
  e.respondWith(
    fromNetwork(req).catch(function () {
      return caches.match(req, { ignoreSearch: true }).then(function (hit) {
        if (hit) return hit;
        if (req.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      });
    })
  );
});
