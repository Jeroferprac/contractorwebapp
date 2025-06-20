"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/store/authStore"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!token) {
      router.push("/login")
    }
  }, [token])

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 hidden md:block">
        <h2 className="text-xl font-bold mb-4">ContractorHub</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block hover:underline">Dashboard</a>
          <a href="/quotes" className="block hover:underline">Quotes</a>
          <a href="/clients" className="block hover:underline">Clients</a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 bg-gray-50 p-6">{children}</section>
    </main>
  )
}
