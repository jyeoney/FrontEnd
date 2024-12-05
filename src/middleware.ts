import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('미들웨어 실행됨:', request.nextUrl.pathname);
  const accessToken = request.cookies.get('accessToken')?.value;

  // 로그 출력으로 미들웨어가 정상적으로 동작하는지 확인
  console.log('미들웨어 실행 - 요청 경로:', request.nextUrl.pathname);

  // 인증이 필요한 경로를 보호
  if (accessToken) {
    console.log('AccessToken 존재:', accessToken);
    return NextResponse.next({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  // 기본적으로 요청을 계속 진행
  console.log('AccessToken 없음');
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'], // 특정 경로에서만 동작
};
