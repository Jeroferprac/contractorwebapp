"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AnimatedButton } from "./premium-button"
import { cn } from "@/lib/utils"

interface TransactionPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function TransactionPagination({ currentPage, totalPages, onPageChange }: TransactionPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <motion.div
      className="flex items-center justify-center space-x-2 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <AnimatedButton
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-xl disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </AnimatedButton>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: page !== "..." ? 1.1 : 1 }}
            whileTap={{ scale: page !== "..." ? 0.9 : 1 }}
          >
            {page === "..." ? (
              <span className="px-3 py-2 text-muted-foreground">...</span>
            ) : (
              <AnimatedButton
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                gradient={currentPage === page}
                className={cn("h-10 w-10 rounded-xl transition-all duration-300", currentPage === page && "shadow-lg")}
              >
                {page}
              </AnimatedButton>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatedButton
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-xl disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" />
      </AnimatedButton>
    </motion.div>
  )
}
