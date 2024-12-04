import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const mockUserData = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testuser',
  profileImageUrl: 'https://via.placeholder.com/150',
};

export const POST = async (req: NextRequest) => {
  const { email, password } = await req.json();

  if (email === mockUserData.email && password === 'test1234!!') {
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

    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
    const refreshTokenMaxAge = decodeRefreshToken.exp - currentTime;

    const res = NextResponse.json({
      message: '로그인 성공',
      userInfo: {
        id: mockUserData.id,
        nickname: mockUserData.nickname,
        email: mockUserData.email,
        profileImageUrl: mockUserData.profileImageUrl,
      },
    });

    const cookies = res.cookies;
    cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: accessTokenMaxAge,
    });

    cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
      maxAge: refreshTokenMaxAge,
    });

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
