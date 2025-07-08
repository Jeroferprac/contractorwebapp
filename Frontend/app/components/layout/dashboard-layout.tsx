"use client"

import type React from "react"
import type { Session } from "next-auth"
import { Sidebar } from "./sidebar"
import { HeaderBar } from "@/components/dashboard/header/Header"
import { useState } from "react"
import { Menu } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
  session?: Session | null
  userProfile?: unknown
}

export function DashboardLayout({ children, session, userProfile }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1437] dark:text-white transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="lg:ml-64">
        {/* Header with hamburger for mobile */}
        <header className="sticky top-0 z-30 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#0b1437] border-b border-gray-200 dark:border-zinc-700 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Hamburger menu for mobile */}
            <button
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm lg:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="min-w-0 flex-1 sm:flex-none">
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pages / Dashboard</div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">Main Dashboard</h1>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <HeaderBar session={session} userProfile={userProfile} />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
