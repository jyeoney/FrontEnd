import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
  const cookiesList = await cookies();
  const refreshToken = cookiesList.get('refreshToken')?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { message: '리프레시 토큰이 없습니다.' },
      { status: 401 },
    );
  }

  const { email } = await req.json();

  try {
    const response = await axios.post(
      '/api/auth/token-reissue',
      { email, refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      const { accessToken } = response.data;

      const res = NextResponse.json({ message: '토큰 갱신 성공' });
      const cookies = res.cookies;
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
      });
      return res;
    }
    return NextResponse.json(
      { message: '유효하지 않은 리프레시 토큰입니다.' },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
};
