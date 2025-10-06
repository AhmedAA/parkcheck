import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = '/parkcheck';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProduction ? basePath : '',
  assetPrefix: isProduction ? basePath : '',
  images: {
    unoptimized: true,
  },
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true
});

export default withPWA(nextConfig);