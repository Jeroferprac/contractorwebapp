"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Printer, BarChart3, TrendingUp, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReportFilter } from "./components/ReportFilter"
import { ReportTable } from "./components/ReportTable"
import { ReportChartSummary } from "./components/ReportChartSummary"
import { ReportExportButton } from "./components/ReportExportButton"
import { PrintView } from "./components/PrintView"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useEffect } from "react"
import { getWarehouses, getWarehouseStocks, getTransfers } from "@/lib/warehouse"
import type { Warehouse, WarehouseStock, WarehouseTransfer } from "@/types/warehouse"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ReportsPage() {
  const [showPrintView, setShowPrintView] = useState(false)
  const [filters, setFilters] = useState({
    dateRange: { from: "", to: "" },
    warehouses: [] as string[],
    products: [] as string[],
    status: "all",
  })
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stocks, setStocks] = useState<WarehouseStock[]>([])
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      getWarehouses(),
      getWarehouseStocks(),
      getTransfers(),
    ])
      .then(([warehousesData, stocksData, transfersData]) => {
        setWarehouses(warehousesData)
        setStocks(stocksData)
        setTransfers(transfersData)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load report data.")
        setLoading(false)
      })
  }, [])

  // Map transfers to table-friendly format
  const mappedTransfers = transfers.map((t) => {
    // Find product name from stocks (if available)
    let productName = t.product_id || "Unknown"
    const stock = stocks.find((s) => s.product_id === t.product_id)
    if (stock) {
      productName = stock.product_id // Replace with actual product name if available
    }
    // Find warehouse names
    const sourceWarehouse = warehouses.find((w) => w.id === t.from_warehouse_id)?.name || t.from_warehouse_id
    const destinationWarehouse = warehouses.find((w) => w.id === t.to_warehouse_id)?.name || t.to_warehouse_id
    return {
      id: t.id,
      date: t.created_at || t.transfer_date || "",
      productName,
      quantity: t.quantity || 0,
      sourceWarehouse,
      destinationWarehouse,
      status: t.status,
    }
  })

  // Calculate summary
  const totalTransfers = mappedTransfers.length
  const totalQuantity = mappedTransfers.reduce((sum, t) => sum + (t.quantity || 0), 0)
  const completedTransfers = mappedTransfers.filter((t) => t.status === "completed").length
  const averageTransferTime = "N/A" // Needs backend support for timestamps

  // Data for charts (pass all raw data for now)
  const chartData = {
    transfers,
    warehouses,
    stocks,
  }

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading reports...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  if (showPrintView) {
    return <PrintView onClose={() => setShowPrintView(false)} filters={filters} data={mappedTransfers} />
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Transfer Reports
            </h1>
            <p className="text-muted-foreground">Comprehensive analytics and reporting for warehouse transfers</p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPrintView(true)}
              className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 backdrop-blur-sm"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>

            <ReportExportButton filters={filters} />
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Transfers</p>
                    <p className="text-3xl font-bold group-hover:text-purple-600 transition-colors">
                      {totalTransfers.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">+12.5%</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-green-500/10 transition-all duration-500 group overflow-hidden relative h-full">
              <CardContent className="p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Total Quantity</p>
                    <p className="text-3xl font-bold group-hover:text-green-600 transition-colors">
                      {totalQuantity.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-500">Items moved</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold group-hover:text-blue-600 transition-colors">
                      {totalTransfers > 0 ? Math.round((completedTransfers / totalTransfers) * 100) : 0}%
                    </p>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">Excellent</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group overflow-hidden relative h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <CardContent className="p-6 relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Avg Transfer Time</p>
                    <p className="text-3xl font-bold group-hover:text-orange-600 transition-colors">
                      {averageTransferTime}
                    </p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-500">Improving</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <ReportFilter filters={filters} onFiltersChange={handleFilterChange} />
        </motion.div>

        {/* Chart Summary */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <ReportChartSummary filters={filters} data={chartData} />
        </motion.div>

        {/* Report Table */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <ReportTable filters={filters} data={mappedTransfers} />
        </motion.div>
      </div>
    </div>
  )
}
