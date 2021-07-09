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
    "revision": "ad2bb5826cec1204a91856f93ebabd70"
  },
  {
    "url": "app.js",
    "revision": "6f0c2af73aedae2cd8d847e640842545"
  },
  {
    "url": "files/resume.pdf",
    "revision": "7686ea4415fbba24f414d245996e8789"
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
    "url": "images/resume 2.jpeg",
    "revision": "9a7da7d5cff2b0574b4e1c92fb8215a7"
  },
  {
    "url": "images/resume.jpeg",
    "revision": "370444fdc3240059cf93bf2cedbc45bb"
  },
  {
    "url": "images/walk-sequence.svg",
    "revision": "9f5940a94fdfb3c29fa7c92e8a835882"
  },
  {
    "url": "index.html",
    "revision": "d0428c66e0f6881065f93a09d3e16a52"
  },
  {
    "url": "manifest.json",
    "revision": "cea95db8297e442a79a85d8a6c1fe3ea"
  },
  {
    "url": "vendor.js",
    "revision": "c5d49bd923c99b5eb039666ef7a191fd"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
