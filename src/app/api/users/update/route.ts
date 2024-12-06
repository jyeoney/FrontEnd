import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PATCH(request: Request) {
  const { nickname } = await request.json();

  if (!nickname || nickname.trim().length === 0) {
    return NextResponse.json(
      { message: '닉네임을 입력해주세요.' },
      { status: 400 },
    );
  }

  try {
    const response = await axios.patch(
      `${process.env.API_BASE_URL}/users/update`, // 백엔드 서버 URL
      { nickname },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json(data, { status });
    }

    // 네트워크 오류 처리
    return NextResponse.json(
      { message: '네트워크 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
