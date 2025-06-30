// store/authStore.ts
import { create } from "zustand"

type User = {
  id?: string
  email: string
  full_name: string
  role: string
  phone?: string
  profile_picture?: string
}

type AuthState = {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  token:
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null,
  user: null,

  setToken: (token) => {
    localStorage.setItem("token", token)
    set({ token })
  },

  setUser: (user) => {
    set({ user })
  },

  logout: () => {
    localStorage.removeItem("token")
    set({ token: null, user: null })
  },
}))
