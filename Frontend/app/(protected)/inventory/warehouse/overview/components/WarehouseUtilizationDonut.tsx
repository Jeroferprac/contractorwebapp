"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Building } from "lucide-react"
import { motion } from "framer-motion"

export interface UtilizationDatum {
  name: string
  value: number
  color: string
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-xl border-0 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-semibold text-gray-900 dark:text-white">{data.name}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Utilization: {data.value}%</p>
      </div>
    )
  }
  return null
}

export function WarehouseUtilizationDonut({ data }: { data: UtilizationDatum[] }) {
  // Enhanced gradient colors
  const enhancedData = data.map((item, index) => ({
    ...item,
    color: [
      "#8b5cf6", // Purple
      "#10b981", // Emerald
      "#f59e0b", // Amber
      "#ef4444", // Red
      "#3b82f6", // Blue
      "#ec4899", // Pink
    ][index % 6],
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
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Warehouse Utilization</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {enhancedData.map((entry, index) => (
                    <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={enhancedData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {enhancedData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index})`}
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
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enhancedData.reduce((sum, item) => sum + item.value, 0) / enhancedData.length}%
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Usage</p>
              </div>
            </div>
          </div>

          {/* Horizontal legend */}
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {enhancedData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{entry.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
