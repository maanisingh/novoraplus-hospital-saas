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
    ],
  },
};

export default nextConfig;
