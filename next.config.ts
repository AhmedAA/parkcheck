import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  disable: !isProd,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: isProd ? "/parkcheck" : "",
  assetPrefix: isProd ? "/parkcheck" : "",
  images: {
    unoptimized: true,
  },
};

export default withSerwist(nextConfig);