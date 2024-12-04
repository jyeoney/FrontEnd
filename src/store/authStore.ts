import { create } from 'zustand';

type UserInfo = {
  id: number;
  nickname: string;
  email: string;
  profileImageUrl: string;
};

type AuthState = {
  isSignedIn: boolean;
  setIsSignedIn: (status: boolean) => void;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  isSignedIn: false,
  userInfo: null,
  setIsSignedIn: status => set(() => ({ isSignedIn: status })),
  setUserInfo: info => set(() => ({ userInfo: info })),
}));
