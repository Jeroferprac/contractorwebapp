"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface TransferStatusDonutProps {
  data: Array<{
    id: string
    fromWarehouse: string
    toWarehouse: string
    items: number
    date: string
    status: string
    priority: string
  }>
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl border-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold text-gray-900 dark:text-white capitalize">{data.name}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Count: {data.value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {((data.value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    )
  }
  return null
}

export function TransferStatusDonut({ data }: TransferStatusDonutProps) {
  // Aggregate by status
  const statusColors = {
    completed: "#10b981",
    "in-transit": "#3b82f6",
    pending: "#f59e0b",
    cancelled: "#ef4444",
  }

  const statusTotals: Record<string, number> = {}
  data.forEach((item) => {
    statusTotals[item.status] = (statusTotals[item.status] || 0) + 1
  })

  const total = Object.values(statusTotals).reduce((sum, val) => sum + val, 0)

  const chartArray = Object.entries(statusTotals).map(([name, value]) => ({
    name,
    value,
    total,
    color: statusColors[name as keyof typeof statusColors] || "#8884d8",
  }))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Transfer Status</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Current status distribution</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="h-[280px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {chartArray.map((entry, index) => (
                    <linearGradient key={index} id={`statusGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={chartArray}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartArray.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#statusGradient-${index})`}
                      stroke="white"
                      strokeWidth={3}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          {/* Compact horizontal legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {chartArray.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {entry.name.replace("-", " ")}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
