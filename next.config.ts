import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        './redis.js': './lib/queue/redis.ts',
      },
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.mlsgrid.com' },
      { protocol: 'https', hostname: 'images.mlsgrid.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: '*.mlsgrid.com' },
    ],
  },
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias || {}),
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };

    return config;
  },
};

export default nextConfig;

// /Users/davidquinn/david-quinn-group/colorado-real-estate/next.config.ts
