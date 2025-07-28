"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Variants } from "framer-motion"
import type { WarehouseStock, Warehouse } from "@/types/warehouse"
import type { Product } from "@/types/inventory"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  X,
  Trash2,
  Archive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Box,
  LocateIcon as Location
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { StockForm } from "./StockForm"
import { StockPagination } from "./StockPagination"
import { getProducts } from "@/lib/inventory"
import { deleteWarehouseStock } from "@/lib/warehouse"

interface StockTableProps {
  data: WarehouseStock[]
  warehouses: Warehouse[]
  warehouseFilter: string
  statusFilter: string
  binLocationFilter: string
}

// Helper functions
const getWarehouseName = (warehouseId: string, warehouses: Warehouse[]) => {
  const warehouse = warehouses.find(w => w.id === warehouseId)
  return warehouse?.name || warehouseId
}

const getStatus = (quantity: number) => {
  if (quantity === 0) return "out-of-stock"
  if (quantity < 10) return "low-stock"
  return "in-stock"
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return "N/A"
  }
}

const statusConfig = {
  "in-stock": {
    label: "In Stock",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    icon: CheckCircle,
  },
  "low-stock": {
    label: "Low Stock",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    icon: AlertTriangle,
  },
  "out-of-stock": {
    label: "Out of Stock",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    icon: Archive,
  },
}

export function StockTable({ data, warehouses, warehouseFilter, statusFilter, binLocationFilter }: StockTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedStock, setSelectedStock] = useState<WarehouseStock | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: keyof WarehouseStock; direction: "asc" | "desc" } | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [stockToDelete, setStockToDelete] = useState<WarehouseStock | null>(null)
  
  // Default visible columns - Last Updated is hidden by default
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    productName: true,
    quantity: true,
    binLocation: true,
    warehouse: true,
    status: true,
    lastUpdated: false, // Hidden by default
    actions: true,
  })

  // Fetch products for product names
  useState(() => {
    getProducts().then((data) => setProducts(data as Product[])).catch(console.error)
  })

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || productId
  }

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
      const status = getStatus(quantity)
      const warehouseName = getWarehouseName(item.warehouse_id, warehouses)
      const productName = getProductName(item.product_id)
      
      const matchesSearch = searchQuery === "" || 
        productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.bin_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesWarehouse = warehouseFilter === "all" || item.warehouse_id === warehouseFilter
      const matchesStatus = statusFilter === "all" || status === statusFilter
      const matchesBinLocation = binLocationFilter === "all" || item.bin_location?.includes(binLocationFilter)
      
      return matchesSearch && matchesWarehouse && matchesStatus && matchesBinLocation
    })

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]

        if (aValue === undefined && bValue === undefined) return 0
        if (aValue === undefined) return 1
        if (bValue === undefined) return -1

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, searchQuery, warehouseFilter, statusFilter, binLocationFilter, sortConfig, warehouses])

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage)
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const handleSort = (key: keyof WarehouseStock) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev?.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(paginatedData.map(item => item.id)))
    }
  }

  const handleSelectItem = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const toggleRowExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedRows(newExpanded)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    // Note: warehouseFilter, statusFilter, binLocationFilter are controlled by parent
  }

  const handleView = (stock: WarehouseStock) => {
    setSelectedStock(stock)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEdit = (stock: WarehouseStock) => {
    setSelectedStock(stock)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDelete = async (stock: WarehouseStock) => {
    setStockToDelete(stock)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!stockToDelete) return
    
    try {
      await deleteWarehouseStock(stockToDelete.id)
      // Refresh data or update local state
      window.location.reload()
    } catch (error) {
      console.error("Failed to delete stock:", error)
      alert("Failed to delete stock item")
    } finally {
      setDeleteDialogOpen(false)
      setStockToDelete(null)
    }
  }

  const handleCreate = () => {
    setSelectedStock(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setTimeout(() => {
      setSelectedStock(null)
      setIsEditing(false)
    }, 300)
  }

  // Export functions
  const exportToCSV = () => {
    const columnKeys = ['productName', 'quantity', 'binLocation', 'warehouse', 'status', 'lastUpdated'] as const
    const headers = [
      "Product Name",
      "Quantity", 
      "Bin Location",
      "Warehouse",
      "Status",
      "Last Updated"
    ].filter((_, index) => visibleColumns[columnKeys[index]])

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedData.map(item => {
        const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
        const status = getStatus(quantity)
        const warehouseName = getWarehouseName(item.warehouse_id, warehouses)
        const productName = getProductName(item.product_id)
        
        const row = [
          `"${productName}"`,
          quantity,
          `"${item.bin_location || 'N/A'}"`,
          `"${warehouseName}"`,
          status,
          `"${formatDate(item.created_at)}"`
        ]
        
        return row.filter((_, index) => visibleColumns[columnKeys[index]]).join(",")
      })
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "stock-inventory.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Simple PDF export using browser print
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const tableContent = document.querySelector("table")?.outerHTML || ""
      printWindow.document.write(`
        <html>
          <head>
            <title>Stock Inventory Report</title>
            <style>
              body { font-family: Arial, sans-serif; }
              table { border-collapse: collapse; width: 100%; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <h1>Stock Inventory Report</h1>
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
                  <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">Stock Inventory</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and monitor your warehouse stock</p>
                </div>
              </div>
              
              {/* Controls Row - Search, Filter, Columns, Export */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search stocks..."
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
                <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl h-10 hover:bg-gray-50 dark:hover:bg-gray-700 focus:border-purple-500 transition-all duration-300",
                        (searchQuery || warehouseFilter !== "all" || statusFilter !== "all" || binLocationFilter !== "all") && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      )}
                    >
                      <Filter className="w-4 h-4 mr-2 text-purple-500" />
                      Filter
                      {(searchQuery || warehouseFilter !== "all" || statusFilter !== "all" || binLocationFilter !== "all") && (
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
                          Warehouse
                        </label>
                        <Select value={warehouseFilter} onValueChange={() => {}}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All Warehouses" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Warehouses</SelectItem>
                            {warehouses.map((warehouse) => (
                              <SelectItem key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={filterItemVariants} className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                          Status
                        </label>
                        <Select value={statusFilter} onValueChange={() => {}}>
                          <SelectTrigger className="bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg">
                            <SelectValue placeholder="All Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="in-stock">In Stock</SelectItem>
                            <SelectItem value="low-stock">Low Stock</SelectItem>
                            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
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
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.checkbox}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, checkbox: checked }))}
                    >
                      Select All
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.productName}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, productName: checked }))}
                    >
                      Product Name
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.quantity}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, quantity: checked }))}
                    >
                      Quantity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.binLocation}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, binLocation: checked }))}
                    >
                      Bin Location
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.warehouse}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, warehouse: checked }))}
                    >
                      Warehouse
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.status}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, status: checked }))}
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={visibleColumns.lastUpdated}
                      onCheckedChange={(checked) => setVisibleColumns(prev => ({ ...prev, lastUpdated: checked }))}
                    >
                      Last Updated
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
                      {visibleColumns.checkbox && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300 dark:border-gray-600"
                          />
                        </TableHead>
                      )}
                      {visibleColumns.productName && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("product_id")}
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Box className="w-4 h-4 text-purple-500" />
                            Product Name
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.quantity && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("quantity")}
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Package className="w-4 h-4 text-blue-500" />
                            Quantity
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.binLocation && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("bin_location")}
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Location className="w-4 h-4 text-green-500" />
                            Bin Location
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.warehouse && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("warehouse_id")}
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Building2 className="w-4 h-4 text-orange-500" />
                            Warehouse
                            <ArrowUpDown className="w-3 h-3" />
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.status && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                            Status
                          </Button>
                        </TableHead>
                      )}
                      {visibleColumns.lastUpdated && (
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 px-4 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("created_at")}
                            className="flex items-center gap-2 p-0 h-auto font-semibold hover:bg-transparent text-gray-700 dark:text-gray-300"
                          >
                            <Calendar className="w-4 h-4 text-red-500" />
                            Last Updated
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
                      {paginatedData.map((item, index) => {
                        const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
                        const status = getStatus(quantity)
                        const warehouseName = getWarehouseName(item.warehouse_id, warehouses)
                        const productName = getProductName(item.product_id)
                        const statusInfo = statusConfig[status as keyof typeof statusConfig]
                        const StatusIcon = statusInfo.icon

                        return (
                          <motion.tr
                            key={item.id}
                            variants={rowVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            layout
                            className="group border-0 transition-all duration-300 cursor-pointer hover:shadow-md bg-white dark:bg-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-700 rounded-xl"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            {visibleColumns.checkbox && (
                              <TableCell className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(item.id)}
                                  onChange={() => handleSelectItem(item.id)}
                                  className="rounded border-gray-300 dark:border-gray-600"
                                />
                              </TableCell>
                            )}
                            {visibleColumns.productName && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="font-medium flex items-center gap-2"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                    {productName.charAt(0).toUpperCase()}
                                  </div>
                                  {productName}
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.quantity && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + 0.1 }}
                                  className="font-medium flex items-center gap-2"
                                >
                                  <Package className="w-4 h-4 text-blue-500" />
                                  {quantity}
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.binLocation && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + 0.2 }}
                                  className="font-medium flex items-center gap-2"
                                >
                                  <Location className="w-4 h-4 text-green-500" />
                                  {item.bin_location || "N/A"}
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.warehouse && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + 0.3 }}
                                  className="font-medium flex items-center gap-2"
                                >
                                  <Building2 className="w-4 h-4 text-orange-500" />
                                  {warehouseName}
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.status && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + 0.4 }}
                                  className="flex items-center gap-2"
                                >
                                  <StatusIcon className="w-4 h-4" />
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.lastUpdated && (
                              <TableCell className="px-4 py-3 text-gray-900 dark:text-gray-100">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + 0.5 }}
                                  className="font-medium flex items-center gap-2"
                                >
                                  <Calendar className="w-4 h-4 text-red-500" />
                                  {formatDate(item.created_at)}
                                </motion.div>
                              </TableCell>
                            )}
                            {visibleColumns.actions && (
                              <TableCell className="text-center px-4 py-3 text-gray-900 dark:text-gray-100">
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
                                      <DropdownMenuItem onClick={() => handleView(item)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Stock
                                      </DropdownMenuItem>
                                      <DropdownMenuItem 
                                        onClick={() => handleDelete(item)}
                                        className="text-red-600 dark:text-red-400"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete Stock
                                      </DropdownMenuItem>
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
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden space-y-3 p-6">
              {paginatedData.map((item, index) => {
                const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
                const status = getStatus(quantity)
                const warehouseName = getWarehouseName(item.warehouse_id, warehouses)
                const productName = getProductName(item.product_id)
                const statusInfo = statusConfig[status as keyof typeof statusConfig]
                const StatusIcon = statusInfo.icon

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
                  >
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleRowExpansion(item.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                            {productName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{productName}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {quantity} items • {warehouseName}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="w-4 h-4" />
                          {expandedRows.has(item.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedRows.has(item.id) && (
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
                                <Location className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-400">Bin:</span>
                                <span className="font-medium">{item.bin_location || "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-red-500" />
                                <span className="text-gray-600 dark:text-gray-400">Updated:</span>
                                <span className="font-medium">{formatDate(item.created_at)}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(item)}
                                className="flex-1"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(item)}
                                className="flex-1"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(item)}
                                className="flex-1 text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
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
                totalItems={filteredAndSortedData.length}
                onPageChange={setCurrentPage} 
                onItemsPerPageChange={setItemsPerPage}
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Stock Form */}
      <StockForm stock={selectedStock} isEditing={isEditing} isOpen={isFormOpen} onClose={handleCloseForm} />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Stock Item
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to delete this stock item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {stockToDelete && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                    {getProductName(stockToDelete.product_id).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getProductName(stockToDelete.product_id)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {stockToDelete.quantity} items • {getWarehouseName(stockToDelete.warehouse_id, warehouses)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setStockToDelete(null)
              }}
              className="border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
            >
              Delete Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
