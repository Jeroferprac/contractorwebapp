// lib/hooks/useUser.ts
import { useEffect, useState } from "react"

export function useUser(token: string | null) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) return

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        if (res.ok) setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [token])

  return user
}
