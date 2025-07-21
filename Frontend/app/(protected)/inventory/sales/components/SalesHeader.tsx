"use client"

import { Search, Bell, Mail, ChevronLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react";
import { useUserProfileStore } from "@/store/userProfileStore";

interface ProfessionalHeaderProps {
  userName?: string
  userRole?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export function ProfessionalHeader({
  searchValue = "",
  onSearchChange,
}: ProfessionalHeaderProps) {
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const userRole = userProfile?.role || "User";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center justify-between p-6 bg-white border-b border-gray-100"
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-bold text-gray-900">Omeya Sale</span>
        </motion.div>

        <Button variant="ghost" size="icon" className="text-gray-400">
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Hi, {userName}
          </h1>
          <p className="text-sm text-gray-500">Let's check your store today</p>
        </div>
      </div>

      {/* Center - Search */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 max-w-md mx-8"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 pr-16 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-purple-500"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <kbd className="px-2 py-1 text-xs bg-gray-200 rounded text-gray-500">⌘ K</kbd>
          </div>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" className="relative">
          <Mail className="h-5 w-5 text-gray-600" />
        </Button>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
            2
          </Badge>
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-purple-100 text-purple-600">JA</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}
