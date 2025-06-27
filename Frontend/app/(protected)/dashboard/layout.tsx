"use client"

import { ReactNode, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Menu, Sun, Moon, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/store/userStore"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user } = useUserStore() // ✅ fix: access user from store

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b bg-background sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-2xl font-bold">
              ContractorHub
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/dashboard" className="hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/clients" className="hover:text-primary transition-colors">
                Clients
              </Link>
              <Link href="/contractors" className="hover:text-primary transition-colors">
                Contractors
              </Link>
              <Link href="/quotes" className="hover:text-primary transition-colors">
                Quotes
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
            <Link href="/profile">
              <Avatar className="cursor-pointer">
                <AvatarImage src={user?.avatar_url || "https://github.com/shadcn.png"} />
                <AvatarFallback>VV</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
