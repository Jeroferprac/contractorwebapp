import { create } from "zustand"

interface AuthState {
  backendAccessToken: string | null
  userId: string | null
  setToken: (token: string) => void
  setUserId: (id: string) => void
  clearAuth: () => void
}

export const useAuth = create<AuthState>((set) => {
  const savedToken =
    typeof window !== "undefined" ? localStorage.getItem("backendAccessToken") : null
  const savedUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null

  return {
    backendAccessToken: savedToken,
    userId: savedUserId,

    setToken: (token) => {
      localStorage.setItem("backendAccessToken", token)
      set({ backendAccessToken: token })
    },

    setUserId: (id) => {
      localStorage.setItem("userId", id)
      set({ userId: id })
    },

    clearAuth: () => {
      localStorage.removeItem("backendAccessToken")
      localStorage.removeItem("userId")
      set({ backendAccessToken: null, userId: null })
    },
  }
})
