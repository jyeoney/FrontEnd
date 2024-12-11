import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 },
      );
    }

    const file = formData.get('file');
    const transformedFormData = new FormData();

    if (file && file instanceof File) {
      transformedFormData.append('file', file);
    }

    const fields = {
      title: formData.get('title'),
      content: formData.get('content'),
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        transformedFormData.append(key, String(value));
      }
    });

    const response = await axios.post(
      `${process.env.API_URL}/info-posts`,
      transformedFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
        transformRequest: [
          function () {
            return transformedFormData;
          },
        ],
        maxBodyLength: Infinity,
      },
    );

    if (response.status !== 200) {
      throw new Error('정보공유 글 작성 실패');
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    console.error('API Route 에러:', error);
    return NextResponse.json(
      { message: '정보공유 글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
