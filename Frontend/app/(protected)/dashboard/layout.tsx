"use client"
import { useAuth } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Sidebar from "@/components/layout/sidebar"
import Navbar from "@/components/layout/navbar"
import Link from "next/link"

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
          <Link href="/dashboard" className="block hover:underline">Dashboard</Link>
          <Link href="/quotes" className="block hover:underline">Quotes</Link>
          <Link href="/clients" className="block hover:underline">Clients</Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:underline text-red-300 mt-4"
          >
            Logout
          </button>
        </nav>
      </aside>

      <section className="flex-1 bg-gray-50 p-6">
        <header className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <span className="text-sm text-gray-600">
            {token ? "✅ Logged In" : "❌ Not Logged In"}
          </span>
        </header>
        {children}</section>
    </main>
  )
}
