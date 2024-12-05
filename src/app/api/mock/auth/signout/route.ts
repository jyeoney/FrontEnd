import { NextResponse } from 'next/server';

export const POST = async () => {
  const response = NextResponse.json({ message: 'Mock 로그아웃 성공' });

  response.cookies.set('accessToken', '', {
    path: '/',
    maxAge: 0,
  });
  response.cookies.set('refreshToken', '', {
    path: '/',
    maxAge: 0, // 쿠키 삭제
  });

  return response;
};
