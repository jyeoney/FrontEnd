import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const id = request.nextUrl.pathname.split('/')[3];

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const response = await axios.get(
      `${process.env.API_URL}/study/${id}/participants`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('참여자 목록 조회 실패:', error);
    return NextResponse.json(
      { message: '참여자 목록 조회에 실패했습니다.' },
      { status: 500 },
    );
  }
}
