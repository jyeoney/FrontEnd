import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "upgrade-insecure-requests; default-src 'self' 'unsafe-inline' 'unsafe-eval' http: https: data: blob: ws:",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
