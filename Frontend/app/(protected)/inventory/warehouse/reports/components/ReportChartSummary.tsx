"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { TrendingUp, ArrowUpDown, Building } from "lucide-react"
import { useMemo, useState, useEffect } from "react"

interface ReportChartSummaryProps {
  filters: {
    dateRange: { from: string; to: string }
    warehouses: string[]
    products: string[]
    status: string
  }
  data: {
    transfers: Array<any>
    warehouses: Array<any>
    stocks: Array<any>
  }
}

// Loading skeleton component
const ChartSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded mb-4 w-3/4"></div>
    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl"></div>
  </div>
)

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 rounded-xl shadow-2xl p-4"
      >
        <p className="font-semibold text-gray-900 dark:text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {entry.name}: {entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

export function ReportChartSummary({ filters, data }: ReportChartSummaryProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [filters])

  // Helper: get warehouse name by id
  const getWarehouseName = (id: string) => data.warehouses.find((w: any) => w.id === id)?.name || id

  // 1. Transfer Quantity Trends (AreaChart)
  const transferTrends = useMemo(() => {
    const trends: Record<string, Record<string, number>> = {}
    data.transfers.forEach((t: any) => {
      const date = (t.transfer_date || t.created_at || "").slice(0, 10)
      const wh = getWarehouseName(t.from_warehouse_id)
      if (!trends[date]) trends[date] = {}
      const totalQty = Array.isArray(t.items)
        ? t.items.reduce((sum: number, item: any) => sum + (Number.parseFloat(item.quantity) || 0), 0)
        : 0
      trends[date][wh] = (trends[date][wh] || 0) + totalQty
    })

    const allWarehouses = Array.from(new Set(data.transfers.map((t: any) => getWarehouseName(t.from_warehouse_id))))
    return Object.entries(trends).map(([date, whObj]) => {
      const row: any = { date }
      allWarehouses.forEach((wh) => {
        row[wh] = whObj[wh] || 0
      })
      return row
    })
  }, [data.transfers, data.warehouses])

  // 2. Warehouse Share (PieChart)
  const warehouseShare = useMemo(() => {
    const totals: Record<string, number> = {}
    data.transfers.forEach((t: any) => {
      const wh = getWarehouseName(t.from_warehouse_id)
      const totalQty = Array.isArray(t.items)
        ? t.items.reduce((sum: number, item: any) => sum + (Number.parseFloat(item.quantity) || 0), 0)
        : 0
      totals[wh] = (totals[wh] || 0) + totalQty
    })
    return Object.entries(totals).map(([name, value], i) => ({
      name,
      value,
      color: ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"][i % 6],
    }))
  }, [data.transfers, data.warehouses])

  // 3. Incoming vs Outgoing (BarChart)
  const inOut = useMemo(() => {
    const whIds = data.warehouses.map((w: any) => w.id)
    return whIds.map((id) => {
      const name = getWarehouseName(id)
      const incoming = data.transfers
        .filter((t: any) => t.to_warehouse_id === id)
        .reduce(
          (sum: number, t: any) =>
            sum +
            (Array.isArray(t.items)
              ? t.items.reduce((s: number, item: any) => s + (Number.parseFloat(item.quantity) || 0), 0)
              : 0),
          0,
        )
      const outgoing = data.transfers
        .filter((t: any) => t.from_warehouse_id === id)
        .reduce(
          (sum: number, t: any) =>
            sum +
            (Array.isArray(t.items)
              ? t.items.reduce((s: number, item: any) => s + (Number.parseFloat(item.quantity) || 0), 0)
              : 0),
          0,
        )
      return { warehouse: name.length > 12 ? name.substring(0, 12) + "..." : name, fullName: name, incoming, outgoing }
    })
  }, [data.transfers, data.warehouses])

  // Colors for AreaChart
  const areaColors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#ec4899"]
  const allWarehouses = Array.from(new Set(data.transfers.map((t: any) => getWarehouseName(t.from_warehouse_id))))

  // Fix containerVariants and itemVariants transitions
  const containerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 }, // Only allowed property
    },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6 }, // Only allowed property
    },
  }

  if (isLoading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <ChartSkeleton />
        </motion.div>
        <motion.div variants={itemVariants}>
          <ChartSkeleton />
        </motion.div>
        <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-3">
          <ChartSkeleton />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {/* Transfer Trend Chart */}
      <motion.div variants={itemVariants} className="xl:col-span-2">
        <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden h-full group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="pb-4 relative">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg shadow-purple-500/25"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  Transfer Quantity Trends
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  Quantity moved per warehouse over time
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <ChartContainer config={{}} className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={transferTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      {allWarehouses.map((wh, i) => (
                        <linearGradient key={wh} id={`${wh}Gradient`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={areaColors[i % areaColors.length]} stopOpacity={0.4} />
                          <stop offset="95%" stopColor={areaColors[i % areaColors.length]} stopOpacity={0.05} />
                        </linearGradient>
                      ))}
                    </defs>
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                    />
                    <ChartTooltip content={<CustomTooltip />} />
                    {allWarehouses.map((wh, i) => (
                      <Area
                        key={wh}
                        type="monotone"
                        dataKey={wh}
                        stroke={areaColors[i % areaColors.length]}
                        fill={`url(#${wh}Gradient)`}
                        strokeWidth={3}
                        dot={{ fill: areaColors[i % areaColors.length], strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: areaColors[i % areaColors.length], strokeWidth: 2, fill: "white" }}
                      />
                    ))}
                  </AreaChart>
                </ResponsiveContainer>
                {transferTrends.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transfer data available</p>
                    </div>
                  </div>
                )}
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Warehouse Share Pie Chart */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden h-full group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="pb-4 relative">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Building className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  Warehouse Share
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  Transfer distribution by location
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <ChartContainer config={{}} className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {warehouseShare.map((entry, index) => (
                        <linearGradient key={index} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={warehouseShare}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {warehouseShare.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pieGradient-${index})`}
                          stroke="white"
                          strokeWidth={3}
                          className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {warehouseShare.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No warehouse data available</p>
                    </div>
                  </div>
                )}
              </ChartContainer>

              {/* Compact horizontal legend */}
              <div className="mt-4 flex flex-wrap gap-3 justify-center">
                {warehouseShare.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Incoming vs Outgoing Bar Chart */}
      <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-3">
        <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden h-full group hover:shadow-2xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <CardHeader className="pb-4 relative">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25"
                whileHover={{ scale: 1.1, rotate: 180 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowUpDown className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">
                  Incoming vs Outgoing Transfers
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                  Transfer flow comparison by warehouse
                </p>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <ChartContainer config={{}} className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inOut} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                      </linearGradient>
                      <linearGradient id="outgoingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="warehouse"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))", fontWeight: 500 }}
                    />
                    <ChartTooltip
                      content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 rounded-xl shadow-2xl p-4"
                            >
                              <p className="font-semibold text-gray-900 dark:text-white mb-2">{data.fullName}</p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-green-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Incoming: {data.incoming}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Outgoing: {data.outgoing}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="incoming"
                      fill="url(#incomingGradient)"
                      radius={[4, 4, 0, 0]}
                      name="Incoming"
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                    <Bar
                      dataKey="outgoing"
                      fill="url(#outgoingGradient)"
                      radius={[4, 4, 0, 0]}
                      name="Outgoing"
                      className="hover:opacity-80 transition-opacity duration-200"
                    />
                  </BarChart>
                </ResponsiveContainer>
                {inOut.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <ArrowUpDown className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No transfer data available</p>
                    </div>
                  </div>
                )}
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
