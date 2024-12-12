import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { deleteCookie } from '@/utils/cookies';
import { cookies } from 'next/headers';

export const POST = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  try {
    await axios.post(
      `${process.env.API_URL}/auth/sign-out`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const res = NextResponse.json({ message: '로그아웃 성공' });

    // deleteCookie(res, 'accessToken');
    // deleteCookie(res, 'refreshToken');
    res.cookies.set('accessToken', '', { maxAge: 0 });
    res.cookies.set('refreshToken', '', { maxAge: 0 });

    return NextResponse.json(
      { message: '로그아웃 성공' },
      { headers: res.headers },
    );
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
