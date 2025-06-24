export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// "use client"

// import { useEffect } from "react"
// import { useAuth } from "@/store/authStore"

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   const { token } = useAuth()

//   useEffect(() => {
//     console.log("🔐 Token is:", token)
//     // for debugging, now accessible in browser console
//   }, [token])

//   return <>{children}</>
// }
