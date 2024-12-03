import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export const POST = async (req: NextRequest) => {
  // 쿠키에서 액세스토큰과 리프레시토큰을 삭제
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '이미 로그아웃 상태입니다.' },
      { status: 400 },
    );
  }
  const res = NextResponse.json({ message: '로그아웃 성공' });

  try {
    await axios.post(
      `${process.env.API_BASE_URL}/auth/sign-out`, // 실제 백엔드 API 경로
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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
  } catch (error) {
    return NextResponse.json({ message: '로그아웃 실패' }, { status: 500 });
  }

  // 쿠키에서 액세스토큰과 리프레시토큰을 삭제

  return res;
};
