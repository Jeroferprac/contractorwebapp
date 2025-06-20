"use client"
import { useAuth } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <main className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-4">ContractorHub</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block hover:underline">Dashboard</a>
          <a href="/quotes" className="block hover:underline">Quotes</a>
          <a href="/clients" className="block hover:underline">Clients</a>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:underline text-red-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      <section className="flex-1 bg-gray-50 p-6">{children}</section>
    </main>
  )
}
