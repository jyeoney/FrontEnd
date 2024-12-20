import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (request: NextRequest) => {
  const { currentPassword, newPassword } = await request.json();
  const userId = request.nextUrl.pathname.split('/')[4] as string;

  try {
    const response = await axios.post(
      `${process.env.API_URL}/auth/change-password/${userId}`,
      { currentPassword, newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      return NextResponse.json(response.data, { status: response.status });
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json(data, { status });
    }

    return NextResponse.json(
      { message: '네트워크 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};
