import { create } from "zustand";
import { API } from "@/lib/api";
import { getSession } from "next-auth/react";

interface UserProfile {
  avatar?: string;
  name?: string;
  role?: string; // <-- Add this line
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
    const session = await getSession();
    if (!session?.backendAccessToken) return;
    const res = await fetch(API.PROFILE, {
      headers: {
        Authorization: `Bearer ${session.backendAccessToken}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      // Build data URL if avatar_data and avatar_mimetype are present
      if (data.avatar_data && data.avatar_mimetype) {
        data.avatar = `data:${data.avatar_mimetype};base64,${data.avatar_data}`;
      }
      set({ userProfile: data });
    }
  },
})); 