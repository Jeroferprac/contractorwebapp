"use client"

import { Bell, HelpCircle, Moon, Search, Sun } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function HeaderBar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Prevent mismatch during hydration

  return (
    <div className="flex items-center justify-between w-full rounded-xl border px-4 py-3 shadow-sm bg-white dark:bg-zinc-900">
      {/* Search bar */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-9 rounded-full bg-muted text-sm"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>

        {/* User avatar */}
        <Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2">
          <AvatarImage src={session?.user?.image ?? ""} alt="User avatar" />
          <AvatarFallback>{session?.user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
