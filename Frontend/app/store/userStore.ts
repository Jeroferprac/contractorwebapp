// store/userStore.ts

import { create } from "zustand"

type User = {
  id: string
  email: string
  full_name: string
  phone?: string
  country?: string
  role: "company" | "contractor" | "admin"
  avatar_url?: string
}

type UserState = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))