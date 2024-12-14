import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(req: NextRequest) {
  // const cookieStore = await cookies();
  // const accessToken = cookieStore.get('accessToken')?.value;

  // if (!accessToken) {
  //   return NextResponse.json(
  //     { message: '인증이 필요합니다.' },
  //     { status: 401 },
  //   );
  // }

  try {
    const body = await req.json();
    const response = await axios.post(
      `${process.env.API_URL}/comments`,
      {
        post_id: body.post_id,
        post_type: body.post_type,
        is_secret: body.is_secret,
        content: body.content,
        ...(body.reply_to && { reply_to: body.reply_to }),
      },
      // {
      //   headers: {
      //     Authorization: `Bearer ${accessToken}`,
      //   },
      // },
    );

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json(
      { message: '댓글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
