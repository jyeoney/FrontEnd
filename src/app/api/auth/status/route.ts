import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // 쿠키에 토큰이 있으면 로그인 상태, 없으면 로그아웃 상태
  if (accessToken || refreshToken) {
    return NextResponse.json({ isSignedIn: true });
  } else {
    return NextResponse.json({ isSignedIn: false });
  }
}
