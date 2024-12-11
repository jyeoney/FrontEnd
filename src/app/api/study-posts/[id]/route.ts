import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/study-posts/${params.id}`,
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
