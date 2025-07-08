"use client"

import { useSession } from "next-auth/react"
import DashboardClient from "./DashboardClient"

export default function DashboardPage() {
  const { data: session } = useSession();
  return <DashboardClient session={session} />;
}