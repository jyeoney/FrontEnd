import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// 프로필 이미지 변경
export const config = {
  api: {
    bodyParser: false,
  },
};

export const POST = async (request: NextRequest) => {
  const userId = request.nextUrl.pathname.split('/')[3];
  try {
    const response = await axios.post(
      `${process.env.API_URL}/users/${userId}/profile-image`,
      request.body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200) {
      const { id, nickname, email, profileImageUrl, signinType } =
        response.data;
      const updatedUserInfo = {
        id,
        nickname,
        email,
        profileImageUrl,
        signinType,
      };
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
export const DELETE = async (request: NextRequest) => {
  const userId = request.nextUrl.pathname.split('/')[3];

  try {
    const response = await axios.delete(
      `${process.env.API_URL}/users/${userId}/delete-profile-image`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      const { id, nickname, email, profileImageUrl, signinType } =
        response.data;
      const updatedUserInfo = {
        id,
        nickname,
        email,
        profileImageUrl,
        signinType,
      };
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
