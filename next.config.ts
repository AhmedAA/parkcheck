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

export default withPWA(pwaConfig)(nextConfig);