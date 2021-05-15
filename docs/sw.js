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
    "revision": "4ccd041b4a8c3c1123f77e39b7677949"
  },
  {
    "url": "app.css.map",
    "revision": "7be53a0543207df4cce50d2fe89f47b4"
  },
  {
    "url": "app.js",
    "revision": "c383a870c138ad5a8ea44e918f7b6880"
  },
  {
    "url": "app.js.map",
    "revision": "96a4a92e323b38434b9f4ddc81e26f50"
  },
  {
    "url": "files/resume.pdf",
    "revision": "7686ea4415fbba24f414d245996e8789"
  },
  {
    "url": "images/boazface.jpg",
    "revision": "ac34d87e2757120960ab4f9a7acba2c6"
  },
  {
    "url": "images/boazface.webp",
    "revision": "19bb767d6ec7647121bb51d8efdeea29"
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
    "url": "images/resume 2.jpeg",
    "revision": "9a7da7d5cff2b0574b4e1c92fb8215a7"
  },
  {
    "url": "images/resume 2.webp",
    "revision": "fb66b45ae1f3eebfd936dba60f52b6c4"
  },
  {
    "url": "images/resume.jpeg",
    "revision": "370444fdc3240059cf93bf2cedbc45bb"
  },
  {
    "url": "images/resume.pdf",
    "revision": "7686ea4415fbba24f414d245996e8789"
  },
  {
    "url": "images/resume.webp",
    "revision": "80815666a8d5fffea203f72699146dd1"
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
    "revision": "4acccb29d9ee9cea3ddc47f53a5beb64"
  },
  {
    "url": "vendor.js.map",
    "revision": "6b50aa4d56afad4fcfcfcaacb159ed82"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
