"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Boxes,
  FolderKanban,
  User,
  LogIn,
  CreditCard,
  X,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Clients", href: "/clients", icon: Users },
  { name: "Quotes", href: "/quotes", icon: FileText },
  { name: "company", href: "/company", icon: Building2 },
  { name: "Inventory", href: "/inventory", icon: Boxes, children: [
    { name: "Dashboard", href: "/inventory" },
    { name: "Products", href: "/inventory/products" },
    { name: "Categories", href: "/inventory/categories" },
    { name: "Suppliers", href: "/inventory/suppliers" },
  ] },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Sign In", href: "/login", icon: LogIn },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [inventoryOpen, setInventoryOpen] = useState(false)

  const handleNavClick = () => {
    setInventoryOpen(false)
    onClose()
  }

  return (
    <div
      className={clsx(
        "fixed left-0 top-0 w-64 bg-white dark:bg-[#0b1437] z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:shadow-none"
      )}
    >
      {/* Content wrapper: flex-col, fills height, keeps bottom card at bottom */}
      <div className="flex flex-col justify-between min-h-screen">
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">HORIZON</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">FREE</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href);

              // Inventory with submenu
              if (item.children) {
                return (
                  <li
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setInventoryOpen(true)}
                    onMouseLeave={() => setInventoryOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={clsx(
                        "w-full justify-start transition-all duration-200 flex items-center",
                        isActive
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
                          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                      )}
                      aria-haspopup="menu"
                      aria-expanded={inventoryOpen}
                      aria-controls="inventory-submenu"
                      tabIndex={0}
                      onClick={() => setInventoryOpen((open) => !open)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setInventoryOpen((open) => !open);
                        } else if (e.key === "Escape") {
                          setInventoryOpen(false);
                        }
                      }}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                      <ChevronRight className={clsx("ml-auto transition-transform", inventoryOpen && "rotate-90")} />
                    </Button>
                    {/* Submenu */}
                    {inventoryOpen && (
                      <ul
                        id="inventory-submenu"
                        className="absolute left-full top-0 bg-white dark:bg-[#0b1437] shadow-lg rounded min-w-[200px] z-10 border border-gray-100 dark:border-zinc-800 py-2"
                        role="menu"
                        tabIndex={-1}
                      >
                        {item.children.map((child) => (
                          <li key={child.name} role="none">
                            <Link
                              href={child.href}
                              className={clsx(
                                "block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer whitespace-nowrap",
                                pathname === child.href && "font-semibold text-blue-600"
                              )}
                              tabIndex={0}
                              role="menuitem"
                              onClick={handleNavClick}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") setInventoryOpen(false);
                              }}
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // All other nav items (keep as is)
              return (
                <li key={item.name}>
                  <Button
                    asChild
                    variant="ghost"
                    className={clsx(
                      "w-full justify-start transition-all duration-200 flex items-center",
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                    )}
                    onClick={handleNavClick}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  </Button>
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
    </div>
  )
}
