const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);



//Create Cashe
const pageCache = 
  new CacheFirst({
    cacheName: 'page-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  });

//Passes the URLs though to the cache of page cache because they are API requests and they dont exist as files
warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});


//If the values passed into 'page-cache' are system files then request.mode = HTML navigation meaning 
//that if i placed the bundle.js file inside the warmStrategyCache it wouldn't pass to the cache
const pageCasheParams = registerRoute(({ request }) => request.mode === 'navigate', pageCache);
console.log(pageCasheParams);


//Files to be cashes
const assetCasheParams = function ({ request }) {
  return (
    // CSS
    request.destination === 'style' ||
    // JavaScript
    request.destination === 'script' ||

    request.destination === 'worker'
  );
}
registerRoute(
  assetCasheParams,
  new StaleWhileRevalidate({
    cacheName: 'asset-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      })
    ],
  }));