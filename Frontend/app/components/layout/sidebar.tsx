"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderKanban,
  ListChecks,
  User,
  LogIn,
  CreditCard,
  Building2,
  Boxes,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { useState } from "react"
import { useUserStore } from "@/store/userStore"

type NavItem = {
  name: string;
  href: string;
  icon: any;
  children?: { name: string; href: string }[];
};

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const user = useUserStore((s) => s.user)

  const handleNavClick = () => {
    setInventoryOpen(false)
    onClose()
  }

  // Build nav items based on user role
  let navItems: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Quotes", href: "/quotes", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ];

  if (user?.role === "company") {
    navItems.splice(1, 0, { name: "Company", href: "/company", icon: Building2 });
    navItems.splice(2, 0, { name: "Projects", href: "/company/projects", icon: FolderKanban });
  } else if (user?.role === "contractor") {
    navItems.splice(1, 0, { name: "Contractor", href: "/contractor", icon: User });
    navItems.splice(2, 0, { name: "Projects", href: "/contractor/projects", icon: FolderKanban });
  } else if (user?.role === "admin") {
    navItems.splice(1, 0, { name: "Company", href: "/company", icon: Building2 });
    navItems.splice(2, 0, { name: "Projects", href: "/company/projects", icon: FolderKanban });
    navItems.splice(3, 0, { name: "Contractor", href: "/contractor", icon: User });
    navItems.splice(4, 0, { name: "Projects", href: "/contractor/projects", icon: FolderKanban });
    navItems.splice(5, 0, { name: "Clients", href: "/clients", icon: Users });
  }

  // Inventory is available to all roles
  navItems.splice(-1, 0, {
    name: "Inventory",
    href: "/inventory",
    icon: Boxes,
    children: [
      { name: "Dashboard", href: "/inventory" },
      { name: "Products", href: "/inventory/products" },
      { name: "Sales Orders", href: "/inventory/sales" },
      { name: "Suppliers", href: "/inventory/suppliers" },
      { name: "purchase", href: "/inventory/purchase-orders" },
      { name: "Reports", href: "/inventory/reports" },
      { name: "Transactions", href: "/inventory/transactions" },
      
      
    ],
  });

  navItems.push({ name: "Sign In", href: "/login", icon: LogIn });

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
          {/* <X className="w-5 h-5" /> */}
          <span className="text-2xl">×</span>
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
                    {/* Submenu - now appears below, with animation */}
                    <div
                      className={clsx(
                        "absolute left-0 w-full z-10",
                        inventoryOpen ? "block" : "hidden"
                      )}
                    >
                      <ul
                        id="inventory-submenu"
                        className={clsx(
                          "bg-white dark:bg-[#0b1437] shadow-lg rounded border border-gray-100 dark:border-zinc-800 py-2 mt-1 origin-top transition-all duration-300 transform",
                          inventoryOpen
                            ? "animate-inventory-dropdown"
                            : "opacity-0 scale-y-95 pointer-events-none"
                        )}
                        role="menu"
                        tabIndex={-1}
                      >
                        {item.children.map((child) => (
                          <li key={child.name} role="none">
                            <Link
                              href={child.href}
                              className={clsx(
                                "block px-4 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap rounded hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-zinc-800 dark:hover:text-cyan-400",
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
                    </div>
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
        </nav>

        
      </div>
    </div>
  )
}

<style jsx global>{`
  @layer utilities {
    .animate-inventory-dropdown {
      animation: inventory-dropdown-fade-slide 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes inventory-dropdown-fade-slide {
      0% {
        opacity: 0;
        transform: scaleY(0.95) translateY(-8px);
      }
      100% {
        opacity: 1;
        transform: scaleY(1) translateY(0);
      }
    }
  }
`}</style>