"use client"

import { Search, Bell, Sun, HelpCircle, Menu } from "lucide-react"

interface TopHeaderProps {
  onMenuClick: () => void
}

export function TopHeader({ onMenuClick }: TopHeaderProps) {
  return (
    <div className="bg-white px-4 lg:px-8 py-4 lg:py-6 border-b border-gray-100">
      <div className="flex items-center justify-between">
        {/* Left - Mobile Menu + Breadcrumb */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <p className="text-sm text-gray-400 mb-1">Pages / Profile</p>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>

        {/* Right - Search and Icons */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search - Hidden on small screens */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-48 lg:w-64 text-sm"
            />
          </div>

          {/* Search Icon for Mobile */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg md:hidden">
            <Search className="w-5 h-5" />
          </button>

          {/* Icons */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg hidden sm:block">
              <Sun className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg hidden sm:block">
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden">
              <img src="/placeholder.svg?height=40&width=40" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
