import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request: NextRequest) {
  try {
    const commentId = request.nextUrl.pathname.split('/')[3];
    const body = await request.json();
    const postType = body.post_type.toLowerCase();

    const response = await axios.put(
      `${process.env.API_URL}/${postType}-posts/comments/${commentId}`,
      {
        content: body.content,
        isSecret: body.isSecret,
      },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: '댓글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const commentId = request.nextUrl.pathname.split('/')[3];
    const { searchParams } = new URL(request.url);
    const postType = searchParams.get('post_type')?.toLowerCase();

    await axios.delete(
      `${process.env.API_URL}/${postType}-posts/comments/${commentId}`,
    );

    return NextResponse.json({ message: '댓글이 삭제되었습니다.' });
  } catch {
    return NextResponse.json(
      { message: '댓글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
