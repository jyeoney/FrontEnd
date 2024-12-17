import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 프로필 이미지 변경
export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const { userId } = await params;
  try {
    const response = await axios.post(
      `${process.env.API_URL}/users/${userId}/profile-image`,
      req.body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200) {
      const { id, nickname, email, profileImageUrl } = response.data;
      const updatedUserInfo = { id, nickname, email, profileImageUrl };
      console.log('response data:', updatedUserInfo);
      return NextResponse.json(updatedUserInfo, { status: response.status });
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

// 프로필 이미지 삭제
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const { userId } = await params;

  try {
    const response = await axios.delete(
      `${process.env.API_URL}/users/${userId}/delete-profile-image`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      const { isActive, createdAt, updatedAt, ...updatedUserInfo } =
        response.data;
      return NextResponse.json(updatedUserInfo, { status: response.status });
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
