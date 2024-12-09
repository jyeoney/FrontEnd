import { NextRequest, NextResponse } from 'next/server';

const processRefreshToken = (request: NextRequest, accessToken: string) => {
  console.log('accessToken 없음');
  const refreshRoute = new URL('/api/mock/auth/token-reissue', request.url);
  return NextResponse.rewrite(refreshRoute);
};

export default processRefreshToken;
