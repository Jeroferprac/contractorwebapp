"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, ChevronUp, ChevronDown, MoreHorizontal, Calendar, Package } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { updateWarehouseStock, deleteWarehouseStock } from "@/lib/warehouse"

interface WarehouseDataTableProps {
  searchQuery: string
  filters: {
    warehouse: string
    binTypes: string[]
    status: "all" | "active" | "inactive"
  }
  warehouses: any[]
  stocks: any[]
  products: any[]
  onRefresh?: () => void
}

// Helper functions
const getWarehouseName = (warehouseId: string, warehouses: any[]) => {
  const warehouse = warehouses.find(w => w.id === warehouseId)
  return warehouse?.name || warehouseId
}

const getProductName = (productId: string, products: any[]) => {
  const product = products.find(p => p.id === productId)
  return product?.name || productId
}

const parseQuantity = (quantity: string | number) => {
  return typeof quantity === 'string' ? parseFloat(quantity) || 0 : quantity || 0
}

const TypeColors = {
  Picking: "bg-green-500",
  Putaway: "bg-blue-500",
  Overflow: "bg-orange-500",
  Quarantine: "bg-red-500",
  Staging: "bg-purple-500",
}

export function WarehouseDataTable({ searchQuery, filters, warehouses, stocks, products, onRefresh }: WarehouseDataTableProps) {
  const [selectedBins, setSelectedBins] = useState<string[]>([])
  const [sortField, setSortField] = useState<string>("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(false)

  // Convert stocks to bin display format
  const binData = useMemo(() => {
    return stocks.map((stock) => {
      const quantity = parseQuantity(stock.quantity)
      const reservedQty = parseQuantity(stock.reserved_quantity || 0)
      const availableQty = parseQuantity(stock.available_quantity || quantity - reservedQty)
      
      return {
        id: stock.id,
        binCode: stock.bin_location || `BIN-${stock.id.slice(0, 8)}`,
        warehouse: getWarehouseName(stock.warehouse_id, warehouses),
        warehouseId: stock.warehouse_id,
        product: getProductName(stock.product_id, products),
        productId: stock.product_id,
        binType: "Picking", // Default type since API doesn't provide this
        itemCount: availableQty,
        capacity: Math.max(availableQty + reservedQty, 100), // Estimate capacity
        status: quantity > 0 ? "active" : "inactive",
        lastUpdated: stock.updated_at || stock.created_at || new Date().toISOString(),
        quantity,
        reserved_quantity: reservedQty,
        available_quantity: availableQty,
        notes: stock.notes,
      }
    })
  }, [stocks, warehouses, products])

  // Filter and search logic
  const filteredBins = useMemo(() => {
    return binData.filter((bin) => {
      const matchesSearch = 
        bin.binCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.warehouse.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bin.product.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesWarehouse = !filters.warehouse || bin.warehouseId === filters.warehouse
      const matchesBinType = filters.binTypes.length === 0 || filters.binTypes.includes(bin.binType.toLowerCase())
      const matchesStatus = filters.status === "all" || bin.status === filters.status

      return matchesSearch && matchesWarehouse && matchesBinType && matchesStatus
    })
  }, [binData, searchQuery, filters])

  // Sorting logic
  const sortedBins = useMemo(() => {
    if (!sortField) return filteredBins

    return [...filteredBins].sort((a, b) => {
      let aValue = a[sortField as keyof typeof a]
      let bValue = b[sortField as keyof typeof b]

      if (sortField === "itemCount") {
        aValue = a.itemCount
        bValue = b.itemCount
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [filteredBins, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(sortedBins.length / itemsPerPage)
  const paginatedBins = sortedBins.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBins(paginatedBins.map((bin) => bin.id))
    } else {
      setSelectedBins([])
    }
  }

  const handleSelectBin = (binId: string, checked: boolean) => {
    if (checked) {
      setSelectedBins([...selectedBins, binId])
    } else {
      setSelectedBins(selectedBins.filter((id) => id !== binId))
    }
  }

  const handleDelete = async (stockId: string) => {
    if (!confirm("Are you sure you want to delete this stock entry?")) return
    
    setLoading(true)
    try {
      await deleteWarehouseStock(stockId)
      onRefresh?.()
    } catch (error) {
      console.error("Error deleting stock:", error)
      alert("Failed to delete stock. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={() => handleSort(field)}
    className="h-auto p-0 font-semibold text-white hover:text-white/80 transition-colors duration-200"
  >
    <span className="flex items-center justify-center gap-1">
      {children}
      {sortField === field &&
        (sortDirection === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
    </span>
  </Button>
)

  if (filteredBins.length === 0) {
    return (
      <Card className="p-12 text-center border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl">
        <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No stock entries found</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Try adjusting your filters or search query to find what you're looking for.
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedBins.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="p-4 border-0 bg-blue-50 dark:bg-blue-950/20 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedBins.length} stock entr{selectedBins.length > 1 ? "ies" : "y"} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                    <Edit className="h-4 w-4 mr-1" />
                    Bulk Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/80 dark:bg-slate-800/80 border-white/20 text-red-600 hover:text-red-700"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selectedBins.length} stock entries?`)) {
                        // Handle bulk delete
                        console.log("Bulk delete:", selectedBins)
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Table */}
<Card className="border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hidden md:block">
  {/* Table Header */}
  <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4">
          <div className="grid grid-cols-9 gap-4 items-center text-white font-semibold text-sm">
      <div className="flex items-center justify-center">
        <Checkbox
          checked={selectedBins.length === paginatedBins.length && paginatedBins.length > 0}
          onCheckedChange={handleSelectAll}
          className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
        />
      </div>
      <div className="text-center">
        <SortButton field="binCode">Bin Code</SortButton>
      </div>
      <div className="text-center">
        <SortButton field="warehouse">Warehouse</SortButton>
      </div>
            <div className="text-center">Product</div>
      <div className="text-center">Bin Type</div>
      <div className="text-center">
              <SortButton field="itemCount">Available</SortButton>
      </div>
      <div className="text-center">Status</div>
      <div className="text-center">
        <SortButton field="lastUpdated">Last Updated</SortButton>
      </div>
      <div className="text-center">Actions</div>
    </div>
  </div>

  {/* Table Body */}
  <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
    <AnimatePresence>
      {paginatedBins.map((bin, index) => (
        <motion.div
          key={bin.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ delay: index * 0.03 }}
          whileHover={{ 
            scale: 1.01,
            backgroundColor: "rgba(248, 250, 252, 0.8)",
            transition: { duration: 0.2 }
          }}
          className="group cursor-pointer"
        >
                <div className="grid grid-cols-9 gap-4 p-3 items-center hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-all duration-200">
            {/* Checkbox */}
            <div className="flex items-center justify-center">
              <Checkbox
                checked={selectedBins.includes(bin.id)}
                onCheckedChange={(checked) => handleSelectBin(bin.id, checked as boolean)}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </div>

            {/* Bin Code */}
            <div className="text-center">
              <span className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors duration-200">
                {bin.binCode}
              </span>
            </div>

            {/* Warehouse */}
            <div className="text-center">
              <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                {bin.warehouse}
              </span>
            </div>

                  {/* Product */}
                  <div className="text-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                      {bin.product}
              </span>
            </div>

            {/* Bin Type */}
            <div className="flex justify-center">
              <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 rounded-lg px-2 py-1 text-xs font-medium group-hover:scale-105 transition-transform duration-200">
                {bin.binType}
              </Badge>
            </div>

                  {/* Available Quantity */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {bin.itemCount}
                </span>
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-200">
                  <motion.div
                    className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(bin.itemCount / bin.capacity) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-center">
              <Badge
                className={`rounded-lg px-2 py-1 text-xs font-medium group-hover:scale-105 transition-transform duration-200 ${
                  bin.status === "active"
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                }`}
              >
                {bin.status}
              </Badge>
            </div>

            {/* Last Updated */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Calendar className="h-3 w-3 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{formatDate(bin.lastUpdated)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 hover:text-blue-600 rounded-lg transition-all duration-200"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 rounded-lg transition-all duration-200"
                          onClick={() => handleDelete(bin.id)}
                          disabled={loading}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
</Card>

      {/* Mobile Cards */}
<div className="md:hidden space-y-3">
  <AnimatePresence>
    {paginatedBins.map((bin, index) => (
      <motion.div
        key={bin.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="p-4 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Checkbox
                  checked={selectedBins.includes(bin.id)}
                  onCheckedChange={(checked) => handleSelectBin(bin.id, checked as boolean)}
                />
              </motion.div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{bin.binCode}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">{bin.warehouse}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0 text-red-600 rounded-lg"
                        onClick={() => handleDelete(bin.id)}
                        disabled={loading}
                      >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Product:</span>
                    <span className="text-xs font-medium text-slate-900 dark:text-white">{bin.product}</span>
                  </div>
                  
            <div className="flex items-center justify-between">
              <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-0 rounded-lg px-2 py-1 text-xs">
                {bin.binType}
              </Badge>
              <Badge
                className={`rounded-lg px-2 py-1 text-xs ${
                  bin.status === "active"
                    ? "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-400"
                }`}
              >
                {bin.status}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-400">Available:</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white text-xs">
                        {bin.itemCount}
                </span>
                <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(bin.itemCount / bin.capacity) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">Updated:</span>
              <span className="text-slate-600 dark:text-slate-400 font-medium">{formatDate(bin.lastUpdated)}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    ))}
  </AnimatePresence>
</div>

      {/* Pagination */}
      <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Show:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number.parseInt(value))
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-20 bg-white/80 dark:bg-slate-700/80 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-600 dark:text-slate-400">of {filteredBins.length} entries</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="bg-white/80 dark:bg-slate-700/80 border-white/20"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""}
                  >
                    {page}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="bg-white/80 dark:bg-slate-700/80 border-white/20"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
