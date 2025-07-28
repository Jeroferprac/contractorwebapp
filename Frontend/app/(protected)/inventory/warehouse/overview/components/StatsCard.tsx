"use client"

import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  Building2,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down"
  icon: "package" | "transfer" | "alert" | "building"
  color: "blue" | "green" | "red" | "purple"
}

const colorVariants = {
  blue: "from-blue-500 to-blue-600",
  green: "from-green-500 to-green-600",
  red: "from-red-500 to-red-600",
  purple: "from-purple-500 to-purple-600",
}

const iconMap = {
  package: Package,
  transfer: Truck,
  alert: AlertTriangle,
  building: Building2,
}

export function StatsCard({ title, value, change, trend, icon, color }: StatsCardProps) {
  const IconComponent = iconMap[icon] || Package // Fallback to Package icon
  
  const shadowColors = {
    blue: "hover:shadow-blue-500/25",
    green: "hover:shadow-green-500/25",
    red: "hover:shadow-red-500/25",
    purple: "hover:shadow-purple-500/25",
  }

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { 
      scale: 1.1, 
      rotate: [0, -10, 10, 0],
      transition: { 
        duration: 0.6,
        rotate: { duration: 0.3, repeat: 0 }
      }
    }
  }

  return (
    <Card
      className={cn(
        "group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-sm bg-white dark:bg-gray-900 rounded-3xl overflow-hidden h-full",
        shadowColors[color],
      )}
    >
      <CardContent className="p-6 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 group-hover:from-white group-hover:to-gray-50 dark:group-hover:from-gray-900 dark:group-hover:to-gray-800 transition-all duration-500 h-full flex flex-col justify-center">
        <div className="flex items-center justify-between">
          {/* Left side - Text content */}
          <div className="flex-1 space-y-3 min-w-0">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 leading-tight">
              {title}
            </p>
            <div className="space-y-2">
              <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent group-hover:from-gray-800 group-hover:to-gray-600 dark:group-hover:from-gray-200 dark:group-hover:to-gray-400 transition-all duration-300 leading-none">
                {value}
              </p>
              {change && trend && (
              <div className="flex items-center gap-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-600" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-600" />
                    )}
                  </motion.div>
                <span
                  className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-300",
                    trend === "up"
                      ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30 group-hover:shadow-lg"
                      : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 group-hover:bg-red-200 dark:group-hover:bg-red-900/30 group-hover:shadow-lg",
                  )}
                >
                  {change}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors duration-300">
                  vs last month
                </span>
              </div>
              )}
            </div>
          </div>
          
          {/* Right side - Animated icon */}
          <motion.div
            className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br shadow-lg group-hover:shadow-xl transition-all duration-500 ml-4 flex-shrink-0",
              colorVariants[color],
            )}
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent className="w-7 h-7 text-white" />
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
