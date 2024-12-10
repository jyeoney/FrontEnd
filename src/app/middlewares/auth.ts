import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { IGNORED_PATHS } from './pathConstants';
import processAccessToken from './processAccessToken';
import processRefreshToken from './processRefreshToken';
import handleRedirectToSignIn from './handleRedirectToSignIn';

const checkAuth = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (IGNORED_PATHS.includes(pathname)) {
    console.log('로그인 요청 - 미들웨어 건너뜀');
    return NextResponse.next();
  }

  console.log('미들웨어 실행됨:', pathname);
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  console.log('미들웨어 토큰 체크:', {
    accessToken: accessToken ? '존재' : '없음',
    refreshToken: refreshToken ? '존재' : '없음',
  });

  if (accessToken) {
    return processAccessToken(request, accessToken);
  }

  if (refreshToken) {
    return processRefreshToken(request, refreshToken);
  }

  return handleRedirectToSignIn(request);
};

export default checkAuth;
