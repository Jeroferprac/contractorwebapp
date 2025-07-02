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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return <DashboardClient session={session} />
}
