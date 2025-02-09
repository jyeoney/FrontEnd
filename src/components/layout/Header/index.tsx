'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import CustomConfirm from '@/components/common/Confirm';
import CustomAlert from '@/components/common/Alert';
import axiosInstance from '@/utils/axios';
import handleApiError from '@/utils/handleApiError';
import useWebSocket from '@/hooks/useWebSocket';
import useNotification from '@/hooks/useNotification';
import Logo from './Logo';
import Navigation from './Navigation';
import { NAVIGATION_ITEMS } from './constants';
import { Notification } from '@/types/notification';
import NotificationModal from './NotificationModal';
import NotificationButton from './NotificationButton';

type AuthLinksProps = {
  isSignedIn: boolean;
  userInfo: any;
  onSignOut: () => void;
  activeMenu: string;
  onMenuClick: (menu: string) => void;
  onClose?: () => void;
  className?: string;
  linkClassName?: string;
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const AuthLinks = ({
  isSignedIn,
  userInfo,
  onSignOut,
  activeMenu,
  onMenuClick,
  onClose,
  className = '',
  linkClassName = '',
}: AuthLinksProps) => (
  <div className={className}>
    {isSignedIn ? (
      <>
        <Link
          href={`/mypage/${userInfo?.id}`}
          className={`btn ${linkClassName} ${activeMenu === 'mypage' ? 'btn-active' : ''}`}
          onClick={() => onMenuClick('mypage')}
        >
          마이페이지
        </Link>
        <button className={`btn ${linkClassName}`} onClick={onSignOut}>
          로그아웃
        </button>
      </>
    ) : (
      <>
        <Link
          href="/signin"
          className={`btn ${linkClassName}`}
          onClick={() => {
            onMenuClick('');
            onClose?.();
          }}
        >
          로그인
        </Link>
        <Link
          href="/signup"
          className={`btn ${linkClassName}`}
          onClick={() => {
            onMenuClick('');
            onClose?.();
          }}
        >
          회원가입
        </Link>
      </>
    )}
  </div>
);

const MobileMenu = ({ isOpen, onClose, children }: MobileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div ref={menuRef} className="w-2/3 max-w-xs bg-white h-full p-6">
        <button
          className="btn btn-ghost"
          onClick={onClose}
          aria-label="메뉴 닫기"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const Header = () => {
  const { isSignedIn, setIsSignedIn, userInfo, resetStore } = useAuthStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => () => {},
  );
  const [, setIsLoading] = useState(true);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('');

  const [userId, setUserId] = useState<number | null>(null);
  const {
    updateNotificationCache,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    unreadCount,
  } = useNotification(userId || 0);
  const { connect, disconnect } = useWebSocket(userId || 0);
  const { notifications }: { notifications: Notification[] } = useNotification(
    userId || 0,
  );
  const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const storedSignedIn = useAuthStore.getState().isSignedIn;
    console.log('로그인 상태는', storedSignedIn);
    setIsSignedIn(storedSignedIn);
    setIsLoading(false);
  }, [setIsSignedIn]);

  useEffect(() => {
    console.log('userInfo는', userInfo);
    console.log(`닉네임: ${userInfo?.nickname}`);
    console.log(`profileImageUrl: ${userInfo?.profileImageUrl}`);
  }, [userInfo]);

  useEffect(() => {
    if (isSignedIn && userInfo?.id && userInfo?.id > 0) {
      setUserId(userInfo.id);
      connect();
    } else {
      setUserId(null);
      disconnect();
    }
  }, [isSignedIn, userInfo, connect, disconnect, notifications]);

  useEffect(() => {
    console.log('Header에서 notifications 상태 변경 감지:', notifications);
  }, [notifications]);

  // pathname이 변경될 때마다 현재 활성화된 메뉴 설정
  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0);
      document.body.style.overflow = 'auto';
    };

    // pathname이 변경될 때마다 스크롤 처리
    handleRouteChange();

    if (pathname === '/') {
      setActiveMenu('');
    } else if (pathname.includes('/community/study')) {
      setActiveMenu('study');
    } else if (pathname.includes('/community/info')) {
      setActiveMenu('info');
    } else if (pathname.includes('/community/qna')) {
      setActiveMenu('qna');
    } else if (pathname.includes('/community/ranking')) {
      setActiveMenu('ranking');
    } else if (pathname.includes('/mypage')) {
      setActiveMenu('mypage');
    }
  }, [pathname]);

  const toggleNotificationModal = () => {
    setNotificationModalOpen(prev => !prev);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setIsNavOpen(false);
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);
  };

  const showSignOutConfirm = () => {
    setConfirmMessage('로그아웃 하시겠습니까?');
    setOnConfirmCallback(() => handleSignOutClick);
    setShowConfirm(true);
  };

  const showErrorAlert = (errorMessage: string | null) => {
    setAlertMessage(
      errorMessage ||
        '로그아웃에 실패했습니다. 잠시 후 다시 시도해 주세요. 잠시 후 다시 시도해 주세요.',
    );
    setShowAlert(true);
  };

  const handleNotificationUpdate = (updatedNotifications: Notification[]) => {
    updateNotificationCache(() => updatedNotifications);
  };

  const handleSignOutClick = async () => {
    try {
      const response = await axiosInstance.post(
        `${process.env.NEXT_PUBLIC_API_ROUTE_URL}/auth/sign-out`,
        {},
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (response.status === 200) {
        resetStore();
        disconnect();
        setUserId(null);
        router.push('/');
        setAlertMessage('로그아웃이 완료되었습니다.');
        setShowAlert(true);
      } else {
        setAlertMessage('액세스 토큰이 없어 로그아웃을 할 수 없습니다.');
        setShowAlert(true);
      }
    } catch (error: any) {
      handleApiError(error, showErrorAlert);
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <header className="navbar bg-base-100 shadow-md fixed w-full z-40">
      <div className="navbar-start">
        <Logo />
      </div>

      <div className="navbar-center hidden lg:block">
        <Navigation
          items={NAVIGATION_ITEMS}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          className="join"
          itemClassName="join-item"
        />
      </div>

      <div className="navbar-end hidden lg:flex space-x-2">
        {isSignedIn && (
          <NotificationButton
            count={unreadCount}
            onClick={toggleNotificationModal}
            isActive={isNotificationModalOpen}
          />
        )}
        <AuthLinks
          isSignedIn={isSignedIn}
          userInfo={userInfo}
          onSignOut={showSignOutConfirm}
          activeMenu={activeMenu}
          onMenuClick={handleMenuClick}
          className="flex space-x-2"
          linkClassName="btn-ghost"
        />
      </div>

      {/* 모바일 네브바 */}
      <div className="navbar-end lg:hidden">
        {isSignedIn && (
          <NotificationButton
            count={unreadCount}
            onClick={toggleNotificationModal}
            isActive={isNotificationModalOpen}
          />
        )}
        <button
          className="btn btn-ghost"
          onClick={toggleNav}
          aria-label={isNavOpen ? '메뉴 닫기' : '메뉴 열기'}
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

      <MobileMenu isOpen={isNavOpen} onClose={toggleNav}>
        <div className="flex flex-col mt-8 space-y-4">
          <Navigation
            items={NAVIGATION_ITEMS}
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            className="flex flex-col space-y-4"
          />
          <div className="border-t border-gray-200 my-4" />
          <AuthLinks
            isSignedIn={isSignedIn}
            userInfo={userInfo}
            onSignOut={showSignOutConfirm}
            activeMenu={activeMenu}
            onMenuClick={handleMenuClick}
            className="flex flex-col space-y-4"
          />
        </div>
      </MobileMenu>

      {isNotificationModalOpen && (
        <NotificationModal
          notifications={notifications}
          onUpdateNotifications={handleNotificationUpdate}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onClose={toggleNotificationModal}
        />
      )}

      {showConfirm && (
        <CustomConfirm
          message={confirmMessage}
          onConfirm={onConfirmCallback}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {showAlert && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
    </header>
  );
};

export default Header;
