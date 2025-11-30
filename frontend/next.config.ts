import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'novoraplus.com',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'hospital-api.alexandratechlab.com',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
        pathname: '/assets/**',
      },
    ],
  },
  // Force revalidation of pages
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Add cache-control headers
  async headers() {
    return [
      {
        source: '/login',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
