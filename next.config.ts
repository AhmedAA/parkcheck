import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // Your Next.js config options go here
};

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
};

// Check if the environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Only apply the PWA wrapper for production builds
export default isProduction ? withPWA(pwaConfig)(nextConfig as any) : nextConfig;