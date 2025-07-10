"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Kanban,
  User,
  LogIn,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Quotes", href: "/quotes", icon: FileText },

  { name: "Contractor", href: "/contractor", icon: User }, // ✅ New item
  { name: "Kanban", href: "/kanban", icon: Kanban },

  { name: "company", href: "/company", icon: Kanban },

  { name: "Profile", href: "/profile", icon: User },
  
  { name: "Sign In", href: "/login", icon: LogIn },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white dark:bg-[#0b1437] transition-colors duration-200 border-r border-gray-200 dark:border-zinc-700 flex flex-col h-screen">
      {/* Brand Header */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">HORIZON</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">FREE</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href);

            return (
              <li key={item.name}>
                <Link href={item.href}>
                  <Button
                    variant="ghost"
                    className={clsx(
                      "w-full justify-start transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Upgrade Card */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white text-center">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold mb-2">Upgrade to PRO</h3>
          <p className="text-sm opacity-90 mb-4">
            to get access to all features! Connect with Venus World!
          </p>
          <Button className="w-full bg-white text-purple-600 hover:bg-gray-100 font-medium" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}
