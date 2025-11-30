import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      {
        protocol: 'https',
        hostname: 'directus-production-0b20.up.railway.app',
        pathname: '/assets/**',
      },
    ],
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
