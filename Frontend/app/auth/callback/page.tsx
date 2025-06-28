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
      console.log("OAuth code from URL:", code)

      if (!code) {
        toast.error("No OAuth code found")
        return
      }

      const redirectUri = `${window.location.origin}/auth/callback`
      console.log("Redirect URI being sent:", redirectUri)

      try {
        const url = `${API.OAUTH_CALLBACK("github")}?code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`
        console.log("Calling backend callback URL:", url)

        const res = await fetch(url)
        const data = await res.json()

        console.log("Backend callback response:", data)

        if (!res.ok) {
          toast.error(data.message || "OAuth callback failed")
          return
        }

        setToken(data.access_token)
        toast.success("✅ Logged in with GitHub")
        router.push("/dashboard")
      } catch (error) {
        console.error("Error during OAuth callback:", error)
        toast.error("⚠️ OAuth login failed")
      }
    }

    handleOAuthCallback()
  }, [params])

  return <p className="text-center mt-10">Processing GitHub login...</p>
}
