import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 미들웨어 실행하지 않는 경우
  if (
    // request.nextUrl.pathname === '/signin' ||
    request.nextUrl.pathname === '/api/mock/auth/sign-in'
  ) {
    return NextResponse.next();
  }

  console.log('미들웨어 실행됨:', request.nextUrl.pathname);
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (accessToken) {
    console.log('accessToken 존재:', accessToken);
    return NextResponse.next({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  if (refreshToken) {
    console.log('accessToken 없음');
    const refreshRoute = new URL('/api/mock/auth/token-reissue', request.url);
    return NextResponse.rewrite(refreshRoute);
  }

  console.log('accesstoken, refreshToken 모두 없음');
  const signInUrl = new URL('/signin', request.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/api/:path*'],
};
