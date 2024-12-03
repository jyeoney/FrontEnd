import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isSignedIn: boolean;
  signin: (accessToekn: string, refreshToken: string) => void;
  signout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  accessToken: null,
  refreshToken: null,
  isSignedIn: false,
  signin: (accessToken: string, refreshToken: string) => {
    set({ accessToken, refreshToken, isSignedIn: true });
  },
  signout: () => {
    set({ accessToken: null, refreshToken: null, isSignedIn: false });
  },
}));
