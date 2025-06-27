"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import DashboardClient from "./DashboardClient";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return <DashboardClient session={session} />;
}
