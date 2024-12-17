import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export const POST = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  try {
    await axios.post(
      `${process.env.API_URL}/auth/withdrawal`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const res = NextResponse.json({ message: '회원 탈퇴 성공' });

    // deleteCookie(res, 'accessToken');
    // deleteCookie(res, 'refreshToken');
    res.cookies.set('accessToken', '', { maxAge: 0 });
    res.cookies.set('refreshToken', '', { maxAge: 0 });

    return NextResponse.json(
      { message: '회원 탈퇴 성공' },
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
