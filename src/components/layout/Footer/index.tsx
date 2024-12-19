import React from 'react';

export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>Copyright © 2024 - All rights reserved by DevOnOff</p>
        <div className="flex gap-4">
          <div>이용약관</div>
          <div>개인정보처리방침</div>
        </div>
      </div>
    </footer>
  );
}
