import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import jwt from 'jsonwebtoken';

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
      `${process.env.API_BASE_URL}/auth/token-reissue`, // 백엔드 API 실제 경로
      { email, refreshToken },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      const { accessToken } = response.data;

      const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
      if (!decodedAccessToken || !decodedAccessToken.exp) {
        throw new Error('액세스토큰 exp 클레임이 없습니다.');
      }

      const currentTime = Math.trunc(Date.now() / 1000);
      const bufferTime = 10;
      const accessTokenMaxAge = Math.max(
        decodedAccessToken.exp - currentTime - bufferTime,
        0,
      );

      const res = NextResponse.json({ message: '토큰 갱신 성공' });

      const cookies = res.cookies;
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge: accessTokenMaxAge,
      });
      return res;
    }
    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json({ message: '서버 오류' }, { status: 500 });
  }
};
