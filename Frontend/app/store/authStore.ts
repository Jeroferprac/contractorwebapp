import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  backendAccessToken: string | null
  userId: string | null
  hydrated: boolean
  setToken: (token: string) => void
  setUserId: (id: string) => void
  clearAuth: () => void
  setHydrated: () => void
  syncSession: (token: string, userId: string) => void; // 👈 add this

}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      backendAccessToken: null,
      userId: null,
      hydrated: false,
      setToken: (token) => set({ backendAccessToken: token }),
      setUserId: (id) => set({ userId: id }),
      clearAuth: () => set({ backendAccessToken: null, userId: null }),
      setHydrated: () => set({ hydrated: true }),
      syncSession: (token, userId) =>
        set({ backendAccessToken: token, userId, hydrated: true }), // 👈 sync both
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        backendAccessToken: state.backendAccessToken,
        userId: state.userId,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
)