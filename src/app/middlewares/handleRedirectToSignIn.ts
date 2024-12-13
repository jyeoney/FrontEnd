import { NextRequest, NextResponse } from 'next/server';

const handleRedirectToSignIn = (request: NextRequest) => {
  console.log('accessToken 및 refreshToken이 모두 없음');

  const isApiRequest = request.nextUrl.pathname.startsWith('/api/');
  if (isApiRequest) {
    // API 요청일 경우 JSON 형식의 401 응답 반환
    return new NextResponse(JSON.stringify({ message: '인증이 필요합니다.' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 페이지 요청일 경우 로그인 페이지로 리다이렉트
  const signInUrl = new URL('/signin', request.url);
  return NextResponse.redirect(signInUrl);
};

export default handleRedirectToSignIn;
