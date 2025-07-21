"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ComponentProps<typeof Button> {
  gradient?: boolean
  children: React.ReactNode
}

export function AnimatedButton({ gradient = false, className, children, ...props }: AnimatedButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        className={cn(
          "transition-all duration-300 shadow-lg hover:shadow-xl",
          gradient
            ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-lg"
            : "backdrop-blur-sm bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}
