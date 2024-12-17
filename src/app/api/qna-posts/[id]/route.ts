import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/')[3];
    const formData = await request.formData();
    const file = formData.get('file');
    const transformedFormData = new FormData();

    if (file && file instanceof File) {
      transformedFormData.append('file', file);
    }

    const fields = {
      title: formData.get('title'),
      content: formData.get('content'),
      author: formData.get('author'),
      thumbnailImgUrl: formData.get('thumbnailImgUrl'),
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        transformedFormData.append(key, String(value));
      }
    });

    const response = await axios.post(
      `${process.env.API_URL}/qna-posts/${id}`,
      transformedFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Q&A 글 수정 실패:', error);
    return NextResponse.json(
      {
        message: error.response?.data?.message || 'Q&A 글 수정에 실패했습니다.',
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split('/')[3];
    await axios.delete(`${process.env.API_URL}/qna-posts/${id}`);
    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 실패:', error);
    return NextResponse.json(
      { message: '게시글 삭제에 실패했습니다.' },
      { status: 500 },
    );
  }
}
