import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const POST = async (
  request: NextRequest,
  { params }: { params: { studyId: string; userId: string } },
) => {
  const { studyId, userId } = await params;

  try {
    const response = await axios.post(
      `${process.env.API_URL}/chat/study/${studyId}/participant/${userId}`, // 백엔드 서버 URL
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      if (response.status === 200) {
        return NextResponse.json(response.data, { status: response.status });
      }
    }
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
};
