'use client';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const KakaoCallbackPage = () => {
  const params = useParams();
  const code = params.code;
  const router = useRouter();
  const { setIsSignedIn, setUserInfo } = useAuthStore();

  useEffect(() => {
    const sendKakaoAuthCode = async () => {
      if (!code) {
        alert('카카오 인증 코드가 없습니다.');
        router.push('/signin');
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/auth/sign-in/kakao`,
          {
            code,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200 && response.data.userInfo) {
          setIsSignedIn(true);
          setUserInfo(response.data.userInfo);

          console.log('현재 사용자 정보: ', response.data.userInfo);
          console.log('현재 로그인 상태: ', true);

          router.push('/community/study');
        }
      } catch (error: any) {
        if (error.response) {
          const { status, data } = error.response;
          const errorCode = data?.errorCode;
          const message =
            data?.message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';

          if (status === 500 && errorCode === 'INTERNAL_SERVER_ERROR') {
            alert(message);
          } else {
            alert('카카오 로그인에 실패했습니다. 다시 시도해 주세요.');
          }
        } else {
          alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.');
        }
      }
    };

    sendKakaoAuthCode();
  }, [code]);

  // 이 컴포넌트는 실제 UI를 렌더링하지 않음
  return null;
};

export default KakaoCallbackPage;
