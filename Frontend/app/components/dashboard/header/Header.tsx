"use client"

import { Bell, HelpCircle, Moon, Search, Sun, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"

interface HeaderBarProps {
  session?: Session | null
  userProfile?: any
  title?: string
}

export function HeaderBar({ session: propSession, userProfile, title }: HeaderBarProps) {
  const { data: sessionData } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Use prop session if provided, otherwise use session from hook
  const session = propSession || sessionData

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent mismatch during hydration


  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-7xl mx-auto rounded-xl border px-4 py-3 shadow-sm bg-white dark:bg-[#020817] gap-2 sm:gap-4">
      {/* Left: Title and Breadcrumb */}
      <div className="flex flex-col items-start flex-1 min-w-0">
        {title && (
          <>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Pages / {title}</div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">{title}</h1>
          </>
        )}
      </div>
      {/* Center: Search bar */}
      <div className="relative w-full sm:w-72  flex-shrink-0 mx-0 sm:mx-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search..." className="pl-9 rounded-full bg-muted text-sm w-full" />
      </div>
      {/* Right: Actions */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}> 
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-5 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
        {/* User avatar with profile link */}
        <Link href="/profile" className="cursor-pointer">
          <Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2 hover:ring-purple-500 transition-all duration-200">
            <AvatarImage src={userProfile?.avatar || "/placeholder.svg"} alt="User avatar" />
            <AvatarFallback>{userProfile?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  )
}
