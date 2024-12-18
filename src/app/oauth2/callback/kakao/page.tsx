import { Suspense } from 'react';
import KakaoCallbackClient from '../components/KakaoCallbackClient';

const KakaoCallbackPage = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <KakaoCallbackClient />
    </Suspense>
  );
};

export default KakaoCallbackPage;
