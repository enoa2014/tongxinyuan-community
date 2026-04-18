
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8091',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8091',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'tongxy.xyz',
        port: '8091',
        pathname: '/api/files/**',
      },
      {
        protocol: 'http',
        hostname: 'tongxy.xyz',
        port: '8090',
        pathname: '/api/files/**',
      },
    ],
  },
};

export default nextConfig;
