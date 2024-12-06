import { NextRequest, NextResponse } from 'next/server';

let mockUserInfo = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testUser',
  profileImageUrl: 'https://via.placeholder.com/150',
};

export const PATCH = async (req: NextRequest) => {
  const { profileImageUrl } = await req.json();

  if (profileImageUrl === null || profileImageUrl === '') {
    mockUserInfo = {
      ...mockUserInfo,
      profileImageUrl: '',
    };
  }
  return NextResponse.json({
    message: '프로필 이미지가 삭제되었습니다.',
    userInfo: mockUserInfo,
  });
};
