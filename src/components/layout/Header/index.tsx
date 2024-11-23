import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          DevOnOff
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><Link href="/study">스터디</Link></li>
          <li><Link href="/chat">채팅</Link></li>
          <li><Link href="/profile">프로필</Link></li>
        </ul>
      </div>
    </header>
  );
}