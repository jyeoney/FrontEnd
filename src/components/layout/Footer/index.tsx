import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>Copyright © 2024 - All rights reserved by DevOnOff</p>
        <div className="flex gap-4">
          <Link href="/terms">이용약관</Link>
          <Link href="/privacy">개인정보처리방침</Link>
        </div>
      </div>
    </footer>
  );
}