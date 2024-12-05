import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/qna-posts/${params.id}`,
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('게시글 조회 실패:', error);
    return NextResponse.json(
      { message: '게시글을 찾을 수 없습니다.' },
      { status: 404 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
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
    const response = await axios.put(
      `${process.env.API_BASE_URL}/qna-posts/${params.id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    return NextResponse.json(
      { message: '게시글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    await axios.delete(`${process.env.API_BASE_URL}/qna-posts/${params.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return NextResponse.json(
      { message: '게시글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
