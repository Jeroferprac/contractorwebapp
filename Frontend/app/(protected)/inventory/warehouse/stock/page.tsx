"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Download, Calendar, Package, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StockAreaChart } from "./components/StockAreaChart"
import { StockByWarehouseChart } from "./components/StockByWarehouseChart"
import { TopProductChart } from "./components/TopProductChart"
import { StockTable } from "./components/StockTable"
import { StockFilterBar } from "./components/StockFilterBar"
import { StockAccordionMobile } from "./components/StockAccordionMobile"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { getWarehouseStocks, getWarehouses } from "@/lib/warehouse"
import { getProducts, getCategories } from "@/lib/inventory"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"
import type { Product } from "@/lib/inventory"
import { Skeleton } from "@/components/ui/skeleton"
import { parseISO, subDays, isAfter } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function StockPage() {
  const [dateRange, setDateRange] = useState("30")
  const [warehouseFilter, setWarehouseFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stocks, setStocks] = useState<WarehouseStock[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getWarehouseStocks(),
      getWarehouses(),
      getProducts(),
      getCategories(),
    ])
      .then(([stockData, warehouseData, productData, categoryData]) => {
        setStocks(stockData)
        setWarehouses(warehouseData)
        setProducts(productData)
        setCategories(Array.isArray(categoryData) ? categoryData.map((c: any) => c.name || c) : [])
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load stock data.")
        setLoading(false)
      })
  }, [])

  // Map stocks to table-friendly format
  const mappedStocks = stocks.map((s) => {
    const product = products.find((p) => p.id === s.product_id)
    const warehouse = warehouses.find((w) => w.id === s.warehouse_id)
    // Status logic
    let status: string = "in-stock"
    if (s.quantity === 0) status = "out-of-stock"
    else if (product && s.quantity <= (product.min_stock_level || 0)) status = "low-stock"
    return {
      id: s.id,
      productName: product?.name || s.product_id,
      sku: product?.sku || "",
      quantity: s.quantity,
      binLocation: s.bin_location || "",
      warehouse: warehouse?.name || s.warehouse_id,
      category: product?.category || "",
      status,
      lastUpdated: s.updated_at || s.created_at || "",
    }
  })

  // Days filter logic
  const now = new Date()
  const days = parseInt(dateRange, 10)
  const filteredByDate = mappedStocks.filter((item) => {
    if (!item.lastUpdated) return false
    const itemDate = parseISO(item.lastUpdated)
    return isAfter(itemDate, subDays(now, days))
  })

  // Filtering logic (apply warehouse/category/status on top of date filter)
  const filteredStocks = filteredByDate.filter((item) => {
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesWarehouse && matchesCategory && matchesStatus
  })

  // Summary stats
  const totalStock = mappedStocks.reduce((sum, s) => sum + (s.quantity || 0), 0)
  const lowStockItems = mappedStocks.filter((s) => s.status === "low-stock").length
  const outOfStockItems = mappedStocks.filter((s) => s.status === "out-of-stock").length
  const totalProducts = new Set(mappedStocks.map((s) => s.productName)).size
  const warehouseCount = new Set(mappedStocks.map((s) => s.warehouse)).size
  // For value, sum cost_price * quantity if available
  const totalValue = mappedStocks.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productName)
    return sum + ((product?.cost_price || 0) * (s.quantity || 0))
  }, 0)

  const stockSummary = {
    totalStock,
    totalValue,
    lowStockItems,
    outOfStockItems,
    totalProducts,
    warehouseCount,
  }

  // CSV Export
  function exportToCSV() {
    const headers = [
      "Product Name",
      "SKU",
      "Quantity",
      "Bin Location",
      "Warehouse",
      "Category",
      "Status",
      "Last Updated",
    ]
    const rows = filteredStocks.map((s) => [
      s.productName,
      s.sku,
      s.quantity,
      s.binLocation,
      s.warehouse,
      s.category,
      s.status,
      s.lastUpdated,
    ])
    const csvContent = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `stock_export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // PDF Export
  function exportToPDF() {
    const doc = new jsPDF()
    const headers = [
      "Product Name",
      "SKU",
      "Quantity",
      "Bin Location",
      "Warehouse",
      "Category",
      "Status",
      "Last Updated",
    ]
    const rows = filteredStocks.map((s) => [
      s.productName,
      s.sku,
      s.quantity,
      s.binLocation,
      s.warehouse,
      s.category,
      s.status,
      s.lastUpdated,
    ])
    autoTable(doc, {
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      margin: { top: 20 },
    })
    doc.save(`stock_export_${Date.now()}.pdf`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-24 w-full my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full my-6" />
      </div>
    )
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Stock Overview
            </h1>
            <p className="text-muted-foreground mt-1">Monitor and analyze your inventory across all warehouses</p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            {/* Export Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportToCSV}>Export as CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={exportToPDF}>Export as PDF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 w-full max-w-screen-2xl mx-auto px-2 md:px-4"
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="min-w-0">
            <div className="bg-gradient-to-br from-card to-card/50 border shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Total Stock</p>
                  <p className="text-3xl font-bold group-hover:text-blue-600 transition-colors truncate">
                    {Math.round(stockSummary.totalStock).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+12%</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex-shrink-0">
                  <Package className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
          {/* Card 2 */}
          <motion.div variants={itemVariants} className="min-w-0">
            <div className="bg-gradient-to-br from-card to-card/50 border shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-3xl font-bold group-hover:text-green-600 transition-colors truncate">
                    ${stockSummary.totalValue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+8.5%</span>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex-shrink-0">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
          {/* Card 3 */}
          <motion.div variants={itemVariants} className="min-w-0">
            <div className="bg-gradient-to-br from-card to-card/50 border shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold group-hover:text-yellow-600 transition-colors truncate">
                    {stockSummary.lowStockItems}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs text-yellow-500">Needs attention</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex-shrink-0">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
          {/* Card 4 */}
          <motion.div variants={itemVariants} className="min-w-0">
            <div className="bg-gradient-to-br from-card to-card/50 border shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-full">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Out of Stock</p>
                  <p className="text-3xl font-bold group-hover:text-red-600 transition-colors truncate">
                    {stockSummary.outOfStockItems}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500">Critical</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex-shrink-0">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col xl:flex-row gap-8 w-full max-w-screen-2xl mx-auto px-2 md:px-4"
        >
          <motion.div variants={itemVariants} className="flex-1 min-w-0">
            <StockAreaChart dateRange={dateRange} data={filteredStocks} />
          </motion.div>
          <motion.div variants={itemVariants} className="w-full xl:w-[400px] min-w-[300px]">
            <TopProductChart data={filteredStocks} />
          </motion.div>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-screen-2xl mx-auto px-2 md:px-4 mt-8"
        >
          <motion.div variants={itemVariants} className="w-full">
            <StockByWarehouseChart data={filteredStocks} warehouses={warehouses} />
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <StockFilterBar
            warehouseFilter={warehouseFilter}
            onWarehouseChange={setWarehouseFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            warehouseOptions={["all", ...warehouses.map((w) => w.name)]}
            categoryOptions={["all", ...categories]}
          />
        </motion.div>

        {/* Stock Table */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          {isMobile ? (
            <StockAccordionMobile
              data={filteredStocks}
              warehouseFilter={warehouseFilter}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
            />
          ) : (
            <StockTable
              data={filteredStocks}
              warehouseFilter={warehouseFilter}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}
