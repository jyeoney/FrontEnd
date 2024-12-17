import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const body = await req.json();
    const postType = body.post_type.toLowerCase();

    const response = await axios.put(
      `${process.env.API_URL}/${postType}-posts/comments/${params.commentId}`,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const postType = searchParams.get('post_type')?.toLowerCase();

    await axios.delete(
      `${process.env.API_URL}/${postType}-posts/comments/${params.commentId}`,
    );

    return NextResponse.json({ message: '댓글이 삭제되었습니다.' });
  } catch {
    return NextResponse.json(
      { message: '댓글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
