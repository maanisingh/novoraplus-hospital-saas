import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly define public runtime environment variables
  env: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'https://hospital-backend-production-c6bd.up.railway.app',
    NEXT_PUBLIC_DIRECTUS_URL: process.env.NEXT_PUBLIC_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://hospital-backend-production-c6bd.up.railway.app',
  },
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
