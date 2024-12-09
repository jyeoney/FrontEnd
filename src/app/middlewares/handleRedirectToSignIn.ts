import { NextRequest, NextResponse } from 'next/server';

const handleRedirectToSignIn = (request: NextRequest) => {
  console.log('accessToken, refreshToken 모두 없음');
  const signInUrl = new URL('/signin', request.url);
  return NextResponse.redirect(signInUrl);
};

export default handleRedirectToSignIn;
