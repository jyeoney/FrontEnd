import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 미들웨어 실행하지 않는 경우

  const { pathname } = request.nextUrl;
  const method = request.method;
  if (pathname === '/api/auth/sign-in') {
    console.log('로그인 요청 - 미들웨어 건너뜀');
    return NextResponse.next();
  }

  console.log('미들웨어 실행됨:', pathname);
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

  console.log('accessToken, refreshToken 모두 없음');
  const signInUrl = new URL('/signin', request.url);
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ['/api/:path*'],
};
