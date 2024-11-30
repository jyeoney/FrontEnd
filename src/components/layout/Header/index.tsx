'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'btn-active' : '';
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
        <Link href="/mypage/1" className="btn btn-ghost text-white">
          마이페이지
        </Link>
        <Link href="/signin" className="btn btn-ghost text-white">
          로그인
        </Link>
        <Link href="/signup" className="btn btn-ghost text-white">
          회원가입
        </Link>
      </div>
    </header>
  );
}
