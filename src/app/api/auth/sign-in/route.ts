import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { handleUserInfo } from '@/utils/authHelper';

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  try {
    // 1. 로그인 요청
    const response = await axios.post(
      `${process.env.API_URL}/auth/sign-in`, // 실제 백엔드 API 경로
      { email, password },
      {
        headers: { 'Content-Type': 'application/json' },
        // withCredentials: true // 서버에서 보낸 쿠키를 클라이언트에서 자동으로 받아서 저장
      },
    );

    if (response.status === 200) {
      const { accessToken, refreshToken } = response.data;
      const res = NextResponse.json({ message: '로그인 성공' });

      const apiUrl = process.env.API_URL;
      console.log('accessToken입니다: ' + accessToken);
      console.log('refreshToken입니다: ' + refreshToken);

      if (!apiUrl) {
        throw new Error('API_URL 환경 변수가 설정되지 않았습니다.');
      }
      const { userInfo } = await handleUserInfo(
        res,
        accessToken,
        refreshToken,
        apiUrl,
      );
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);

      // res.headers.append(
      //   'Access-Control-Allow-Origin',
      //   'http://localhost:3000',
      // ); // 클라이언트 도메인
      // res.headers.append('Access-Control-Allow-Credentials', 'true');

      return NextResponse.json(
        { message: '로그인 성공', userInfo },
        { headers: res.headers },
      );
    }

    return NextResponse.json(response.data, { status: response.status });
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
