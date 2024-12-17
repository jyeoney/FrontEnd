import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const commentId = request.nextUrl.pathname.split('/')[3];
    const body = await request.json();
    const postType = body.post_type.toLowerCase();

    const response = await axios.post(
      `${process.env.API_URL}/${postType}-posts/comments/${commentId}`,
      {
        content: body.content,
        isSecret: body.isSecret,
      },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: '대댓글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
