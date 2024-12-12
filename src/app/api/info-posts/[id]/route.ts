import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(
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
    const formData = await req.formData();
    const file = formData.get('file');
    const transformedFormData = new FormData();

    if (file && file instanceof File) {
      transformedFormData.append('file', file);
    }

    const fields = {
      title: formData.get('title'),
      description: formData.get('description'),
      userId: formData.get('userId'),
      thumbnailImgUrl: formData.get('thumbnailImgUrl'),
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        transformedFormData.append(key, String(value));
      }
    });

    const response = await axios.post(
      `${process.env.API_URL}/info-posts/${params.id}`,
      transformedFormData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('정보공유 글 수정 실패:', error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || '정보공유 글 수정에 실패했습니다.',
      },
      { status: error.response?.status || 500 },
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
    await axios.delete(`${process.env.API_BASE_URL}/info-posts/${params.id}`, {
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
