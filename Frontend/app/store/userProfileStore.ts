import { create } from "zustand";

interface UserProfile {
  avatar?: string;
  name?: string;
  // Add other fields as needed
}

interface UserProfileState {
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile) => void;
  fetchUserProfile: () => Promise<void>;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  userProfile: null,
  setUserProfile: (profile) => set({ userProfile: profile }),
  fetchUserProfile: async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      if (data.avatar_url) {
        data.avatar = data.avatar_url + "?v=" + Date.now();
      }
      set({ userProfile: data });
    }
  },
})); 