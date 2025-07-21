"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { AnimatedCard } from "./animatedCard"
import { CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TransactionStatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  color: "green" | "blue" | "purple" | "orange"
  delay: number
}

export function TransactionStatsCard({ title, value, change, trend, icon, color, delay }: TransactionStatsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    green: {
      bg: "from-green-500/20 to-emerald-500/10 dark:from-green-500/30 dark:to-emerald-500/20",
      border: "border-green-200/50 dark:border-green-400/30",
      icon: "text-green-600 dark:text-green-400",
      accent: "bg-green-500",
    },
    blue: {
      bg: "from-blue-500/20 to-cyan-500/10 dark:from-blue-500/30 dark:to-cyan-500/20",
      border: "border-blue-200/50 dark:border-blue-400/30",
      icon: "text-blue-600 dark:text-blue-400",
      accent: "bg-blue-500",
    },
    purple: {
      bg: "from-purple-500/20 to-violet-500/10 dark:from-purple-500/30 dark:to-violet-500/20",
      border: "border-purple-200/50 dark:border-purple-400/30",
      icon: "text-purple-600 dark:text-purple-400",
      accent: "bg-purple-500",
    },
    orange: {
      bg: "from-orange-500/20 to-amber-500/10 dark:from-orange-500/30 dark:to-amber-500/20",
      border: "border-orange-200/50 dark:border-orange-400/30",
      icon: "text-orange-600 dark:text-orange-400",
      accent: "bg-orange-500",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -4, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 25 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <AnimatedCard className={cn("bg-gradient-to-br", colorClasses[color].bg, colorClasses[color].border)}>
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn("p-3 rounded-2xl backdrop-blur-sm bg-white/20 dark:bg-white/10", colorClasses[color].icon)}
            >
              {icon}
            </div>
            <motion.div
              animate={{ rotate: isHovered ? 360 : 0 }}
              transition={{ duration: 0.6, type: "spring" }}
              className={cn("w-2 h-2 rounded-full", colorClasses[color].accent)}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p
              className="text-2xl font-bold tracking-tight text-foreground"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
            >
              {value}
            </motion.p>
            <div className="flex items-center space-x-1">
              <motion.div
                animate={{ x: trend === "up" ? [0, 2, 0] : [0, -2, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 dark:text-red-400" />
                )}
              </motion.div>
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400",
                )}
              >
                {change}
              </span>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </motion.div>
  )
}
