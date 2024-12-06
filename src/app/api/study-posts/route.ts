import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('요청 바디:', body);
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

    if (!process.env.NEXT_PUBLIC_API_URL) {
      throw new Error('API URL이 설정되지 않았습니다.');
    }

    const transformedBody = {
      title: body.title,
      studyName: body.studyName,
      subject: body.subject,
      difficulty: body.difficulty,
      dayType: body.dayType,
      startDate: body.startDate,
      endDate: body.endDate,
      startTime: body.startTime,
      endTime: body.endTime,
      meetingType: body.meetingType,
      recruitmentPeriod: body.recruitmentPeriod,
      description: body.description,
      latitude: body.latitude,
      longitude: body.longitude,
      maxParticipants: body.maxParticipants,
      userId: body.userId,
    };

    console.log('변환된 바디:', transformedBody);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/study-posts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedBody),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('백엔드 에러:', errorData);
      throw new Error(errorData.message || '백엔드 요청 실패');
    }

    const data = await response.json();
    console.log('백엔드 응답:', data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('상세 에러:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: '스터디 글 작성에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page');
  const size = searchParams.get('size');
  const searchTitle = searchParams.get('searchTitle');
  const meetingType = searchParams.get('meeting_type');

  try {
    const response = await fetch(
      `${process.env.API_BASE_URL}/study-posts/search?page=${page}&size=${size}&searchTitle=${searchTitle}&meeting_type=${meetingType}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('스터디 목록 조회 실패:', error);
    return NextResponse.json(
      { message: '스터디 목록 조회에 실패했습니다.' },
      { status: 500 },
    );
  }
}
