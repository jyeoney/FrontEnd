import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

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
    const response = await axios.post(
      `${process.env.API_BASE_URL}/comments`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: '댓글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
