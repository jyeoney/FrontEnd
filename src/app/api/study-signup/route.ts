import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const studyPostId = req.nextUrl.searchParams.get('studyPostId');
    const status = req.nextUrl.searchParams.get('status');

    if (!studyPostId) {
      return NextResponse.json(
        { message: '스터디 ID가 필요합니다.' },
        { status: 400 },
      );
    }

    const response = await axios.get(
      `${process.env.API_URL}/study-signup?studyPostId=${studyPostId}${
        status ? `&status=${status}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('스터디 신청 목록 조회 실패:', error);
    return NextResponse.json(
      { message: '스터디 신청 목록 조회에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);

    const response = await axios.post(
      `${process.env.API_URL}/study-signup`,
      {
        studyPostId: Number(body.studyPostId),
        userId: Number(body.userId),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const applicationData = response.data;
    const formattedResponse = {
      signupId: applicationData.signupId,
      user: {
        id: applicationData.user.id,
        nickname: applicationData.user.nickname,
        email: applicationData.user.email,
        profileImageUrl: applicationData.user.profileImageUrl,
        isActive: applicationData.user.isActive,
        createdAt: applicationData.user.createdAt,
        updatedAt: applicationData.user.updatedAt,
      },
      nickName: applicationData.user.nickname,
      status: applicationData.status,
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('스터디 신청 실패:', error);
    return NextResponse.json(
      { message: '스터디 신청에 실패했습니다.' },
      { status: 500 },
    );
  }
}
