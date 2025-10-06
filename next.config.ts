import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProduction ? '/parkcheck' : '',
  assetPrefix: isProduction ? '/parkcheck' : '',
  images: {
    unoptimized:true
  }
};

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
};

// Only apply the PWA wrapper for production builds
export default isProduction ? withPWA(pwaConfig)(nextConfig as any) : nextConfig;