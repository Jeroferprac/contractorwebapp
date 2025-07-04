"use client"

import { Home, ShoppingBag, BarChart3, Grid3X3, User, LogIn, Crown, X } from "lucide-react"

const menuItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: ShoppingBag, label: "NFT Marketplace", active: false },
  { icon: BarChart3, label: "Tables", active: false },
  { icon: Grid3X3, label: "Kanban", active: false },
  { icon: User, label: "Profile", active: false },
  { icon: LogIn, label: "Sign In", active: false },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:shadow-none scrollbar-hide`}
      style={{
        // Mobile styles only
        height: isOpen ? "auto" : "100vh",
        minHeight: isOpen ? "100vh" : "auto",
        maxHeight: "100vh",
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
      }}
    >
      {/* Mobile Close Button */}
      <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 lg:hidden">
        <X className="w-5 h-5" />
      </button>

      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">HORIZON</span>
          <span className="text-purple-600 font-bold text-sm">FREE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors relative ${
                    item.active
                      ? "bg-purple-50 text-purple-600 font-medium"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                  onClick={() => onClose()} // Close sidebar on mobile when item is clicked
                >
                  {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600 rounded-r"></div>}
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Upgrade Card - Natural flow at bottom of sidebar content */}
      <div className="mt-8 mx-4 mb-6 lg:absolute lg:bottom-6 lg:left-4 lg:right-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Upgrade to PRO</h3>
            <p className="text-sm text-purple-100 leading-relaxed">
              to get access to all features!
              <br />
              Connect with Venus World!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
