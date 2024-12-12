import { NextResponse } from 'next/server';

export const POST = async () => {
  const response = NextResponse.json({ message: 'Mock 로그아웃 성공' });

  // response.cookies.set('accessToken', '', {
  //   path: '/',
  //   maxAge: 0,
  // });
  // response.cookies.set('refreshToken', '', {
  //   path: '/',
  //   maxAge: 0, // 쿠키 삭제
  // });

  response.cookies.set('accessToken', '', {
    path: '/', // 쿠키의 경로를 지정
    maxAge: 0, // 쿠키 만료 시간 0초로 설정하여 삭제
    httpOnly: true, // 보안상의 이유로 JavaScript에서 접근 불가
    secure: false, // HTTPS 환경에서만 쿠키를 설정하려면 true로 설정 (로컬 개발 환경에서는 false)
    sameSite: 'lax', // CSRF 보호를 위한 sameSite 옵션
  });

  response.cookies.set('refreshToken', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  });

  return response;
};
