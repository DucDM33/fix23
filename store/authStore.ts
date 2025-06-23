import { create } from 'zustand';

interface User {
  id: number;
  fullName: string;
  avatar: string | null;
  role: string;
  rank: string;
  balance: number;
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  logout: () => void;
  updateUserFields: (fields: Partial<User>) => void;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  setUser: (user) =>
    set({
      user,
      token: user.refreshToken, 
    }),
    updateUserFields: (fields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...fields } : null,
    })),

  logout: () =>
    set({
      user: null,
      token: null,
    }),
}));
