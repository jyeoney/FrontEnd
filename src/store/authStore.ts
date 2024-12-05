import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  resetStore: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isSignedIn: false,
      userInfo: null,
      setIsSignedIn: status => set(() => ({ isSignedIn: status })),
      setUserInfo: info => set(() => ({ userInfo: info })),
      resetStore: () => set(() => ({ isSignedIn: false, userInfo: null })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
