import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  try {
    // if (email === 'user@example.com' && password === 'password123') {
    //   // 토큰 생성 (실제 사용 시 JWT나 외부 인증 서비스를 사용)
    //   const accessToken = 'exampleAccessToken';
    //   const refreshToken = 'exampleRefreshToken';

    //   const res = NextResponse.json({ message: '로그인 성공' });
    // }
    const response = await axios.post(
      '/api/auth/sign-in',
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true
      },
    );

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data;

      const res = NextResponse.json({ message: '로그인 성공' });

      const cookies = res.cookies;
      cookies.set('accessToken', accessToken, {
        httpOnly: true, // 클라이언트 자바스크립트에서는 접근 불가(보안상의 이유)
        //secure: process.env.NODE_ENV === 'production', // https 일때만 전송
        path: '/', // 쿠키의 유효 경로
        sameSite: 'strict', // CSRF 보호
      });
      cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 3, // 3일 동안 유효
      });

      return res;
    }

    return NextResponse.json({ message: '로그인 실패' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
};
