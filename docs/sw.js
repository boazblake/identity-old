/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app.css",
    "revision": "1451b187bd9f0c7c7aec80842ad6b7b2"
  },
  {
    "url": "app.css.map",
    "revision": "c1f66164d5869c2ad01faf2bbda54c7b"
  },
  {
    "url": "app.js",
    "revision": "6a2eb40544dd45f26f0112204b45b5f7"
  },
  {
    "url": "app.js.map",
    "revision": "91bd20ea93c3b092ec35d8769bf927a5"
  },
  {
    "url": "files/resume.pdf",
    "revision": "c3345f635cb008b52bfe703bff9bb2cd"
  },
  {
    "url": "images/applications.svg",
    "revision": "69384e27abedb1da7d7d79db212cc023"
  },
  {
    "url": "images/cv.jpeg",
    "revision": "67be94fa51a1550ce67eae4d2e1a6c71"
  },
  {
    "url": "images/cv.webp",
    "revision": "33cd4823ed31b3155a946fbccf975d86"
  },
  {
    "url": "images/github.svg",
    "revision": "6c4d6125acf853eb74d25f42f70a80a1"
  },
  {
    "url": "images/linkedin.svg",
    "revision": "c1eb27404bbc0d6052620ac79194ae19"
  },
  {
    "url": "images/me.jpg",
    "revision": "ac34d87e2757120960ab4f9a7acba2c6"
  },
  {
    "url": "images/me.webp",
    "revision": "19bb767d6ec7647121bb51d8efdeea29"
  },
  {
    "url": "images/portfolio_files/app.css",
    "revision": "9841627cba2d43458cfdf5a76c05920b"
  },
  {
    "url": "images/portfolio_files/app.js",
    "revision": "b9c1e214795e96ba48e96d63712a46d5"
  },
  {
    "url": "images/portfolio_files/flems.html",
    "revision": "1785284c70a6ab9be1f5bd8e9655e92d"
  },
  {
    "url": "images/portfolio_files/resume.webp",
    "revision": "1b4977a1b525a22a3a21e54eee93beaa"
  },
  {
    "url": "images/portfolio_files/vendor.js",
    "revision": "44a49e25c6d2568b8f943990d8483b82"
  },
  {
    "url": "images/portfolio.html",
    "revision": "0c0a10d3f00f91d3468a43eea8456348"
  },
  {
    "url": "images/resume.pdf",
    "revision": "c3345f635cb008b52bfe703bff9bb2cd"
  },
  {
    "url": "images/resume.webp",
    "revision": "fad82e28e47083c30cb5aee947004303"
  },
  {
    "url": "images/walk-sequence.svg",
    "revision": "9f5940a94fdfb3c29fa7c92e8a835882"
  },
  {
    "url": "index.html",
    "revision": "0aa60d87df7b30fa84a9b00eabfbd83e"
  },
  {
    "url": "manifest.json",
    "revision": "cea95db8297e442a79a85d8a6c1fe3ea"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
