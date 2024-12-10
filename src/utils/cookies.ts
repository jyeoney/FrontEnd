import { NextResponse } from 'next/server';

/**
 * 쿠키를 설정하는 유틸리티 함수
 * @param res - NextResponse 객체
 * @param name - 쿠키 이름
 * @param value - 쿠키 값
 * @param maxAge - 쿠키 만료 시간 (초 단위)
 */
export const setCookie = (
  res: NextResponse,
  name: string,
  value: string,
  maxAge: number,
) => {
  res.cookies.set(name, value, {
    httpOnly: true, // 클라이언트 자바스크립트에서는 접근 불가(보안상의 이유)
    // secure: process.env.NODE_ENV === 'production', // https 일때만 전송
    secure: false,
    path: '/', // 쿠키의 유효 경로
    sameSite: 'lax',
    maxAge, // 액세스토큰 유효기간
  });

  console.log(`쿠키 설정됨: ${name} = ${value}`);
};

export const deleteCookie = (res: NextResponse, name: string) => {
  res.cookies.set(name, '', {
    // secure: process.env.NODE_ENV === 'production', // https 일때만 전송
    httpOnly: true,
    secure: false,
    path: '/', // 쿠키의 유효 경로
    sameSite: 'lax',
    maxAge: 0, // 만료 시간을 0으로 설정하여 즉시 삭제
  });
};
