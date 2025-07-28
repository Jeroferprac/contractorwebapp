"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  X, 
  Search,
  Filter,
  Columns,
  Download,
  Plus,
  Package,
  MapPin,
  Calendar,
  FileText,
  Settings,
  Building2,
  Truck,
  Hash
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { StockPagination } from "../../stock/components/StockPagination"
import { cn } from "@/lib/utils"

interface TransferTableProps {
  data: Array<{
    id: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    date: string;
    status: string;
    priority: string;
  }>
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    icon: "✅",
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    icon: "🚚",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: "⏳",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    icon: "❌",
  },
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return "N/A"
  }
}

export function TransferTable({ data }: TransferTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    transferId: false, // invisible by default
    fromWarehouse: true,
    toWarehouse: true,
    items: true,
    date: true,
    status: true,
    actions: true,
  })

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((transfer) => {
      const matchesSearch = searchQuery === "" || 
        transfer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.fromWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.toWarehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.status.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a]
        const bValue = b[sortConfig.key as keyof typeof b]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchQuery, statusFilter, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }))
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
  }

  // Export functions
  const exportToCSV = () => {
    const headers = [
      "Transfer ID",
      "From Warehouse", 
      "To Warehouse",
      "Items",
      "Date",
      "Status"
    ]

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedData.map(transfer => [
        `"${transfer.id}"`,
        `"${transfer.fromWarehouse}"`,
        `"${transfer.toWarehouse}"`,
        transfer.items,
        `"${formatDate(transfer.date)}"`,
        transfer.status
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transfer-history.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const tableContent = document.querySelector("table")?.outerHTML || ""
      printWindow.document.write(`
        <html>
          <head>
            <title>Transfer History Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Transfer History Report</h1>
            ${tableContent}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const rowVariants: Variants = {
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
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Transfer History</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track inventory transfers between warehouses</p>
              </div>
            </div>
            
            {/* Controls Row - Search, Filter, Columns, Export */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transfers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-10 text-sm w-64"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>

              {/* Filter Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-purple-500 transition-all duration-300",
                      (searchQuery || statusFilter !== "all") && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    )}
                  >
                    <Filter className="w-4 h-4 mr-2 text-purple-500" />
                    Filter
                    {(searchQuery || statusFilter !== "all") && (
                      <div className="ml-2 w-2 h-2 rounded-full bg-purple-500" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-2xl border-2 border-purple-500/20 shadow-2xl p-4 w-80 bg-white dark:bg-gray-800">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                        Status
                      </label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                          <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-transit">In Transit</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllFilters}
                        className="w-full bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Columns */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-purple-500"
                  >
                    <Columns className="w-4 h-4 mr-2 text-purple-500" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl">
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.transferId}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, transferId: checked }))}
                  >
                    Transfer ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.fromWarehouse}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, fromWarehouse: checked }))}
                  >
                    From Warehouse
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.toWarehouse}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, toWarehouse: checked }))}
                  >
                    To Warehouse
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.items}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, items: checked }))}
                  >
                    Items
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.date}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, date: checked }))}
                  >
                    Date
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.status}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, status: checked }))}
                  >
                    Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem 
                    checked={visibleColumns.actions}
                    onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, actions: checked }))}
                  >
                    Actions
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Export Dropdown */}
              <DropdownMenu>
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
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="w-4 h-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
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
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
          <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-0 bg-gradient-to-r from-gray-100/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                  {visibleColumns.transferId && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("id")}
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <Hash className="w-4 h-4 text-purple-500" />
                  Transfer ID
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                  )}
                  {visibleColumns.fromWarehouse && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("fromWarehouse")}
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <Building2 className="w-4 h-4 text-blue-500" />
                        From Warehouse
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                  )}
                  {visibleColumns.toWarehouse && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("toWarehouse")}
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <Building2 className="w-4 h-4 text-green-500" />
                        To Warehouse
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                </TableHead>
                  )}
                  {visibleColumns.items && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("items")}
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <Package className="w-4 h-4 text-orange-500" />
                  Items
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                </TableHead>
                  )}
                  {visibleColumns.date && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("date")}
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <Calendar className="w-4 h-4 text-red-500" />
                        Date
                        <ArrowUpDown className="w-3 h-3" />
                      </Button>
                    </TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-3 py-2">
                      <Button
                        variant="ghost"
                        className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                      >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                        Status
                      </Button>
                    </TableHead>
                  )}
                  {visibleColumns.actions && (
                    <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center px-3 py-2">
                      <Settings className="w-4 h-4 mx-auto text-gray-500 dark:text-gray-400" />
                      Actions
                </TableHead>
                  )}
              </TableRow>
            </TableHeader>
            <TableBody>
                <AnimatePresence mode="wait">
                  {paginatedData.map((transfer, index) => {
                    const statusInfo = statusConfig[transfer.status as keyof typeof statusConfig]
                    return (
                      <motion.tr
                  key={transfer.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="group border-0 transition-all duration-300 cursor-pointer hover:shadow-md bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {visibleColumns.transferId && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="font-medium flex items-center gap-2"
                            >
                              {/* Remove avatar, just show short id if needed */}
                    {transfer.id}
                            </motion.div>
                  </TableCell>
                        )}
                        {visibleColumns.fromWarehouse && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.1 }}
                              className="font-medium flex items-center gap-2"
                            >
                              <Building2 className="w-4 h-4 text-blue-500" />
                    {transfer.fromWarehouse}
                            </motion.div>
                  </TableCell>
                        )}
                        {visibleColumns.toWarehouse && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                              className="font-medium flex items-center gap-2"
                            >
                              <Building2 className="w-4 h-4 text-green-500" />
                    {transfer.toWarehouse}
                            </motion.div>
                          </TableCell>
                        )}
                        {visibleColumns.items && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                              className="font-medium flex items-center gap-2"
                            >
                              <Package className="w-4 h-4 text-orange-500" />
                              {transfer.items}
                            </motion.div>
                  </TableCell>
                        )}
                        {visibleColumns.date && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                              className="font-medium flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4 text-red-500" />
                              {formatDate(transfer.date)}
                            </motion.div>
                  </TableCell>
                        )}
                        {visibleColumns.status && (
                          <TableCell className="px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                              className="flex items-center gap-2"
                            >
                              {/* Show only icon for status, no label */}
                              <span className={cn("text-xl", statusInfo.textColor)}>{statusInfo.icon}</span>
                            </motion.div>
                  </TableCell>
                        )}
                        {visibleColumns.actions && (
                          <TableCell className="text-center px-3 py-2 text-gray-900 dark:text-gray-100">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.6 }}
                            >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                                    className="w-8 h-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                                    <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Transfer
                        </DropdownMenuItem>
                        {transfer.status === "pending" && (
                                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <X className="w-4 h-4 mr-2" />
                            Cancel Transfer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                            </motion.div>
                  </TableCell>
                        )}
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
            </TableBody>
          </Table>
          </motion.div>

          {/* Pagination - no extra padding, solid dark background */}
          <motion.div
            className="mt-2 px-0 pb-4 bg-white dark:bg-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
        <StockPagination
          currentPage={currentPage}
              totalPages={totalPages} 
          itemsPerPage={itemsPerPage}
              totalItems={filteredAndSortedData.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
          </motion.div>
        </div>
    </Card>
    </motion.div>
  )
}
