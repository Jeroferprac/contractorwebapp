"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
}

export function AnimatedCard({ children, className, hover = true, gradient = false }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 20 }}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      className="group"
    >
      <Card
        className={cn(
          "relative overflow-hidden backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300",
          "bg-white/80 dark:bg-[#020817]/80",
          "border border-white/20 dark:border-white/5",
          gradient && "bg-gradient-to-br from-white/90 to-white/70 dark:from-[#020817]/90 dark:to-[#020817]/70",
          className,
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent" />
        {children}
      </Card>
    </motion.div>
  )
}
