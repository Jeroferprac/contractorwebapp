"use client"

import type React from "react"
import type { Session } from "next-auth"
import { Sidebar } from "./sidebar"
import { HeaderBar } from "@/components/dashboard/header/Header"
import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { useUserProfileStore } from "@/store/userProfileStore"

interface DashboardLayoutProps {
  children: React.ReactNode
  session?: Session | null
  title?: string
}

export function DashboardLayout({ children, session, title = "Main Dashboard" }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const fetchUserProfile = useUserProfileStore((state) => state.fetchUserProfile)

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0b1437] dark:text-white transition-colors duration-200 overflow-x-hidden">
      {/* Sidebar for desktop only */}
      <aside className="w-64 hidden lg:block">
        <Sidebar onClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      </aside>
      {/* Sidebar for mobile overlays content, only visible below lg */}
      <div className="block lg:hidden">
        <Sidebar onClose={() => setSidebarOpen(false)} mobileOpen={sidebarOpen} setMobileOpen={setSidebarOpen} />
      </div>

      {/* Main area: header and content */}
      <div className="flex-1 flex flex-col min-h-[700px] overflow-x-hidden">
        {/* Header with hamburger for mobile */}
        <header className="top-0 z-30 flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#0b1437] border-b border-gray-200 dark:border-zinc-700 gap-3 sm:gap-4">
          <HeaderBar session={session} userProfile={userProfile} title={title} onHamburgerClick={() => setSidebarOpen(true)} />
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}