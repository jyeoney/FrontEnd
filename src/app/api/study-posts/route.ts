import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    // 새로운 요청 생성
    const response = await fetch(`${process.env.API_BASE_URL}/study-posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('스터디 글 작성 실패:', error);
    return NextResponse.json(
      { message: '스터디 글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
