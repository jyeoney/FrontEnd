import { NextRequest, NextResponse } from 'next/server';

const processAccessToken = (request: NextRequest, accessToken: string) => {
  console.log('accessToken 존재:', accessToken);

  // API 서버의 URL로 요청을 리라이트
  const apiUrl = `${process.env.SERVER_URL}/${request.nextUrl.pathname}`;
  const headers = new Headers(request.headers);

  // 기존의 Authorization 헤더를 추가
  headers.set('Authorization', `Bearer ${accessToken}`);

  // 리퀘스트를 백엔드 서버로 리다이렉션
  return NextResponse.rewrite(apiUrl, {
    headers: headers,
  });
};

export default processAccessToken;
