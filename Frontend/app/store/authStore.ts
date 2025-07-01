import { create } from "zustand"

interface AuthState {
  backendAccessToken: string | null
  userId: string | null
  setToken: (token: string) => void
  setUserId: (id: string) => void
  clearAuth: () => void
}

export const useAuth = create<AuthState>((set) => ({
  backendAccessToken: null,
  userId: null,
  setToken: (token) => set({ backendAccessToken: token }),
  setUserId: (id) => set({ userId: id }),
  clearAuth: () => set({ backendAccessToken: null, userId: null }),
}))
