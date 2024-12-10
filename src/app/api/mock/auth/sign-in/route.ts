import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { setCookie } from '@/utils/cookies';

export const mockUserInfo = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testUser',
  profileImageUrl: '/default-profile-image.png',
};

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (email === mockUserInfo.email && password === 'test1234!!') {
    // mock 엑세스 토큰과 리프레시 토큰 생성
    const accessToken = jwt.sign(
      { email },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      { expiresIn: '15m' },
    );
    const refreshToken = jwt.sign(
      { email },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      { expiresIn: '3d' },
    );

    const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
    const currentTime = Math.trunc(Date.now() / 1000);
    const accessTokenMaxAge = decodedAccessToken.exp - currentTime;

    const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
    const refreshTokenMaxAge = decodedRefreshToken.exp - currentTime;

    const res = NextResponse.json({
      message: '로그인 성공',
      userInfo: {
        id: mockUserInfo.id,
        nickname: mockUserInfo.nickname,
        email: mockUserInfo.email,
        profileImageUrl: mockUserInfo.profileImageUrl,
      },
    });

    setCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);
    console.log('Decoded Access Token:', decodedAccessToken);
    console.log('Decoded Refresh Token:', decodedRefreshToken);

    return res;
  }

  return NextResponse.json(
    {
      message:
        '이메일 혹은 비밀번호가 일치하지 않습니다. 입력한 내용을 다시 확인해 주세요.',
    },
    { status: 401 },
  );
};
