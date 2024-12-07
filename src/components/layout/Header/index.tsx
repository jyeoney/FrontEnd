'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type HeaderProps = {
  initialSignedIn: boolean;
};

const Header = ({ initialSignedIn }: HeaderProps) => {
  const { isSignedIn, setIsSignedIn, setUserInfo, userInfo, resetStore } =
    useAuthStore();
  const [isNavOpen, setIsNavOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // 초기 로그인 상태를 클라이언트 상태로 설정
  useEffect(() => {
    setIsSignedIn(initialSignedIn);

    // if (initialSignedIn) {
    //   const mockUserInfo = {
    //     id: 1,
    //     nickname: 'testuser',
    //     email: 'test@example.com',
    //     profileImageUrl: 'https://via.placeholder.com/150',
    //   };
    //   setUserInfo(mockUserInfo);
    // } else {
    //   setUserInfo(null);
    // }
  }, [initialSignedIn, setIsSignedIn, setUserInfo]);

  useEffect(() => {
    console.log(`userInfo는: ${userInfo?.nickname}`);
  }, [userInfo]);

  const isActive = (path: string) => {
    return pathname === path ? 'btn-active' : '';
  };

  const handleSignOutClick = async () => {
    const isConfirmed = window.confirm('로그아웃 하시겠습니까?');
    if (isConfirmed) {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/auth/sign-out`,
          {},
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );
        if (response.status === 200) {
          // 로그아웃 후 상태 변경
          resetStore();
          router.push('/');
          alert('로그아웃이 완료되었습니다.');
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
    } else {
      alert('로그아웃이 취소되었습니다.');
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl text-base-content">
          DevOff
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
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

      <div className="navbar-end lg:hidden">
        <button
          className="btn btn-ghost text-base-content"
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className={`navbar-end ${isNavOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="flex flex-col items-center space-y-2">
          <Link
            href="/community/study"
            className={`btn ${isActive('/community/study')}`}
          >
            스터디
          </Link>
          <Link
            href="/community/info"
            className={`btn ${isActive('/community/info')}`}
          >
            정보공유
          </Link>
          <Link
            href="/community/qna"
            className={`btn ${isActive('/community/qna')}`}
          >
            Q&A
          </Link>
          <Link href="/studyroom" className={`btn ${isActive('/studyroom')}`}>
            스터디룸
          </Link>
          <Link href="/chat/1" className={`btn ${isActive('/chat/1')}`}>
            채팅
          </Link>
        </div>
      </div>

      <div className="navbar-end hidden lg:flex">
        {isSignedIn ? (
          <>
            <Link href={`/mypage/${userInfo?.id}`} className="btn btn-ghost">
              마이페이지
            </Link>
            <button
              className="btn btn-ghost text-base-content"
              onClick={handleSignOutClick}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link href="/signin" className="btn btn-ghost text-base-content">
              로그인
            </Link>
            <Link href="/signup" className="btn btn-ghost text-base-content">
              회원가입
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
