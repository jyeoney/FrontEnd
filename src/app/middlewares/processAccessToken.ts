import { NextRequest, NextResponse } from 'next/server';

const processAccessToken = (request: NextRequest, accessToken: string) => {
  console.log('accessToken 존재:', accessToken);
  return NextResponse.next({
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export default processAccessToken;
