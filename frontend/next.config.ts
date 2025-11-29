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
};

export default nextConfig;
