import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/')[3];
    const response = await axios.get(
      `${process.env.API_URL}/study-posts/${id}`,
    );
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('스터디 조회 실패:', error);
    return NextResponse.json(
      { message: error.response?.data?.message },
      { status: error.response?.status || 404 },
    );
  }
}

export async function POST(request: NextRequest) {
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
    const formData = await request.formData();
    const response = await axios.post(
      `${process.env.API_URL}/study-posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('스터디 글 수정 실패:', error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || '스터디 글 수정에 실패했습니다.',
      },
      { status: error.response?.status || 500 },
    );
  }
}
