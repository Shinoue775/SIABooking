import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sia-backup.vercel.app';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
