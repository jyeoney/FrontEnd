// import { NextRequest, NextResponse } from 'next/server';

// export const GET = async (req: NextRequest) => {
//   const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
//   return NextResponse.redirect(kakaoAuthURL);
// };
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

import { handleUserInfo } from '@/utils/authHelper';

export const POST = async (request: NextRequest) => {
  const { code } = await request.json();
  if (!code) {
    return NextResponse.json(
      { message: '인증 코드가 없습니다.' },
      { status: 400 },
    );
  }

  try {
    const response = await axios.post(
      `${process.env.API_URL}/auth/sign-in/kakao`,
      { code },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data;
      const res = NextResponse.json({ message: '로그인 성공' });
      const apiUrl = process.env.API_URL;

      if (!apiUrl) {
        throw new Error('API_URL 환경 변수가 설정되지 않았습니다.');
      }
      const { userInfo } = await handleUserInfo(
        res,
        accessToken,
        refreshToken,
        apiUrl,
      );

      return NextResponse.json(
        { message: '로그인 성공', userInfo },
        { headers: res.headers },
      );
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response;
      return NextResponse.json('카카오 로그인에 실패했습니다.', { status });
    }
    return NextResponse.json(
      { message: '네트워크 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};
