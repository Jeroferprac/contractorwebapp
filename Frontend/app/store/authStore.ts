import { create } from 'zustand';

interface AuthState {
  userId: string | null;
  backendToken: string | null;
  hydrated: boolean;
}

interface AuthActions {
  setToken: (token: string) => void;
  setUserId: (userId: string) => void;
  clearAuth: () => void;
  hydrate: (token: string, userId: string) => void;
  getToken: () => string | null;
}

export const useAuth = create<AuthState & AuthActions>((set, get) => ({
  userId: null,
  backendToken: null,
  hydrated: false,

  setToken: (token) => set({ backendToken: token }),
  setUserId: (userId) => set({ userId }),
  clearAuth: () => set({ backendToken: null, userId: null }),
  hydrate: (token, userId) => 
    set({ backendToken: token, userId, hydrated: true }), // 👈 sync both
  getToken: () => {
    const state = get();
    return state.backendToken;
  },
}));