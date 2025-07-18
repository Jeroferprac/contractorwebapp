"use client"

import type React from "react"
import { useState, useEffect, useRef, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  Trash2,
  Star,
  Package,
  TrendingUp,
  TrendingDown,
  Settings2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ChevronDown,
  Plus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import SupplierPricingComparison from "../../suppliers/components/SupplierPricingComparison"

// Use your existing Product interface
export interface Product {
  id: string
  name: string
  sku: string
  category: string
  brand: string
  unit: string
  current_stock: string
  min_stock_level: string
  cost_price: string
  selling_price: string
  description: string
  created_at: string
}

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onAdjust?: (
    product: Product,
    data: { quantity: number; notes: string; transaction_type: "inbound" | "outbound" },
  ) => void
  onAddProduct?: () => void // Added onAddProduct prop
  headerRight?: React.ReactNode // Kept for potential future use, though not used in current header
}

const columns = [
  { key: "name", label: "Product name", visible: true },
  { key: "price", label: "Price", visible: true },
  { key: "stock", label: "Stock", visible: true },
  { key: "category", label: "Category", visible: true },
  { key: "brand", label: "Brand", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "actions", label: "Actions", visible: true },
]

// Helper function to determine stock status colors and dot color (removed status text)
const getStockStatus = (currentStock: string, minStock: string) => {
  const current = Number(currentStock)
  const min = Number(minStock)

  if (current === 0) return { color: "bg-red-500", dotColor: "bg-red-500" } // Out of Stock
  if (current <= min) return { color: "bg-yellow-500", dotColor: "bg-yellow-500" } // Low Stock
  return { color: "bg-emerald-500", dotColor: "bg-emerald-500" } // In Stock
}

// Helper function to determine stock bar count
const getStockBars = (currentStock: string, minStock: string) => {
  const current = Number(currentStock)
  const min = Number(minStock)

  if (current === 0) return 0
  if (current <= min) return 2
  if (current <= min * 2) return 3
  if (current <= min * 3) return 4
  return 5
}

export function ProductTable({ products, onEdit, onDelete, onAdjust, onAddProduct, headerRight }: ProductTableProps) {
  // Your existing state management
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustNotes, setAdjustNotes] = useState("")
  const [adjustType, setAdjustType] = useState<"inbound" | "outbound">("inbound")
  const [adjustLoading, setAdjustLoading] = useState(false)
  const [compareProductId, setCompareProductId] = useState<string | null>(null)
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null)
  const [openActionsRow, setOpenActionsRow] = useState<string | null>(null)
  const actionsMenuRef = useRef<HTMLDivElement | null>(null)

  // New UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Collection")
  const [selectedPrice, setSelectedPrice] = useState("All")
  const [selectedStatus, setSelectedStatus] = useState("All")
  const [visibleColumns, setVisibleColumns] = useState(columns)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState<string | "">("")
  const [expandedRows, setExpandedRows] = useState<string[]>([]) // For mobile accordion
  const [isMobile, setIsMobile] = useState(false) // State to detect mobile view

  // Function to toggle row expansion
  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Your existing click outside logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target as Node)) {
        setOpenActionsRow(null)
      }
    }
    if (openActionsRow) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openActionsRow])

  // Your existing functions
  function openAdjustModal(product: Product) {
    setAdjustProduct(product)
    setAdjustQty(0)
    setAdjustNotes("")
    setAdjustType("inbound")
  }

  function handleAdjust() {
    if (!adjustProduct) return
    setAdjustLoading(true)
    onAdjust && onAdjust(adjustProduct, { quantity: adjustQty, notes: adjustNotes, transaction_type: adjustType })
    setAdjustLoading(false)
    setAdjustProduct(null)
  }

  const formatCurrency = (value: string | number) =>
    Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })

  // Enhanced filtering logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = selectedCategory === "All Collection" || product.category === selectedCategory

      const price = Number(product.selling_price)
      const matchesPrice =
        selectedPrice === "All" ||
        (selectedPrice === "$0-$50" && price <= 50) ||
        (selectedPrice === "$50-$100" && price > 50 && price <= 100) ||
        (selectedPrice === "$100-$200" && price > 100 && price <= 200) ||
        (selectedPrice === "$200+" && price > 200)

      // Removed stockStatus.status from matchesStatus as it's no longer used for filtering text
      const matchesStatus =
        selectedStatus === "All" ||
        (selectedStatus === "Active" && Number(product.current_stock) > 0) ||
        (selectedStatus === "Inactive" && Number(product.current_stock) === 0)

      return matchesSearch && matchesCategory && matchesPrice && matchesStatus
    })
  }, [products, searchTerm, selectedCategory, selectedPrice, selectedStatus])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col)))
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const toggleAllProducts = () => {
    setSelectedProducts((prev) => (prev.length === paginatedProducts.length ? [] : paginatedProducts.map((p) => p.id)))
  }

  // Get unique categories from products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  // Mobile Accordion Component
  const MobileProductCard = ({ product }: { product: Product }) => {
    const isExpanded = expandedRows.includes(product.id)
    const stockStatus = getStockStatus(product.current_stock, product.min_stock_level)
    const isActive = Number(product.current_stock) > 0

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-gray-200 rounded-lg bg-white shadow-sm mb-3"
      >
        <div className="p-4 cursor-pointer" onClick={() => toggleRowExpansion(product.id)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={selectedProducts.includes(product.id)}
                onCheckedChange={() => toggleProductSelection(product.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
              >
                <Package className="w-5 h-5 text-blue-600" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                <div className="text-sm text-gray-500">SKU: {product.sku}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-100 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Price</div>
                    <div className="font-medium">${formatCurrency(product.selling_price)}</div>
                    <div className="text-sm text-gray-500">Cost: ${formatCurrency(product.cost_price)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Stock</div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{product.current_stock}</span>
                      <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`} />
                    </div>
                    <div className="text-sm text-gray-500">Min: {product.min_stock_level}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Category</div>
                    <Badge variant="outline" className="mt-1">
                      {product.category}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Brand</div>
                    <div className="text-gray-600 mt-1">{product.brand}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={isActive}
                      className="data-[state=checked]:bg-gradient-to-r from-green-400 to-green-600 data-[state=unchecked]:bg-gradient-to-r from-red-400 to-red-600"
                    />
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align="end">
                      <div className="space-y-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setCompareProductId(product.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Compare Prices
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => onEdit?.(product)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Product
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => openAdjustModal(product)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Adjust Stock
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-red-600 hover:text-red-700"
                          onClick={() => onDelete?.(product)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-blue-200/60 to-blue-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">All Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{products.length.toLocaleString()}</div>
              <div className="flex items-center text-xs text-blue-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                6.7% vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-green-200/60 to-green-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-700">Active Products</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {products.filter((p) => Number(p.current_stock) > 0).length.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-emerald-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.9% vs last month
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-red-200/60 to-red-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Low Stock Items</CardTitle>
              <Star className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {
                  products.filter(
                    (p) => Number(p.current_stock) <= Number(p.min_stock_level) && Number(p.current_stock) > 0,
                  ).length
                }
              </div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                Needs attention
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm border p-4 dark:bg-[#020817]" // Changed to rounded-xl, p-4 for more compact padding
      >
        <div className="flex flex-col md:flex-row items-center gap-4 ">
          {/* Left Section: Filters and Columns Button */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 flex-1 md:flex-none">
            {/* Category Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition w-full justify-between min-w-[140px] h-10"
                onClick={() => setFilterOpen(filterOpen === "category" ? "" : "category")}
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <AnimatePresence>
                {filterOpen === "category" && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <li
                      className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-sm ${selectedCategory === "All Collection" ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
                      onClick={() => {
                        setSelectedCategory("All Collection")
                        setFilterOpen("")
                      }}
                    >
                      All Collection
                    </li>
                    {categories.map((category) => (
                      <li
                        key={category}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-sm ${selectedCategory === category ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
                        onClick={() => {
                          setSelectedCategory(category)
                          setFilterOpen("")
                        }}
                      >
                        {category}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Price Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition w-full justify-between min-w-[100px] h-10"
                onClick={() => setFilterOpen(filterOpen === "price" ? "" : "price")}
              >
                <span className="truncate">{selectedPrice}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <AnimatePresence>
                {filterOpen === "price" && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {["All", "$0-$50", "$50-$100", "$100-$200", "$200+"].map((price) => (
                      <li
                        key={price}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-sm ${selectedPrice === price ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
                        onClick={() => {
                          setSelectedPrice(price)
                          setFilterOpen("")
                        }}
                      >
                        {price}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition w-full justify-between min-w-[100px] h-10"
                onClick={() => setFilterOpen(filterOpen === "status" ? "" : "status")}
              >
                <span className="truncate">{selectedStatus}</span>
                <ChevronDown className="w-4 h-4 flex-shrink-0" />
              </button>
              <AnimatePresence>
                {filterOpen === "status" && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute z-10 mt-2 left-0 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                  >
                    {["All", "Active", "Inactive"].map((status) => (
                      <li
                        key={status}
                        className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition text-sm ${selectedStatus === status ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
                        onClick={() => {
                          setSelectedStatus(status)
                          setFilterOpen("")
                        }}
                      >
                        {status}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Columns Toggle Button (visible on desktop) */}
            {!isMobile && (
            <Popover>
              <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 px-4 py-2 rounded-lg bg-transparent">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Toggle Columns</h4>
                  {columns.map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.key}
                        checked={column.visible}
                        onCheckedChange={() => toggleColumnVisibility(column.key)}
                      />
                      <label htmlFor={column.key} className="text-sm">
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            )}
          </div>

          {/* Right Section: Search and Add Product Button */}
          <div className="flex items-center gap-2 w-full md:w-auto md:flex-1 md:justify-end">
            <div className="relative flex-1 max-w-xs">
              {" "}
              {/* Added max-w-xs to control search input width */}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl h-10 w-full dark:bg-[#1e293b]" // Added rounded-xl and fixed height, w-full for responsiveness
              />
            </div>
            {/* Add Product Button (moved here) */}
            {onAddProduct && (
              <Button className="bg-blue-600 hover:bg-blue-700 h-10 px-4 py-2 rounded-lg" onClick={onAddProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Table or Mobile Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        {isMobile ? (
          <div className="space-y-3 ">
            <div className="flex items-center justify-between mb-4 dark:bg-[#1e293b]">
              <Checkbox
                checked={selectedProducts.length === paginatedProducts.length}
                onCheckedChange={toggleAllProducts}
              />
              <span className="text-sm text-gray-600">
                {selectedProducts.length} of {paginatedProducts.length} selected
              </span>
            </div>
            {paginatedProducts.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden dark:bg-[#020817]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedProducts.length === paginatedProducts.length}
                      onCheckedChange={toggleAllProducts}
                    />
                  </TableHead>
                  {visibleColumns.map(
                    (column) =>
                      column.visible && (
                            <TableHead key={column.key} className="font-medium text-left">
                        {column.label}
                      </TableHead>
                  ),
              )}
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {paginatedProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product.current_stock, product.min_stock_level)
                    const isActive = Number(product.current_stock) > 0
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                            <TableCell className="w-12">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductSelection(product.id)}
                        />
                      </TableCell>

                      {visibleColumns.find((col) => col.key === "name")?.visible && (
                            <TableCell className="min-w-[200px]">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0"
                          >
                            <Package className="w-5 h-5 text-blue-600" />
                          </motion.div>
                              <div className="min-w-0">
                                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "price")?.visible && (
                          <TableCell className="text-left">
                        <div>
                          <div className="font-medium">${formatCurrency(product.selling_price)}</div>
                          <div className="text-sm text-gray-500">Cost: ${formatCurrency(product.cost_price)}</div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "stock")?.visible && (
                          <TableCell className="text-left">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{product.current_stock}</span>
                                {/* Stock status dot */}
                                <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`} />
                          </div>
                          <div className="flex gap-1">
                                {/* Stock level bars */}
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-1 rounded-full ${
                                  i < getStockBars(product.current_stock, product.min_stock_level)
                                    ? stockStatus.color
                                    : "bg-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-xs text-gray-500">Min: {product.min_stock_level}</div>
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "category")?.visible && (
                          <TableCell className="text-left">
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "brand")?.visible && (
                          <TableCell className="text-left">
                        <span className="text-gray-600">{product.brand}</span>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "status")?.visible && (
                          <TableCell className="text-left">
                        <div className="flex items-center gap-2">
                              {/* Status dot */}
                              <div className={`w-3 h-3 rounded-full ${isActive ? "bg-green-500" : "bg-red-500"}`} />
                              {/* Switch with gradient styling */}
                              <Switch
                                checked={isActive}
                                className="data-[state=checked]:bg-gradient-to-r from-green-400 to-green-600 data-[state=unchecked]:bg-gradient-to-r from-red-400 to-red-600"
                              />
                        </div>
                      </TableCell>
                    )}

                    {visibleColumns.find((col) => col.key === "actions")?.visible && (
                          <TableCell className="text-left">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48" align="end">
                            <div className="space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => setCompareProductId(product.id)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Compare Prices
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => onEdit?.(product)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Product
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => openAdjustModal(product)}
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Adjust Stock
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-red-600 hover:text-red-700"
                                onClick={() => onDelete?.(product)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    )}
                  </motion.tr>
                )
              })}
            </AnimatePresence>
          </TableBody>
          {/* Pagination and summary inside table */}
          <tfoot>
            <tr>
              <td colSpan={visibleColumns.filter(col => col.visible).length + 1} className="px-4 py-3 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
          </Table>
          </div>
        )}
      </motion.div>

      {/* Your existing Adjustment Modal */}
      <Dialog open={!!adjustProduct} onOpenChange={() => setAdjustProduct(null)}>
        <DialogContent className="sm:max-w-md w-full max-w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {adjustProduct && (
            <div className="space-y-4">
              <div className="text-sm text-gray-700">
                Product: <span className="font-medium">{adjustProduct.name}</span> (SKU: {adjustProduct.sku})
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Adjustment Quantity</label>
                <Input
                  type="number"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full"
                  placeholder="Enter quantity (e.g. -5 or 10)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Transaction Type</label>
                <select
                  className="border rounded-md px-3 h-10 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as "inbound" | "outbound")}
                >
                  <option value="inbound">Inbound (Add Stock)</option>
                  <option value="outbound">Outbound (Remove Stock)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Reason/Notes</label>
                <Input
                  type="text"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  className="w-full"
                  placeholder="Reason for adjustment"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setAdjustProduct(null)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleAdjust} disabled={adjustLoading || adjustQty === 0} className="w-full sm:w-auto">
                  {adjustLoading ? <span className="spinner-class" /> : "Adjust"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Your existing Supplier Pricing Comparison Modal */}
      <Dialog open={!!compareProductId} onOpenChange={() => setCompareProductId(null)}>
        <DialogContent className="max-w-lg w-full">
          <DialogTitle>Supplier Pricing Comparison</DialogTitle>
          {compareProductId && (
            <SupplierPricingComparison productId={compareProductId} onClose={() => setCompareProductId(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
