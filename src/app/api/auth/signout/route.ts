import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export const POST = async (req: NextRequest) => {
  // 요청 헤더 AxiosHeaders 형식으로 변환
  const headers = Object.fromEntries(req.headers.entries());

  // if (!accessToken) {
  //   return NextResponse.json(
  //     { message: '이미 로그아웃 상태입니다.' },
  //     { status: 400 },
  //   );
  // }
  const res = NextResponse.json({ message: '로그아웃 성공' });

  try {
    await axios.post(
      `${process.env.API_BASE_URL}/auth/sign-out`, // 실제 백엔드 API 경로
      {},
      {
        headers,
        // : {
        //   'Content-Type': 'application/json',
        //   Authorization: `Bearer ${accessToken}`,
        // },
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

  return res;
};
