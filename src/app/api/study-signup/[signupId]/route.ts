import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const signupId = request.nextUrl.pathname.split('/')[3];

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const status = request.nextUrl.searchParams.get('newStatus');

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: '잘못된 상태값입니다.' },
        { status: 400 },
      );
    }

    const response = await axios.patch(
      `${process.env.API_URL}/study-signup/${signupId}?newStatus=${status}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('신청 상태 변경 실패:', error);
    return NextResponse.json(
      { message: '신청 상태 변경에 실패했습니다.' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const signupId = request.nextUrl.pathname.split('/')[3];

  if (!accessToken) {
    return NextResponse.json(
      { message: '인증이 필요합니다.' },
      { status: 401 },
    );
  }

  try {
    const response = await axios.delete(
      `${process.env.API_URL}/study-signup/${signupId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('스터디 신청 취소 실패:', error);
    return NextResponse.json(
      { message: '스터디 신청 취소에 실패했습니다.' },
      { status: 500 },
    );
  }
}
