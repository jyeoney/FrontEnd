// app/api/users/update-profile-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
// import formidable, { Fields, File, IncomingForm } from 'formidable'; // form-data를 처리하기 위한 라이브러리
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false,
  },
};

export const PATCH = async (req: NextRequest) => {
  try {
    const response = await axios.patch(
      `${process.env.API_BASE_URL}/users/update-profile-image`,
      req.body,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200) {
      const { profileImageUrl } = response.data;
      return NextResponse.json(
        { profileImageUrl },
        { status: response.status },
      );
    }
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;
      return NextResponse.json(data, { status });
    }

    // 네트워크 오류 처리
    return NextResponse.json(
      { message: '네트워크 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
};
// import { NextRequest, NextResponse } from 'next/server';
// import axios from 'axios';

// // FormData를 사용하여 요청을 처리
// export const config = {
//   api: {
//     bodyParser: false, // bodyParser를 false로 설정하여 파일 업로드를 처리
//   },
// };

// export const PATCH = async (req: NextRequest) => {
//   try {
//     if (!req.body) {
//       return NextResponse.json(
//         { message: 'No body in request.' },
//         { status: 400 }
//       );
//     }

//     const chunks: Uint8Array[] = [];

//     // 스트림을 읽고 Buffer로 변환하는 처리
//     const reader = req.body.getReader();
//     const decoder = new TextDecoder();
//     let done = false;
//     let value: Uint8Array | undefined;

//     while (!done) {
//       const result = await reader.read();
//       done = result.done;
//       value = result.value;

//       // value가 undefined가 아닌 경우에만 chunks에 추가
//       if (value) {
//         chunks.push(value);
//       }
//     }

//     // 읽은 데이터를 Buffer로 합침
//     const buffer = Buffer.concat(chunks);

//     // Buffer를 Blob으로 변환
//     const blob = new Blob([buffer], { type: 'image/jpeg' }); // 적절한 MIME 타입 설정

//     // FormData에 Blob을 추가
//     const formData = new FormData();
//     formData.append('profileImage', blob, 'profile-image.jpg');

//     const backendResponse = await axios.patch(
//       `${process.env.BACKEND_API_URL}/users/update-profile-image`, // 백엔드 API 경로
//       formData,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Content-Type 설정
//         },
//       }
//     );

//     if (backendResponse.status === 200) {
//       const { profileImageUrl } = backendResponse.data;
//       return NextResponse.json({ profileImageUrl });
//     } else {
//       return NextResponse.json(
//         { message: '백엔드 서버에서 오류가 발생했습니다.' },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error('Error:', error);
//     return NextResponse.json(
//       { message: '이미지 처리 중 오류가 발생했습니다.' },
//       { status: 500 }
//     );
//   }
// };
