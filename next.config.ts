import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
              "connect-src * 'unsafe-inline'",
              'media-src * data: blob:',
              'img-src * data: blob:',
              'frame-src * data: blob:',
              'worker-src * blob:',
              'child-src * blob:',
            ].join('; '),
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
