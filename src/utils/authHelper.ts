import axios from 'axios';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { setCookie } from './cookies';

/**
 * @param res - NextResponse 객체
 * @param accessToken - 액세스 토큰
 * @param refreshToken - 리프레시 토큰
 * @param apiUrl - 백엔드 API URL (기본값은 환경변수로 설정)
 */

export const handleUserInfo = async (
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
  apiUrl: string,
) => {
  try {
    // 1. JWT payload에서 userId(sub) 추출
    const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;
    if (!decodedAccessToken || !decodedAccessToken.sub) {
      throw new Error('액세스토큰에서 userId(sub)를 추출할 수 없습니다.');
    }

    const userId = decodedAccessToken.sub;
    console.log('기간:', decodedAccessToken.exp);
    console.log('API URL:', apiUrl);

    // 2. 회원 정보 조회 요청
    const userResponse = await axios.get(`${apiUrl}/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.data) {
      throw new Error('사용자 정보 조회에 실패했습니다.');
    }

    const { id, nickname, email, profileImageUrl, signinType } =
      userResponse.data; // 필요한 필드만 추출
    const userInfo = { id, nickname, email, profileImageUrl, signinType };

    // 3. 쿠키 설정
    const currentTime = Math.trunc(Date.now() / 1000);
    const bufferTime = 10;

    if (!decodedAccessToken.exp) {
      throw new Error('액세스토큰 exp 클레임이 없습니다.');
    }

    const accessTokenMaxAge = Math.max(
      decodedAccessToken.exp - currentTime - bufferTime,
      0,
    );

    const decodedRefreshToken = jwt.decode(refreshToken) as jwt.JwtPayload;
    if (!decodedRefreshToken || !decodedRefreshToken.exp) {
      throw new Error('리프레시토큰 exp 클레임이 없습니다.');
    }

    const refreshTokenMaxAge = Math.max(
      decodedRefreshToken.exp - currentTime - bufferTime,
      0,
    );

    // 쿠키 설정
    setCookie(res, 'accessToken', accessToken, accessTokenMaxAge);
    setCookie(res, 'refreshToken', refreshToken, refreshTokenMaxAge);
    console.log(res.cookies.getAll());

    return { userInfo };
  } catch (error: any) {
    // console.error('회원 정보 조회 오류:', error);
    // throw error;
    if (error.response) {
      console.error('API Error:', error.response.data);
      console.error('API Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error Message:', error.message);
    }
    throw error;
  }
};
