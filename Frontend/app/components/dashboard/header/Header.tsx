import { Search, Bell, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle" // ✅ Add this
import { Session } from "next-auth"
import Link from "next/link"

export function Header({ session }: { session: Session | null }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div>
        <p className="text-sm text-gray-500">Pages / Dashboard</p>
        <h1 className="text-2xl font-bold text-navy-900">Main Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search..." className="pl-10 w-64" />
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <ThemeToggle /> {/* ✅ Replaces static Moon icon */}

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
        <Link href="/profile" className="cursor-pointer">
         <Avatar>
          <AvatarImage src={session?.user?.image ?? ""} />
          <AvatarFallback>{session?.user?.name?.[0] ?? "U"}</AvatarFallback>
        </Avatar>
        </Link>
       
      </div>
    </div>
  )
}

