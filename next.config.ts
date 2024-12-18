import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['swany-bucket.s3.ap-northeast-2.amazonaws.com'], // 외부 이미지 도메인 추가
  },
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
