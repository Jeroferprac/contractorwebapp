"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  User,
  LogIn,
  CreditCard,
  Building2,
  Boxes,
  ChevronRight,
  Users // <-- Import Users icon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import clsx from "clsx"
import { useState, useRef, useEffect } from "react"
import React from "react";
import { useUserStore } from "@/store/userStore";

// Define NavItem type
type NavItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
};


interface SidebarProps {
  onClose: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ onClose, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const isInventoryActive = pathname.startsWith("/inventory");
  const [inventoryOpen, setInventoryOpen] = useState(isInventoryActive);
  const user = useUserStore((state) => state.user);

  // Ref for Inventory button
  const inventoryRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (inventoryOpen && inventoryRef.current) {
      inventoryRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [inventoryOpen]);

  const handleNavClick = () => {
    setInventoryOpen(false);
    setMobileOpen(false); // close sidebar on mobile nav
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed z-50 top-0 left-0 h-full w-64 transition-transform duration-300 bg-white dark:bg-[#0b1437] shadow-xl lg:shadow-none lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "lg:block"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Mobile close button */}
        <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden"
          >
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

          {/* Navigation (no independent scroll) */}
          <div>
            <nav className="px-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href);
                  if (item.children) {
                    return (
                      <React.Fragment key={item.name}>
                        <li>
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
                            ref={inventoryRef}
                          >
                            {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                            {item.name}
                            <ChevronRight className={clsx("ml-auto transition-transform", inventoryOpen && "rotate-90")}/>
                          </Button>
                        </li>
                        {inventoryOpen && (
                          <ul
                            id="inventory-submenu"
                            className={clsx(
                              "pl-8 space-y-1 overflow-hidden transition-all duration-500",
                              inventoryOpen ? "max-h-[999px] opacity-100 delay-100" : "max-h-0 opacity-0 delay-0"
                          )}
                            style={{ transitionProperty: 'max-height, opacity, padding', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                          >
                            {item.children.map((child: { name: string; href: string }) => (
                              <li key={child.name} className="relative">
                                {/* Colored bar for active subpage */}
                                {pathname === child.href && (
                                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded bg-blue-500" />
                                )}
                                <Button
                                  asChild
                                  variant="ghost"
                                  className={clsx(
                                    "w-full justify-start text-sm px-2 py-1.5 flex items-center rounded-md pl-4",
                                    pathname === child.href
                                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 font-semibold"
                                      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800"
                                  )}
                                  onClick={handleNavClick}
                                >
                                  <Link href={child.href}>{child.name}</Link>
                                </Button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </React.Fragment>
                    );
                  }
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
                          {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                          {item.name}
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {/* Bottom: Upgrade Card */}
          <div className="p-4 border-t">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white text-center mb-4">
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
      </aside>
    </>
  );
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