import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

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

    // 파일 처리
    const file = formData.get('file');
    const transformedFormData = new FormData();

    if (file && file instanceof File) {
      transformedFormData.append('file', file);
    }

    // dayType 배열 처리
    const dayType = formData.get('dayType');
    const parsedDayType = dayType ? JSON.parse(dayType as string) : [];

    // 나머지 필드들 추가
    const fields = {
      title: formData.get('title'),
      studyName: formData.get('studyName'),
      subject: formData.get('subject'),
      difficulty: formData.get('difficulty'),
      dayType: parsedDayType,
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      startTime: formData.get('startTime'),
      endTime: formData.get('endTime'),
      meetingType: formData.get('meetingType'),
      recruitmentPeriod: formData.get('recruitmentPeriod'),
      description: formData.get('description'),
      maxParticipants: Number(formData.get('maxParticipants')),
      userId: Number(formData.get('userId')),
      latitude: formData.get('latitude')
        ? Number(formData.get('latitude'))
        : undefined,
      longitude: formData.get('longitude')
        ? Number(formData.get('longitude'))
        : undefined,
    };

    // FormData에 필드 추가
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          transformedFormData.append(key, JSON.stringify(value));
        } else {
          transformedFormData.append(key, String(value));
        }
      }
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/study-posts`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: transformedFormData,
      },
    );

    if (!response.ok) {
      throw new Error('스터디 글 작성 실패');
    }

    const responseData = await response.json();
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('API Route 에러:', error);
    return NextResponse.json(
      { message: '스터디 글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}
