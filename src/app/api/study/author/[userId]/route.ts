import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } },
) => {
  const { userId } = await params;
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '0';
  try {
    const response = await axios.get(
      `${process.env.API_URL}/study/author/${userId}?page=${page}`,
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
