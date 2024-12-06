import { NextResponse } from 'next/server';
import axios from 'axios';

export async function PATCH(req: Request) {
  try {
    const { profileImageUrl } = await req.json();

    if (!profileImageUrl) {
      return NextResponse.json(
        { message: 'profileImageUrl이 필요합니다.' },
        { status: 400 },
      );
    }

    const response = await axios.patch(
      `${process.env.API_BASE_URL}/users/delete-profile-image`,
      {
        profileImageUrl,
      },
    );
    return NextResponse.json(response.data, { status: response.status });
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
}
