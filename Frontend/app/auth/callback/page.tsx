"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { API } from "@/lib/api"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const syncWithBackend = async () => {
      const code = searchParams.get("code")
      const state = searchParams.get("state")

      if (!code || !state) {
        router.replace("/login?error=MissingCode")
        return
      }

      try {
        console.log("🔁 Backend sync starting with code:", code)

        const res = await fetch(
          API.OAUTH_CALLBACK("github", code, `${window.location.origin}/auth/github/callback`)
        )

        const data = await res.json()
        console.log("✅ Backend response:", data)

        if (!res.ok) throw new Error(data?.message || "GitHub backend sync failed")

        // ✅ Now trigger GitHub sign-in again to get token into session
        await signIn("github", {
          callbackUrl: "/dashboard",
        })
      } catch (err) {
        console.error("❌ GitHub callback error:", err)
        router.replace("/login?error=CallbackFailed")
      }
    }

    syncWithBackend()
  }, [router, searchParams])

  return <p className="text-center mt-12">Signing in via GitHub...</p>
}
