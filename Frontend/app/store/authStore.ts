import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  backendAccessToken: string | null;
  userId: string | null;
  setToken: (token: string) => void;
  setUserId: (id: string) => void;
  clearAuth: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      backendAccessToken: null,
      userId: null,
      setToken: (token) => set({ backendAccessToken: token }),
      setUserId: (id) => set({ userId: id }),
      clearAuth: () => set({ backendAccessToken: null, userId: null }),
    }),
    { name: "auth-storage" }
  )
);
