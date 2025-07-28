"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Download, RefreshCw, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InboundOutboundChart } from "./components/InboundOutboundChart"
import { DailyTransfersChart } from "./components/DailyTransfersChart"
import { TransferByWarehouseChart } from "./components/TransferByWarehouseChart"
import { TransferStatusDonut } from "./components/TransferStatusDonut"
import { TransferFilter } from "./components/TransferFilter"
import { TransferTable } from "./components/TransferTable"
import { TransferForm } from "./components/TransferForm"
import { TransferAccordionMobile } from "./components/TransferAccordionMobile"
import { useIsMobile } from "@lib/hooks/use-mobile"
import { getTransfers, getWarehouses } from "@/lib/warehouse"
import type { Warehouse, WarehouseTransfer } from "@/types/warehouse"
import { Skeleton } from "@/components/ui/skeleton"
import { parseISO, isAfter, isBefore } from "date-fns"

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

export default function TransfersPage() {
  const [showTransferForm, setShowTransferForm] = useState(false)
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [warehouseFilter, setWarehouseFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMobile = useIsMobile()

  // Refactored: Move fetching logic to a function
  const fetchTransfers = () => {
    setLoading(true)
    setError(null)
    Promise.all([
      getTransfers(),
      getWarehouses(),
    ])
      .then(([transferData, warehouseData]) => {
        setTransfers(transferData)
        setWarehouses(warehouseData)
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load transfer data.")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransfers()
  }, [])

  // Map and filter transfers
  const mappedTransfers = transfers.map((t) => {
    const fromWarehouse = warehouses.find((w) => w.id === t.from_warehouse_id)?.name || t.from_warehouse_id
    const toWarehouse = warehouses.find((w) => w.id === t.to_warehouse_id)?.name || t.to_warehouse_id
    const itemsCount = Array.isArray(t.items) ? t.items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0) : t.quantity || 0
    return {
      id: t.id,
      fromWarehouse,
      toWarehouse,
      items: itemsCount,
      date: t.transfer_date || t.created_at || "",
      status: t.status,
      priority: "medium", // Placeholder, can be derived if needed
    }
  })

  // Filtering logic
  const filteredTransfers = mappedTransfers.filter((item) => {
    // Date range filter
    let inRange = true
    if (dateRange.from && dateRange.to) {
      const d = item.date ? parseISO(item.date) : null
      if (d) {
        inRange = isAfter(d, parseISO(dateRange.from)) && isBefore(d, parseISO(dateRange.to))
      }
    }
    // Warehouse filter
    let whMatch = warehouseFilter.length === 0 || warehouseFilter.includes(item.fromWarehouse) || warehouseFilter.includes(item.toWarehouse)
    // Status filter
    let statusMatch = statusFilter === "all" || item.status === statusFilter
    return inRange && whMatch && statusMatch
  })

  // Summary stats
  const thisWeek = filteredTransfers.length
  const completed = filteredTransfers.filter((t) => t.status === "completed").length
  const pending = filteredTransfers.filter((t) => t.status === "pending").length
  const cancelled = filteredTransfers.filter((t) => t.status === "cancelled").length
  const totalInbound = filteredTransfers.filter((t) => t.status === "completed" && t.toWarehouse).length
  const totalOutbound = filteredTransfers.filter((t) => t.status === "completed" && t.fromWarehouse).length
  const weeklyChange = 0 // Placeholder, can be calculated with previous week data
  const transferSummary = {
    thisWeek,
    weeklyChange,
    totalInbound,
    totalOutbound,
    completed,
    pending,
    cancelled,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-24 w-full my-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
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
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Stock Transfers
            </h1>
            <p className="text-muted-foreground">Manage and track inventory transfers between warehouses</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            <Button
              type="button"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 rounded-xl px-4 py-2 font-medium transition-all duration-300 shadow-lg flex items-center gap-2"
              onClick={() => setShowTransferForm(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Transfer
            </Button>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <div className="bg-white border shadow-lg rounded-xl p-6 hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Transfers This Week</p>
                  <p className="text-3xl font-bold group-hover:text-blue-600 transition-colors dark:text-white">
                    {transferSummary.thisWeek}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <ArrowUpDown className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500">+{transferSummary.weeklyChange}%</span>
                    <span className="text-xs text-muted-foreground dark:text-gray-400">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white border shadow-lg rounded-xl p-6 hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-white rotate-180" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Inbound Transfers</p>
                  <p className="text-3xl font-bold group-hover:text-green-600 transition-colors dark:text-white">
                    {transferSummary.totalInbound}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">This month</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white border shadow-lg rounded-xl p-6 hover:shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 group hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Outbound Transfers</p>
                  <p className="text-3xl font-bold group-hover:text-orange-600 transition-colors dark:text-white">
                    {transferSummary.totalOutbound}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">This month</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white border shadow-lg rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group hover:-translate-y-2 dark:bg-gray-900 dark:border-gray-700">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                  <ArrowUpDown className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Completion Rate</p>
                  <p className="text-3xl font-bold group-hover:text-purple-600 transition-colors dark:text-white">
                    {transferSummary.thisWeek > 0 ? Math.round((transferSummary.completed / transferSummary.thisWeek) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-gray-400">Success rate</p>
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
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          <motion.div variants={itemVariants} className="xl:col-span-2 h-full">
            <InboundOutboundChart data={filteredTransfers} />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <TransferStatusDonut data={filteredTransfers} />
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 h-full">
            <DailyTransfersChart data={filteredTransfers} />
          </motion.div>

          <motion.div variants={itemVariants} className="h-full">
            <TransferByWarehouseChart data={filteredTransfers} />
          </motion.div>
        </motion.div>

        {/* Transfer Table */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          {isMobile ? (
            <TransferAccordionMobile data={filteredTransfers} />
          ) : (
            <TransferTable data={filteredTransfers} />
          )}
        </motion.div>
      </div>

      {/* Transfer Form Modal */}
      <TransferForm
        isOpen={showTransferForm}
        onClose={() => setShowTransferForm(false)}
        isEditing={true}
        transfer={null}
      />
    </div>
  )
}
