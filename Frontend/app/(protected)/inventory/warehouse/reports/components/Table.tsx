"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Search, Download, FileText, FileSpreadsheet, type LucideIcon, ArrowUpDown, Settings, Eye, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface TableColumn {
  key: string
  label: string
  icon: LucideIcon
  gradient: string
}

interface AnimatedTableProps {
  title: string
  titleIcon: LucideIcon
  columns: TableColumn[]
  data: any[]
  searchPlaceholder: string
  itemsPerPage?: number
  onExport?: (format: "csv" | "pdf") => void
}

export function AnimatedTable({
  title,
  titleIcon: TitleIcon,
  columns,
  data,
  searchPlaceholder,
  itemsPerPage = 10,
  onExport,
}: AnimatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0
    
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1
    
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
    return 0
  })

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "from-green-500 to-emerald-600",
      maintenance: "from-yellow-500 to-orange-600",
      pending: "from-gray-500 to-slate-600",
      in_transit: "from-blue-500 to-cyan-600",
      completed: "from-green-500 to-emerald-600",
    }
    const gradient = variants[status as keyof typeof variants] || variants.pending

    return (
      <Badge className={`bg-gradient-to-r ${gradient} text-white border-0 shadow-sm`}>{status.replace("_", " ")}</Badge>
    )
  }

  const renderCellContent = (item: any, column: TableColumn) => {
    const value = item[column.key]

    if (column.key === "status") {
      return getStatusBadge(value)
    }

    if (column.key === "progress") {
      return (
        <div className="flex items-center gap-2">
          <Progress value={value} className="w-20" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{value}%</span>
        </div>
      )
    }

    if (typeof value === "number" && column.key.includes("stock")) {
      return (
        <span className={cn("font-semibold", value < 50 ? "text-red-600" : "text-green-600")}>
          {value.toLocaleString()}
        </span>
      )
    }

    return value
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <motion.div className="w-full" initial="hidden" animate="visible" variants={containerVariants}>
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800/50 p-6 border-b border-gray-100 dark:border-gray-800">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <TitleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">{title}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive data and analytics</p>
              </div>
            </div>
            
            {/* Controls Row - Search and Export */}
            <div className="flex items-center gap-3">
            {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-10 text-sm w-64"
              />
              </div>

            {/* Export Dropdown */}
            <DropdownMenu open={isExportOpen} onOpenChange={setIsExportOpen}>
              <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 font-medium transition-all duration-300 shadow-lg flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
              </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuItem onClick={() => onExport?.("csv")}>
                    <FileText className="w-4 h-4 mr-2" />
                          Export as CSV
                        </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExport?.("pdf")}>
                    <FileText className="w-4 h-4 mr-2" />
                          Export as PDF
                        </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </motion.div>
        </div>

        {/* Table Content */}
        <div className="w-full">
          <div className="hidden md:block">
            <motion.div
              className="bg-gray-50/30 dark:bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
        <Table>
          <TableHeader>
                  <TableRow className="hover:bg-transparent border-0 bg-gradient-to-r from-gray-100/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
              {columns.map((column, index) => (
                      <TableHead key={column.key} className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                        <Button
                          variant="ghost"
                          onClick={() => handleSort(column.key)}
                          className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                        >
                          <column.icon className="w-4 h-4" style={{ color: column.gradient.includes('purple') ? '#8b5cf6' : column.gradient.includes('blue') ? '#3b82f6' : column.gradient.includes('green') ? '#10b981' : column.gradient.includes('orange') ? '#f59e0b' : column.gradient.includes('red') ? '#ef4444' : '#6b7280' }} />
                    {column.label}
                          <ArrowUpDown className="w-3 h-3" />
                        </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="wait">
                    {paginatedData.map((item, index) => (
                <motion.tr
                        key={item.id || index}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="group border-0 transition-all duration-300 cursor-pointer hover:shadow-md bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                >
                  {columns.map((column, cellIndex) => (
                          <TableCell key={column.key} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                      <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + cellIndex * 0.02 }}
                              className="font-medium flex items-center gap-2"
                            >
                              {column.key === "status" ? (
                                renderCellContent(item, column)
                              ) : column.key === "progress" ? (
                                renderCellContent(item, column)
                              ) : (
                                <>
                                  <column.icon className="w-4 h-4" style={{ color: column.gradient.includes('purple') ? '#8b5cf6' : column.gradient.includes('blue') ? '#3b82f6' : column.gradient.includes('green') ? '#10b981' : column.gradient.includes('orange') ? '#f59e0b' : column.gradient.includes('red') ? '#ef4444' : '#6b7280' }} />
                        {renderCellContent(item, column)}
                                </>
                              )}
                      </motion.div>
                    </TableCell>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
            </motion.div>
          </div>

          {/* Mobile Accordion */}
          <div className="md:hidden space-y-3 p-6">
            {paginatedData.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
              >
                <div className="p-4">
                  <div className="space-y-3">
                    {columns.map((column, cellIndex) => (
                      <div key={column.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <column.icon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{column.label}:</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {renderCellContent(item, column)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Pagination */}
      <motion.div
            className="mt-6 px-6 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
      >
            <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedData.length)} of {sortedData.length} results
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "rounded-xl w-8 h-8 p-0",
                  page === currentPage && "bg-gradient-to-r from-purple-500 to-blue-600",
                )}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
              </div>
        </div>
      </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}