"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/store/authStore"
import { API } from "@/lib/api"

export default function AuthCallbackPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { setToken } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = params.get("code")
      if (!code) return toast.error("No OAuth code found")

      try {
        const res = await fetch(`${API.OAUTH_CALLBACK("github")}?code=${code}`)
        const data = await res.json()

        if (!res.ok) {
          toast.error(data.message || "OAuth callback failed")
          return
        }

        setToken(data.access_token)
        toast.success("✅ Logged in with GitHub")
        router.push("/dashboard")
      } catch (error) {
        console.error(error)
        toast.error("⚠️ OAuth login failed")
      }
    }

    handleOAuthCallback()
  }, [params])

  return <p className="text-center mt-10">Processing GitHub login...</p>
}
