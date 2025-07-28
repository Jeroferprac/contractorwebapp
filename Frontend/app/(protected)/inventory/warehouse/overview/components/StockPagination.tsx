"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StockPaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
}

export function StockPagination({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems, 
  onPageChange, 
  onItemsPerPageChange 
}: StockPaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground dark:text-gray-400">Rows per page:</span>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => onItemsPerPageChange(Number(value))}>
          <SelectTrigger className="w-20 h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <SelectItem value="5" className="hover:bg-gray-50 dark:hover:bg-gray-800">5</SelectItem>
            <SelectItem value="10" className="hover:bg-gray-50 dark:hover:bg-gray-800">10</SelectItem>
            <SelectItem value="20" className="hover:bg-gray-50 dark:hover:bg-gray-800">20</SelectItem>
            <SelectItem value="50" className="hover:bg-gray-50 dark:hover:bg-gray-800">50</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground dark:text-gray-400">
          {startIndex}-{endIndex} of {totalItems}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 transition-all duration-300 border-gray-200 dark:border-gray-700"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 transition-all duration-300 border-gray-200 dark:border-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + Math.max(1, currentPage - 2)
            if (pageNum > totalPages) return null
            return (
            <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 transition-all duration-300 ${
                  currentPage === pageNum
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                    : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 border-gray-200 dark:border-gray-700"
                }`}
              >
                {pageNum}
            </Button>
            )
          })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 transition-all duration-300 border-gray-200 dark:border-gray-700"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 dark:hover:from-purple-500/20 dark:hover:to-blue-500/20 transition-all duration-300 border-gray-200 dark:border-gray-700"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
