/// <reference lib="webworker" />

import { defaultCache } from "@serwist/next/worker";
import { 
  Serwist, 
  CacheFirst, 
  ExpirationPlugin 
} from "serwist";
import type { PrecacheEntry, SerwistGlobalConfig, RuntimeCaching } from "serwist";

// 1. Define types for the Service Worker global scope
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// 2. Initialize Serwist
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    // Spread the default Next.js caching rules
    ...defaultCache,
    
    // 3. Custom Cache for OpenStreetMap tiles
    {
      matcher: ({ url }) => url.host === "tile.openstreetmap.org",
      // HANDLER FIX: Use an instance of CacheFirst instead of a string
      handler: new CacheFirst({
        cacheName: "map-tiles",
        plugins: [
          // OPTIONS FIX: Use the ExpirationPlugin for maxEntries/maxAge
          new ExpirationPlugin({
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          }),
        ],
      }),
    },
  ] as RuntimeCaching[],
});

serwist.addEventListeners();