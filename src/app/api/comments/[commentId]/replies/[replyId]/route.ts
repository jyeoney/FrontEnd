import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(request: NextRequest) {
  try {
    const replyId = request.nextUrl.pathname.split('/')[5];
    const body = await request.json();
    const postType = body.post_type.toLowerCase();

    const response = await axios.put(
      `${process.env.API_URL}/${postType}-posts/replies/${replyId}`,
      {
        content: body.content,
        isSecret: body.isSecret,
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('대댓글 수정 실패:', error);
    return NextResponse.json(
      { message: '대댓글 수정에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const replyId = request.nextUrl.pathname.split('/')[5];
    const { searchParams } = new URL(request.url);
    const postType = searchParams.get('post_type')?.toLowerCase();

    await axios.delete(
      `${process.env.API_URL}/${postType}-posts/replies/${replyId}`,
    );

    return NextResponse.json({ message: '대댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('대댓글 삭제 실패:', error);
    return NextResponse.json(
      { message: '대댓글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
