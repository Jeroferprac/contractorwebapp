"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { motion } from "framer-motion"
import { useMemo } from "react"
import type { WarehouseStock } from "@/types/warehouse"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StockAreaChartProps {
  dateRange: string
  data: WarehouseStock[]
}

export function StockAreaChart({ dateRange, data }: StockAreaChartProps) {
  // Aggregate stock data by date
  const chartData = useMemo(() => {
    if (!data.length) return []
    const days = Number.parseInt(dateRange) || 30
    const now = new Date()
    const startDate = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000)

    const dailyData: Record<string, number> = {}

    // Initialize all dates with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateKey = date.toISOString().split("T")[0]
      dailyData[dateKey] = 0
    }

    // Add actual data
    data.forEach((item) => {
      let itemDate: Date
      try {
        if (!item.created_at) {
          itemDate = new Date()
        } else {
          const parsedDate = new Date(item.created_at)
          if (isNaN(parsedDate.getTime())) {
            itemDate = new Date()
          } else {
            itemDate = parsedDate
          }
        }
      } catch (error) {
        itemDate = new Date()
      }

      const dateKey = itemDate.toISOString().split("T")[0]

      if (dailyData[dateKey]) {
        const quantity = typeof item.quantity === "string" ? Number.parseFloat(item.quantity) || 0 : item.quantity || 0
        dailyData[dateKey] += quantity
      }
    })

    // Convert to array and sort by date
    return Object.entries(dailyData)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, stock]) => ({
        date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        stock,
      }))
  }, [data, dateRange])

  // Calculate trend percentage
  const trendPercentage = useMemo(() => {
    if (chartData.length < 2) return 15

    const recent = chartData.slice(-7).reduce((sum, item) => sum + item.stock, 0)
    const previous = chartData.slice(-14, -7).reduce((sum, item) => sum + item.stock, 0)

    if (previous === 0) return 15
    const percentage = Math.round(((recent - previous) / previous) * 100)
    return percentage
  }, [chartData])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-4 border border-purple-200/50">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <p className="text-purple-600 font-medium">Stock: {payload[0].value.toLocaleString()}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-0 shadow-2xl hover:shadow-purple-500/10 transition-all duration-700 group overflow-hidden">

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 group-hover:text-purple-600 transition-colors duration-300">
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 4,
              }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
            >
              <TrendingUp className="w-5 h-5 text-white" />
            </motion.div>
            <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
              Total Stock Trend
            </span>
          </CardTitle>
          <div className="text-right">
            <motion.p
              className={`text-3xl font-bold bg-gradient-to-r ${
                trendPercentage >= 0 ? "from-green-500 to-emerald-600" : "from-red-500 to-rose-600"
              } bg-clip-text text-transparent`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
            >
              {trendPercentage >= 0 ? "+" : ""}
              {trendPercentage}%
            </motion.p>
            <p className="text-sm text-gray-500 font-medium">vs last period</p>
          </div>
        </div>
        <CardDescription className="text-gray-600 font-medium">
          Stock levels over the last {dateRange} days
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div className="w-full h-[280px] sm:h-[320px] lg:h-[350px] px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                tickMargin={12}
                interval="preserveStartEnd"
                minTickGap={30}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                tickFormatter={(value: number) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`
                  }
                  return value.toLocaleString()
                }}
                width={60}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="stock"
                stroke="url(#strokeGradient)"
                strokeWidth={3}
                fill="url(#stockGradient)"
                dot={{
                  fill: "#8b5cf6",
                  strokeWidth: 3,
                  stroke: "#fff",
                  r: 5,
                  filter: "url(#glow)",
                }}
                activeDot={{
                  r: 8,
                  stroke: "#8b5cf6",
                  strokeWidth: 3,
                  fill: "#fff",
                  filter: "url(#glow)",
                  style: { cursor: "pointer" },
                }}
                animationDuration={2500}
                animationBegin={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
