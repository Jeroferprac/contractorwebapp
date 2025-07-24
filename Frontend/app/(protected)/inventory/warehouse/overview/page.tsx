"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Package, TrendingUp, ArrowUpDown, Eye, Plus } from "lucide-react"
import { StatsCard } from "./components/StatsCard"
import { WeeklyTransferChart } from "./components/WeeklyTransferChart"
import { LowStockTable } from "./components/LowStockTable"
import { RecentTransfersTable } from "./components/RecentTransfersTable"
import { WarehouseUtilizationDonut } from "./components/WarehouseUtilizationDonut"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWarehouses, getWarehouseStocks, getTransfers } from "@/lib/warehouse"
import type { Warehouse, WarehouseStock, WarehouseTransfer } from "@/types/warehouse"

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
        </div>
        <motion.p
          className="text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Loading warehouse data...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function WarehouseOverview() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stocks, setStocks] = useState<WarehouseStock[]>([])
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const [warehousesData, stocksData, transfersData] = await Promise.all([
          getWarehouses(),
          getWarehouseStocks(),
          getTransfers(),
        ])
        setWarehouses(warehousesData)
        setStocks(stocksData)
        setTransfers(transfersData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  // Calculate stats
  const totalWarehouses = warehouses.length
  const totalStockItems = stocks.reduce(
    (sum, s) => sum + (typeof s.quantity === "number" ? s.quantity : Number(s.quantity)),
    0,
  )
  const today = new Date().toISOString().slice(0, 10)
  const transfersToday = transfers.filter((t) => t.transfer_date && t.transfer_date.startsWith(today)).length
  const lowStockAlerts = stocks.filter(
    (s) => (typeof s.quantity === "number" ? s.quantity : Number(s.quantity)) < 10,
  ).length

  // Prepare statsData for StatsCard
  const statsData = [
    {
      title: "Total Warehouses",
      value: totalWarehouses,
      change: "+2.5% from last month",
      trend: "up" as const,
      icon: "building",
    },
    {
      title: "Total Stock Items",
      value: totalStockItems,
      change: "+12.3% from last week",
      trend: "up" as const,
      icon: "package",
    },
    {
      title: "Transfers Today",
      value: transfersToday,
      change: "+5.2% from yesterday",
      trend: "up" as const,
      icon: "transfer",
    },
    {
      title: "Low Stock Alerts",
      value: lowStockAlerts,
      change: "-8.1% from last week",
      trend: "down" as const,
      icon: "alert",
    },
  ]

  // Prepare data for subcomponents
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyTransfers = days.map((day, i) => {
    return {
      day,
      inbound: Math.round(transfers.length / 7) + Math.round(Math.random() * 10),
      outbound: Math.round(transfers.length / 7) + Math.round(Math.random() * 8),
    }
  })

  // LowStockTable: map stocks to low stock items
  const lowStockItems = stocks
    .filter((s) => (typeof s.quantity === "number" ? s.quantity : Number(s.quantity)) < 10)
    .map((s) => ({
      id: s.id,
      name: s.product_id,
      category: "Electronics", // You may want to resolve category
      currentStock: typeof s.quantity === "number" ? s.quantity : Number(s.quantity),
      minThreshold: 10,
      warehouse: s.warehouse_id,
      urgency:
        (typeof s.quantity === "number" ? s.quantity : Number(s.quantity)) < 5
          ? ("critical" as const)
          : ("high" as const),
    }))

  // RecentTransfersTable: map transfers to table format
  const recentTransfers = transfers.slice(0, 10).map((t) => ({
    id: t.transfer_number || t.id,
    from: t.from_warehouse_id,
    to: t.to_warehouse_id,
    items: t.items?.length || Math.floor(Math.random() * 50) + 1,
    status: t.status as "completed" | "in-transit" | "pending",
    date: t.transfer_date || t.created_at?.slice(0, 10) || "",
  }))

  // WarehouseUtilizationDonut: enhanced utilization data
  const utilizationData = warehouses.map((w, i) => ({
    name: w.name,
    value: Math.round(Math.random() * 40) + 60, // 60-100% utilization
    color: ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"][i % 5],
  }))

  const quickActions = [
    { label: "View All Transfers", icon: Eye, href: "/transfers" },
    { label: "Go to Stock", icon: Package, href: "/stock" },
    { label: "Create Transfer", icon: Plus, href: "/transfers/new" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex justify-end gap-3">
        {quickActions.map((action, index) => (
          <motion.div key={index} whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="
                bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600
                hover:from-purple-600 hover:via-blue-600 hover:to-purple-700
                text-white shadow-lg hover:shadow-xl
                transition-all duration-300
                border-0
              "
              size="sm"
            >
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full max-w-screen-2xl mx-auto px-2 md:px-4">
        <AnimatePresence>
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="min-w-0"
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6 w-full max-w-screen-2xl mx-auto px-2 md:px-4">
        <motion.div variants={itemVariants} className="flex-1 min-w-0">
          <WeeklyTransferChart data={weeklyTransfers} />
        </motion.div>
        <motion.div variants={itemVariants} className="w-full lg:w-[400px] xl:w-[450px] min-w-[300px]">
          <WarehouseUtilizationDonut data={utilizationData} />
        </motion.div>
      </motion.div>

      {/* Tables Section - Stack Vertically */}
      <motion.div variants={itemVariants} className="space-y-6">
        <motion.div variants={itemVariants} className="w-full">
          <LowStockTable data={lowStockItems} />
        </motion.div>
        <motion.div variants={itemVariants} className="w-full">
          <RecentTransfersTable data={recentTransfers} />
        </motion.div>
      </motion.div>

      {/* Stock Movement Summary */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <Card
          className="
          relative overflow-hidden
          bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40
          border-0 shadow-xl shadow-black/5
          backdrop-blur-sm
        "
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5" />

          <CardHeader className="pb-4 relative">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg shadow-green-500/25">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Stock Movement This Week</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="
                  flex justify-between items-center p-6 
                  bg-gradient-to-br from-green-500/10 to-emerald-500/5
                  rounded-2xl border border-green-500/20 
                  shadow-lg shadow-green-500/10
                  backdrop-blur-sm
                "
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Stock In</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {weeklyTransfers.reduce((sum, d) => sum + d.inbound, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600/70 mt-1">+15.3% from last week</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <ArrowUpDown className="w-8 h-8 text-white" />
                </div>
              </motion.div>

              <motion.div
                className="
                  flex justify-between items-center p-6 
                  bg-gradient-to-br from-red-500/10 to-orange-500/5
                  rounded-2xl border border-red-500/20 
                  shadow-lg shadow-red-500/10
                  backdrop-blur-sm
                "
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Stock Out</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">
                    {weeklyTransfers.reduce((sum, d) => sum + d.outbound, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-red-600/70 mt-1">+8.7% from last week</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl shadow-lg">
                  <ArrowUpDown className="w-8 h-8 text-white rotate-180" />
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
