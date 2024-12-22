import { Suspense } from 'react';
import NaverCallbackClient from '../components/NaverCallbackClient';

const NaverCallbackPage = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <NaverCallbackClient />
    </Suspense>
  );
};

export default NaverCallbackPage;
