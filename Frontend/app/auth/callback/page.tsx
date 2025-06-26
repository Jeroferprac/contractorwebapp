"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/store/authStore"

export default function AuthCallbackPage() {
  const router = useRouter()
  const { setToken } = useAuth()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    if (token) {
      setToken(token)
      toast.success("✅ Logged in with GitHub")
      router.push("/dashboard")
    } else {
      toast.error("❌ GitHub login failed")
      router.push("/login")
    }
  }, [])

  return <p className="text-center mt-20">Processing GitHub login...</p>
}
