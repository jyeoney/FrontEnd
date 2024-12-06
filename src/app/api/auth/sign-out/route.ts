import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
  const res = NextResponse.json({ message: '로그아웃 성공' });

  try {
    await axios.post(
      `${process.env.API_URL}/auth/sign-out`, // 실제 백엔드 API 경로
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const res = NextResponse.json({ message: '로그아웃 성공' });
    res.cookies.set('accessToken', '', {
      path: '/',
      maxAge: 0,
    });
    res.cookies.set('refreshToken', '', {
      path: '/',
      maxAge: 0,
    });
    return res;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(
      { message: '네트워크 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};
