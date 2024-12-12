import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { setCookie } from '@/utils/cookies';

// const processRefreshToken = (request: NextRequest, refreshToken: string) => {
//   console.log('accessToken 없음');
//   const refreshRoute = new URL('/api/auth/token-reissue', request.url);
//   const headers = new Headers({ 'Content-Type': 'application/json' });
//   return NextResponse.rewrite(refreshRoute, { headers: headers });
// };

// export default processRefreshToken;

const processRefreshToken = async (
  request: NextRequest,
  refreshToken: string,
) => {
  console.log('accessToken 없음');
  // const refreshRoute = new URL('/api/auth/token-reissue', request.url);
  // const headers = new Headers({ 'Content-Type': 'application/json' });
  // return NextResponse.rewrite(refreshRoute, { headers: headers });

  try {
    const response = await axios.post(
      `${process.env.API_URL}/auth/token-reissue`, // 백엔드 API 실제 경로
      { refreshToken },
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

      const setCookie = (
        res: NextResponse,
        name: string,
        value: string,
        maxAge: number,
      ) => {
        res.cookies.set(name, value, {
          // secure: process.env.NODE_ENV === 'production', // https 일때만 전송
          httpOnly: true, // 클라이언트 자바스크립트에서는 접근 불가(보안상의 이유)
          secure: false,
          path: '/', // 쿠키의 유효 경로
          sameSite: 'strict',
          maxAge,
        });

        console.log(`쿠키 설정됨: ${name} = ${value}`);
      };

      setCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
      res.headers.set('Authorization', `Bearer ${accessToken}`);

      // return (
      //   NextResponse.json({ message: '토큰 갱신 성공' }),
      //   { headers: res.headers }
      // );
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

export default processRefreshToken;

// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';
// const processRefreshToken = async (refreshToken: string) => {
//   try {
//     const response = await axios.post(
//       `${process.env.API_URL}/auth/token-reissue`,
//       { refreshToken },
//       {
//         headers: { 'Content-Type': 'application/json' },
//       },
//     );

//     if (response.status === 200) {
//       return response.data;
//     }

//     throw new Error('accessToken 재발급에 실패했습니다.');
//   } catch (error: any) {
//     console.error('accessToken 재발급 중 오류가 발생했습니다.');
//     throw error;
//   }
// };

// export default processRefreshToken;
