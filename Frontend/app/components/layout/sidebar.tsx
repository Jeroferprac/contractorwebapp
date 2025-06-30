"use client"

import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import clsx from "clsx"

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Clients", icon: Users, href: "/clients" },
  { name: "Quotes", icon: FileText, href: "/quotes" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-full w-64 shrink-0 rounded-2xl bg-gradient-to-b from-blue-600 to-purple-700 p-6 text-white shadow-lg">
      <div className="mb-10 text-center text-2xl font-bold tracking-wide">
        Contractor<span className="text-yellow-300">HUB</span>
      </div>
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <Link href={item.href} key={item.name}>
            <Button
              variant="ghost"
              className={clsx(
                "w-full justify-start text-white hover:bg-white/10",
                pathname.startsWith(item.href) && "bg-white/20"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
