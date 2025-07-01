"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import DashboardClient from "./DashboardClient"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  console.log("💡 Session in Dashboard:", session)
  console.log("🔐 Backend token:", session?.backendAccessToken)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  return <DashboardClient session={session} />
}
