"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useSession } from "next-auth/react";
import { API } from "@/lib/api";

export function UserSyncer() {
  const { data: session } = useSession();
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (!session?.backendAccessToken) return;
    fetch(API.PROFILE, {
      headers: { Authorization: `Bearer ${session.backendAccessToken}` },
    })
      .then((res) => res.json())
      .then((user) => setUser(user));
  }, [session, setUser]);

  return null;
}
