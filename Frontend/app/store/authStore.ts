import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthState = {
  token: string | null
  setToken: (token: string) => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: "auth-storage", // saves to localStorage
    }
  )
)
