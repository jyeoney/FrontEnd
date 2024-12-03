'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type HeaderProps = {
  initialSignedIn: boolean;
};
const Header = ({ initialSignedIn }: HeaderProps) => {
  const { isSignedIn, setIsSignedIn } = useAuthStore();

  const pathname = usePathname();
  const router = useRouter();

  // 초기 로그인 상태를 클라이언트 상태로 설정
  useEffect(() => {
    setIsSignedIn(initialSignedIn);
  }, [initialSignedIn, setIsSignedIn]);

  const isActive = (path: string) => {
    return pathname === path ? 'btn-active' : '';
  };

  const handleSignOutClick = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/mock/auth/signout`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 200) {
        // 로그아웃 후 상태 변경
        setIsSignedIn(false);
        router.push('/');
      }
    } catch (error: any) {
      const { status, data } = error.response;
      const errorCode = data?.errorCode;
      const message =
        data?.message || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      if (error.response) {
        if (status === 400) {
          alert('로그아웃에 실패했습니다. 다시 시도해 주세요.');
        } else if (status === 403) {
          alert('사용자를 찾을 수 없습니다.');
        } else {
          alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해 주세요.');
      }
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl text-white">
          DevOff
        </Link>
      </div>
      <div className="navbar-center">
        <div className="join">
          <Link
            href="/community/study"
            className={`btn join-item ${isActive('/community/study')}`}
          >
            스터디
          </Link>
          <Link
            href="/community/info"
            className={`btn join-item ${isActive('/community/info')}`}
          >
            정보공유
          </Link>
          <Link
            href="/community/qna"
            className={`btn join-item ${isActive('/community/qna')}`}
          >
            Q&A
          </Link>
          <Link
            href="/studyroom"
            className={`btn join-item ${isActive('/studyroom')}`}
          >
            스터디룸
          </Link>
          <Link
            href="/chat/1"
            className={`btn join-item ${isActive('/chat/1')}`}
          >
            채팅
          </Link>
        </div>
      </div>
      <div className="navbar-end">
        {isSignedIn ? (
          <>
            <Link href="/mypage/1" className="btn btn-ghost text-white">
              마이페이지
            </Link>
            <button
              className="btn btn-ghost text-white"
              onClick={handleSignOutClick}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="btn btn-ghost text-white">
              로그인
            </Link>
            <Link href="/signup" className="btn btn-ghost text-white">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
