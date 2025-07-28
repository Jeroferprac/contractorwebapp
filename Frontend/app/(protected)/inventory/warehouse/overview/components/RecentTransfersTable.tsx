"use client"

import { useEffect, useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StockPagination } from "./StockPagination"
import { TransferForm } from "../../transfers/components/TransferForm"
import { 
  Edit, 
  Eye, 
  Package, 
  Filter, 
  Columns, 
  Search, 
  Settings, 
  ArrowUpDown, 
  MoreHorizontal,
  Hash,
  MapPin,
  Calendar,
  FileText,
  User,
  ChevronDown,
  ChevronRight,
  Download,
  Plus,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { getTransfers } from "@/lib/warehouse"
import type { WarehouseTransfer, Warehouse } from "@/types/warehouse"

// NOTE: No update API exists for warehouse transfers in the backend
// Only create (POST /warehouses/transfer) and complete (POST /warehouses/transfers/{id}/complete) endpoints are available
// To support editing transfers, you'll need to add a PUT/PATCH endpoint in the backend

interface Transfer {
  id: string
  from: string
  to: string
  items: number
  status: "completed" | "pending" | "in-transit" | "cancelled"
  date: string
  notes: string
  createdBy: string
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    icon: "✅",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    icon: "⏳",
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    icon: "🚚",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    icon: "❌",
  },
}

// Fetch real transfers
function mapWarehouseTransferToTransfer(t: WarehouseTransfer, warehouses: Warehouse[]): Transfer {
  // Helper function to get warehouse name by ID
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    return warehouse?.name || warehouseId
  }

  return {
    id: t.transfer_number || t.id,
    from: getWarehouseName(t.from_warehouse_id),
    to: getWarehouseName(t.to_warehouse_id),
    items: t.items ? t.items.length : 0,
    status: t.status as "completed" | "pending" | "in-transit" | "cancelled",
    date: t.transfer_date ? new Date(t.transfer_date).toLocaleDateString() : (t.created_at ? new Date(t.created_at).toLocaleDateString() : ""),
    notes: t.notes || "-",
    createdBy: t.created_by || "Unknown",
  }
}

export function RecentTransfersTable({ transfers: propTransfers, warehouses = [] }: { transfers?: WarehouseTransfer[], warehouses?: Warehouse[] }) {
  const [transfers, setTransfers] = useState<Transfer[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedTransfer, setSelectedTransfer] = useState<WarehouseTransfer | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [fromFilter, setFromFilter] = useState("all")
  const [toFilter, setToFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transfer; direction: "asc" | "desc" } | null>(null)
  const [selectedRow, setSelectedRow] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Default visible columns matching reference image
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    from: true,
    to: true,
    items: true,
    date: true,
    notes: true,
    actions: true,
    status: false, // Hidden by default
    createdBy: false, // Hidden by default
  })

  useEffect(() => {
    if (propTransfers) {
      console.log("Prop transfers received:", propTransfers)
      const mappedTransfers = Array.isArray(propTransfers) ? propTransfers.map(t => mapWarehouseTransferToTransfer(t, warehouses)) : []
      console.log("Mapped transfers:", mappedTransfers)
      setTransfers(mappedTransfers)
    } else {
      console.log("Fetching transfers from API...")
      getTransfers().then(data => {
        console.log("API response:", data)
        const mappedTransfers = Array.isArray(data) ? data.map(t => mapWarehouseTransferToTransfer(t, warehouses)) : []
        console.log("Mapped transfers from API:", mappedTransfers)
        setTransfers(mappedTransfers)
      }).catch(error => {
        console.error("Error fetching transfers:", error)
      })
    }
  }, [propTransfers, warehouses])

  const filteredAndSortedTransfers = useMemo(() => {
    const filtered = transfers.filter((transfer) => {
      const matchesSearch =
        transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transfer.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || transfer.status === statusFilter
      const matchesFrom = fromFilter === "all" || transfer.from === fromFilter
      const matchesTo = toFilter === "all" || transfer.to === toFilter
      const matchesDate = dateFilter === "all" || transfer.date === dateFilter
      
      return matchesSearch && matchesStatus && matchesFrom && matchesTo && matchesDate
    })

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [transfers, searchTerm, statusFilter, fromFilter, toFilter, dateFilter, sortConfig])

  const totalPages = Math.ceil(filteredAndSortedTransfers.length / itemsPerPage)
  const paginatedTransfers = filteredAndSortedTransfers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSort = (key: keyof Transfer) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleEdit = (transfer: Transfer) => {
    // Convert Transfer back to WarehouseTransfer format for the form
    const warehouseTransfer: WarehouseTransfer = {
      id: transfer.id,
      transfer_number: transfer.id,
      from_warehouse_id: warehouses.find(w => w.name === transfer.from)?.id || "",
      to_warehouse_id: warehouses.find(w => w.name === transfer.to)?.id || "",
      transfer_date: transfer.date,
      status: transfer.status,
      notes: transfer.notes,
      created_by: transfer.createdBy,
      created_at: new Date().toISOString(),
      items: []
    }
    setSelectedTransfer(warehouseTransfer)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleView = (transfer: Transfer) => {
    // Convert Transfer back to WarehouseTransfer format for the form
    const warehouseTransfer: WarehouseTransfer = {
      id: transfer.id,
      transfer_number: transfer.id,
      from_warehouse_id: warehouses.find(w => w.name === transfer.from)?.id || "",
      to_warehouse_id: warehouses.find(w => w.name === transfer.to)?.id || "",
      transfer_date: transfer.date,
      status: transfer.status,
      notes: transfer.notes,
      created_by: transfer.createdBy,
      created_at: new Date().toISOString(),
      items: []
    }
    setSelectedTransfer(warehouseTransfer)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setTimeout(() => {
      setSelectedTransfer(null)
      setIsEditing(false)
    }, 300)
  }

  const toggleRowExpansion = (transferId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(transferId)) {
      newExpanded.delete(transferId)
    } else {
      newExpanded.add(transferId)
    }
    setExpandedRows(newExpanded)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setFromFilter("all")
    setToFilter("all")
    setDateFilter("all")
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

  const filterItemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
  }

  // Get unique values for filters
  const uniqueFromWarehouses = [...new Set(transfers.map(t => t.from))]
  const uniqueToWarehouses = [...new Set(transfers.map(t => t.to))]
  const uniqueDates = [...new Set(transfers.map(t => t.date))]

  return (
    <>
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
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Recent Transfers</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track inventory movements</p>
                </div>
              </div>
              
              {/* Controls Row - Search, Filter, Columns, Export */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search transfers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 h-10 text-sm w-64"
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {/* Filter Button */}
                <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-purple-500 transition-all duration-300",
                        (statusFilter !== "all" || fromFilter !== "all" || toFilter !== "all" || dateFilter !== "all") && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      )}
                    >
                      <Filter className="w-4 h-4 mr-2 text-purple-500" />
                      Filter
                      {(statusFilter !== "all" || fromFilter !== "all" || toFilter !== "all" || dateFilter !== "all") && (
                        <div className="ml-2 w-2 h-2 rounded-full bg-purple-500" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl border-2 border-purple-500/20 shadow-2xl p-4 w-80 bg-white dark:bg-gray-800">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.1,
                          },
                        },
                      }}
                      className="space-y-4"
                    >
                      <motion.div variants={filterItemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                          Status
                        </label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-transit">In Transit</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={filterItemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-green-500" />
                          From Warehouse
                        </label>
                        <Select value={fromFilter} onValueChange={setFromFilter}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All From" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="all">All From</SelectItem>
                            {uniqueFromWarehouses.map(warehouse => (
                              <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={filterItemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-red-500" />
                          To Warehouse
                        </label>
                        <Select value={toFilter} onValueChange={setToFilter}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All To" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="all">All To</SelectItem>
                            {uniqueToWarehouses.map(warehouse => (
                              <SelectItem key={warehouse} value={warehouse}>{warehouse}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={filterItemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-orange-500" />
                          Date
                        </label>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All Dates" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg">
                            <SelectItem value="all">All Dates</SelectItem>
                            {uniqueDates.map(date => (
                              <SelectItem key={date} value={date}>{date}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={filterItemVariants} className="pt-2 border-t border-gray-200 dark:border-gray-600">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          className="w-full bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Clear All Filters
                        </Button>
                      </motion.div>
                    </motion.div>
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
                    {Object.entries(visibleColumns).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        checked={value}
                        onCheckedChange={(checked) => setVisibleColumns((prev) => ({ ...prev, [key]: checked }))}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Export */}
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl px-4 py-2 font-medium transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Table Content */}
          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <motion.div
                className="bg-gray-50/30 dark:bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(244, 63, 94, 0.08) transparent',
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    width: 2px;
                    height: 2px;
                  }
                  div::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 1px;
                  }
                  div::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, rgba(244, 63, 94, 0.05), rgba(239, 68, 68, 0.05));
                    border-radius: 1px;
                    transition: all 0.3s ease;
                  }
                  div::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, rgba(244, 63, 94, 0.3), rgba(239, 68, 68, 0.3));
                    width: 4px;
                  }
                `}</style>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-0 bg-gradient-to-r from-gray-100/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50">
                      {visibleColumns.id && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("id")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Hash className="w-4 h-4 text-purple-500" />
                            #
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.from && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("from")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <MapPin className="w-4 h-4 text-green-500" />
                            From
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.to && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("to")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <MapPin className="w-4 h-4 text-red-500" />
                            To
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.items && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("items")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Package className="w-4 h-4 text-blue-500" />
                            Items
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.date && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("date")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Calendar className="w-4 h-4 text-orange-500" />
                            Date
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.notes && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("notes")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <FileText className="w-4 h-4 text-indigo-500" />
                            Notes
                              <ArrowUpDown className="w-3 h-4" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("status")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                            Status
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.createdBy && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("createdBy")}
                              className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4 text-purple-500" />
                            Created By
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.actions && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center px-4 py-4">
                            <Settings className="w-4 h-4 mx-auto text-gray-500 dark:text-gray-400" />
                          Action
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="wait">
                      {paginatedTransfers.map((transfer, index) => (
                        <motion.tr
                          key={transfer.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          className={cn(
                            "group border-0 transition-all duration-300 cursor-pointer hover:shadow-md",
                            selectedRow === transfer.id
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg rounded-xl"
                              : index % 2 === 0
                                ? "bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl"
                                : "bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl",
                          )}
                          onClick={() => setSelectedRow(selectedRow === transfer.id ? null : transfer.id)}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {visibleColumns.id && (
                            <TableCell className="font-semibold px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2"
                              >
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                  #
                                </div>
                                {transfer.id}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.from && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.1 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <MapPin className="w-4 h-4 text-green-500" />
                                {transfer.from}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.to && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.2 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <MapPin className="w-4 h-4 text-red-500" />
                                {transfer.to}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.items && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <Package className="w-4 h-4 text-blue-500" />
                                {transfer.items} items
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.date && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.4 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <Calendar className="w-4 h-4 text-orange-500" />
                                {transfer.date}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.notes && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.5 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4 text-indigo-500" />
                                {transfer.notes}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.status && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.6 }}
                                className="flex items-center gap-2"
                              >
                                <div className={cn("w-2 h-2 rounded-full", statusConfig[transfer.status].color)} />
                                <span
                                  className={cn(
                                    "font-medium text-sm",
                                    selectedRow === transfer.id
                                      ? "text-white"
                                      : statusConfig[transfer.status].textColor,
                                  )}
                                >
                                  {statusConfig[transfer.status].label}
                                </span>
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.createdBy && (
                            <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 + 0.7 }}
                                className="font-medium flex items-center gap-2"
                              >
                                <User className="w-4 h-4 text-purple-500" />
                                {transfer.createdBy}
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.actions && (
                            <TableCell className="text-center px-4 py-3 text-gray-900 dark:text-gray-100">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.8 }}
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className={cn(
                                        "w-8 h-8 p-0 rounded-lg transition-all duration-300",
                                        selectedRow === transfer.id
                                          ? "hover:bg-white/20 text-white"
                                          : "hover:bg-gray-100 dark:hover:bg-gray-700",
                                      )}
                                    >
                                      <Settings className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl">
                                    <DropdownMenuItem onClick={() => handleView(transfer)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleEdit(transfer)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit Transfer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                      <MoreHorizontal className="w-4 h-4 mr-2" />
                                      More Actions
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </motion.div>
                            </TableCell>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </motion.div>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden space-y-3 p-6">
              {paginatedTransfers.map((transfer, index) => (
                <motion.div
                  key={transfer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => toggleRowExpansion(transfer.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                          #
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{transfer.id}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {transfer.from} → {transfer.to}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", statusConfig[transfer.status].color)} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {statusConfig[transfer.status].label}
                        </span>
                        {expandedRows.has(transfer.id) ? (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedRows.has(transfer.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-blue-500" />
                              <span className="text-gray-600 dark:text-gray-400">Items:</span>
                              <span className="font-medium">{transfer.items}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <span className="text-gray-600 dark:text-gray-400">Date:</span>
                              <span className="font-medium">{transfer.date}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span className="text-gray-600 dark:text-gray-400">Notes:</span>
                            <span className="font-medium">{transfer.notes}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600 dark:text-gray-400">Created by:</span>
                            <span className="font-medium">{transfer.createdBy}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(transfer)}
                              className="flex-1"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(transfer)}
                              className="flex-1"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-6 px-6 pb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <StockPagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                itemsPerPage={itemsPerPage}
                totalItems={filteredAndSortedTransfers.length}
                onPageChange={setCurrentPage} 
                onItemsPerPageChange={setItemsPerPage}
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Transfer Form */}
      <TransferForm transfer={selectedTransfer} isEditing={isEditing} isOpen={isFormOpen} onClose={handleCloseForm} />
    </>
  )
}
