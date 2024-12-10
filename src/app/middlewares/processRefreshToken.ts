import { NextRequest, NextResponse } from 'next/server';
import handleRedirectToSignIn from './handleRedirectToSignIn';

const processRefreshToken = async (
  request: NextRequest,
  refreshToken: string,
) => {
  console.log('refreshToken으로 토큰 재발급 시도');

  const baseUrl = request.nextUrl.origin;
  const response = await fetch(`${baseUrl}/api/auth/token-reissue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    return handleRedirectToSignIn(request);
  }

  const { accessToken } = await response.json();
  return NextResponse.next({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default processRefreshToken;
