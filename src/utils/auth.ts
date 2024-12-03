import jwt from 'jsonwebtoken';

export async function getAuthStatus(cookies: string | null) {
  if (!cookies) return false; // 쿠키가 없으면 로그인하지 않은 상태

  // 쿠키에서 accessToken을 추출
  const accessToken = cookies.match(/accessToken=([^;]+)/)?.[1];

  if (!accessToken) return false; // 액세스토큰이 없으면 로그인하지 않은 상태

  try {
    // JWT 검증 (JWT_SECRET은 환경변수에 저장)
    jwt.verify(accessToken, process.env.JWT_SECRET!);
    return true; // 인증된 사용자
  } catch (error) {
    return false; // 인증 실패
  }
}
