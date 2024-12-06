import { NextRequest, NextResponse } from 'next/server';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

let mockUserInfo = {
  id: 1,
  email: 'test@example.com',
  nickname: 'testUser',
  profileImageUrl: '/default-profile-image.png',
};

// 파일을 서버의 임시 디렉토리에 저장하고 URL 반환
const saveMockFile = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

  const uploadDir = path.dirname(filePath);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Blob에서 ArrayBuffer를 읽어서 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  return `/uploads/${fileName}`;
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const profileImage = formData.get('profileImage');

  if (!profileImage || !(profileImage instanceof File)) {
    return NextResponse.json(
      { message: '프로필 이미지 파일이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  try {
    const profileImageUrl = await saveMockFile(profileImage);

    return NextResponse.json({
      profileImageUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { message: '프로필 이미지 처리 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  mockUserInfo = {
    ...mockUserInfo,
    profileImageUrl: '/default-profile-image.png',
  };
  return NextResponse.json({
    message: '프로필 이미지가 삭제되었습니다.',
    profileImageUrl: mockUserInfo.profileImageUrl,
  });
};
