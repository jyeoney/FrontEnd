import { NextRequest, NextResponse } from 'next/server';

export const GET = async (req: NextRequest) => {
  const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_CLIENT_ID}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}`;
  return NextResponse.redirect(kakaoAuthURL);
};
