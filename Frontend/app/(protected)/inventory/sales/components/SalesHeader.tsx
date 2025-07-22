"use client"

import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useUserProfileStore } from "@/store/userProfileStore"
import { PlaceOrderButton } from "./PlaceOrderButton"
import QuickActions from "../../components/QuickActions"

interface ProfessionalHeaderProps {
  userName?: string
  userRole?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  imageUrl?: string
  onAddProduct?: () => void
  onAddSupplier?: () => void
  onCreateOrder?: () => void
  onExport?: () => void
}

export function ProfessionalHeader({
  searchValue = "",
  onSearchChange,
  imageUrl = "/placeholder-profile.jpg",
  onAddProduct = () => {},
  onAddSupplier = () => {},
  onCreateOrder = () => {},
  onExport = () => {},
}: ProfessionalHeaderProps) {
  const { data: session } = useSession()
  const userName = session?.user?.name || "User"
  const userProfile = useUserProfileStore((state) => state.userProfile)
  const userRole = userProfile?.role || "User"

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative flex items-center justify-between p-8 overflow-hidden rounded-2xl mb-6 min-h-[200px] bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute -bottom-16 -left-16 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 rounded-full"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full"
        />
      </div>

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/20" />

      {/* Foreground content */}
      <div className="relative z-20 flex items-center justify-between w-full">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 30px rgba(59, 130, 246, 0.4)",
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg"
            >
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </motion.div>
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl font-bold text-white drop-shadow-lg"
            >
              Inventory Sale
            </motion.span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>

          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className="text-4xl font-bold mb-2 drop-shadow-lg"
            >
              <motion.span
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="bg-gradient-to-r from-white via-yellow-200 to-white bg-[length:200%_100%] bg-clip-text text-transparent"
              >
                Hi, {userName}
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-sm text-white/90 drop-shadow"
            >
              <motion.span
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              >
                Let's check your store today
              </motion.span>
            </motion.p>
          </div>
        </div>

        {/* Right Section - Perfectly Aligned Actions */}
        <div className="flex items-center gap-4">
          {/* Quick Actions */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
          </motion.div>

          {/* Place Order Button */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PlaceOrderButton
              onClick={() => {
                onCreateOrder()
              }}
            />
          </motion.div>

          {/* Navigation Button */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        animate={{
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-2xl border border-white/20 dark:border-white/10"
      />
    </motion.header>
  )
}
