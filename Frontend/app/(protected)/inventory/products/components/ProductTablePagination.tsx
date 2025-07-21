"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ProductTablePaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  visibleColumnsCount: number
}

export function ProductTablePagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  visibleColumnsCount,
}: ProductTablePaginationProps) {
  return (
    <div className="px-6 py-4 bg-gradient-to-r from-background to-muted/20 border-t border-border/50 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 sm:gap-0">
        <div className="text-xs lg:text-sm text-muted-foreground font-sans">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
          {totalItems} products
        </div>
        <div className="flex items-center gap-1 lg:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
          >
            <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          <div className="flex items-center gap-0.5 lg:gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              return (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={pageNum}>
                  <Button
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className={`w-8 h-8 p-0 transition-all duration-300 ${
                      currentPage === pageNum
                        ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25"
                        : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 hover:border-purple-500/30"
                    }`}
                  >
                    {pageNum}
                  </Button>
                </motion.div>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
