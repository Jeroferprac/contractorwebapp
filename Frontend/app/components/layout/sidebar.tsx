"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Kanban,
  User,
  LogIn,
  CreditCard,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { signOut } from "next-auth/react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "Kanban", href: "/kanban", icon: Kanban },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Sign In", href: "/login", icon: LogIn },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Brand */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-navy-900">
          <span className="text-blue-600">HORIZON</span> FREE
        </h1>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href)
          return (
            <Link href={item.href} key={item.name}>
              <div
                className={clsx(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Sign out button */}
      <div className="mt-4">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>

      {/* Upgrade Card */}
      <div className="mt-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white text-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Upgrade to PRO</h3>
          <p className="text-xs mb-3 opacity-90">
            to get access to all features! Connect with Venus World
          </p>
          <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
            Get Started
          </Button>
        </div>
      </div>
    </aside>
  )
}
