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
// "use client"

// import { useAuth } from "@/store/authStore"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"

// export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
//   const { token } = useAuth()
//   const router = useRouter()
//   const [checked, setChecked] = useState(false)

//   useEffect(() => {
//     if (!token) {
//       router.push("/login")
//     } else {
//       setChecked(true)
//     }
//   }, [token])

//   return checked ? <>{children}</> : null
// }
