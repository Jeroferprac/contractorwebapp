import type React from "react"
import type { Session } from "next-auth"
import { Sidebar } from "./sidebar"
import { HeaderBar } from "@/components/dashboard/header/Header"
interface DashboardLayoutProps {
  children: React.ReactNode
  session?: Session | null
  userProfile?: any
}

export function DashboardLayout({ children, session, userProfile }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0b1437] dark:text-white transition-colors duration-200">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with your existing logic */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-zinc-700">
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-white">Pages / Dashboard</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Main Dashboard</h1>
          </div>
          <HeaderBar session={session} userProfile={userProfile} />
        </header>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-6 min-w-0 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
