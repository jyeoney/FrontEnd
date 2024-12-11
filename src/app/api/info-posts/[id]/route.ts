import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const response = await axios.get(
      `${process.env.API_URL}/info-posts/${params.id}`,
    );

    const post = response.data;

    // 응답 형식을 명세서에 맞게 변환
    const formattedResponse = {
      id: post.id,
      user: {
        id: post.user.id,
        username: post.user.username,
        email: post.user.email,
        profileImageUrl: post.user.profileImageUrl,
        isActive: post.user.isActive,
        createdAt: post.user.createdAt,
        updatedAt: post.user.updatedAt,
      },
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    return NextResponse.json(formattedResponse);
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

    const file = formData.get('thumbnail');
    const transformedFormData = new FormData();

    if (file && file instanceof File) {
      transformedFormData.append('thumbnail', file);
    }

    const fields = {
      title: formData.get('title'),
      content: formData.get('content'),
      userId: formData.get('userId'),
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        transformedFormData.append(key, String(value));
      }
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/info-posts/${params.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: transformedFormData,
      },
    );

    if (!response.ok) {
      throw new Error('정보공유 글 수정 실패');
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('API Route 에러:', error);
    return NextResponse.json(
      { message: '정보공유 글 수정에 실패했습니다.' },
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
