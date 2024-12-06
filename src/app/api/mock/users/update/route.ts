import { NextRequest, NextResponse } from 'next/server';

let mockUserInfo = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testUser',
  profileImageUrl: 'https://via.placeholder.com/150',
};

export const PATCH = async (req: NextRequest) => {
  const { nickname } = await req.json();

  if (nickname && typeof nickname === 'string' && nickname.trim()) {
    mockUserInfo = {
      ...mockUserInfo,
      nickname, // 수정된 닉네임으로 업데이트
    };
  }
  return NextResponse.json({
    message: '닉네임이 수정되었습니다.',
    userInfo: mockUserInfo,
  });
};
