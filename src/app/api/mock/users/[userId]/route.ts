import { NextRequest, NextResponse } from 'next/server';

let mockUserInfo = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testUser',
  profileImageUrl: '/default-profile-image.png',
};

export const PUT = async (req: NextRequest) => {
  const { nickname } = await req.json();

  if (nickname && typeof nickname === 'string' && nickname.trim()) {
    mockUserInfo = {
      ...mockUserInfo,
      nickname,
    };
  }
  return NextResponse.json({
    message: '닉네임이 수정되었습니다.',
    mockUserInfo,
  });
};
