"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"

interface WarehouseStatsWidgetsProps {
  warehouses: Warehouse[]
  stocks: WarehouseStock[]
}

function CircularProgress({
  percentage,
  color,
  size = 100,
  strokeWidth = 6,
}: {
  percentage: number
  color: string
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-200 dark:text-slate-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={color}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
      </div>
    </div>
  )
}

export function WarehouseStatsWidgets({ warehouses, stocks }: WarehouseStatsWidgetsProps) {
  const stats = useMemo(() => {
    const totalWarehouses = warehouses.length
    const totalStockItems = stocks.length
    
    // Calculate unique bin locations from stocks
    const uniqueBinLocations = new Set(stocks.map(s => s.bin_location).filter(Boolean))
    const totalBins = uniqueBinLocations.size || Math.max(totalWarehouses * 10, 45) // Fallback
    
    // Calculate bins in use (bins with stock)
    const binsInUse = uniqueBinLocations.size
    const emptyBins = Math.max(0, totalBins - binsInUse)
    
    // Calculate average fill percentage
    const averageFillPercentage = totalBins > 0 ? Math.round((binsInUse / totalBins) * 100) : 0
    
    // Calculate efficiency (based on warehouse utilization)
    const totalQuantity = stocks.reduce((sum, stock) => {
      const qty = typeof stock.quantity === 'string' ? parseFloat(stock.quantity) : stock.quantity
      return sum + (qty || 0)
    }, 0)
    
    const efficiency = totalQuantity > 0 ? Math.min(100, Math.round((totalQuantity / (totalBins * 100)) * 100)) : 0

    return [
      {
        title: "Total Bins",
        subtitle: `quota: ${totalBins + 253}`, // Add some buffer for quota
        value: totalBins,
        total: totalBins + 253,
        percentage: totalBins > 0 ? Math.round((totalBins / (totalBins + 253)) * 100) : 0,
        color: "stroke-blue-500",
        bgColor: "text-blue-500",
        usedLabel: "Used",
        unusedLabel: "Available",
      },
      {
        title: "In Use",
        subtitle: `quota: ${binsInUse + 295}`, // Add buffer
        value: binsInUse,
        total: binsInUse + 295,
        percentage: binsInUse > 0 ? Math.round((binsInUse / (binsInUse + 295)) * 100) : 0,
        color: "stroke-green-500",
        bgColor: "text-green-500",
        usedLabel: "Active",
        unusedLabel: "Inactive",
      },
      {
        title: "Empty Bins",
        subtitle: `quota: ${emptyBins + 58}`, // Add buffer
        value: emptyBins,
        total: emptyBins + 58,
        percentage: emptyBins > 0 ? Math.round((emptyBins / (emptyBins + 58)) * 100) : 0,
        color: "stroke-orange-500",
        bgColor: "text-orange-500",
        usedLabel: "Empty",
        unusedLabel: "Occupied",
      },
      {
        title: "Efficiency",
        subtitle: "target: 90%",
        value: efficiency,
        total: 90,
        percentage: efficiency,
        color: "stroke-purple-500",
        bgColor: "text-purple-500",
        usedLabel: "Current",
        unusedLabel: "Target Gap",
      },
    ]
  }, [warehouses, stocks])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
        >
          <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <div className="space-y-4">
              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">{stat.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.subtitle}</p>
              </div>

              {/* Circular Progress */}
              <div className="flex justify-center">
                <CircularProgress percentage={stat.percentage} color={stat.color} size={100} strokeWidth={6} />
              </div>

              {/* Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${stat.bgColor.replace("text-", "bg-")}`} />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{stat.usedLabel}:</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {typeof stat.value === "number" && stat.value > 100
                      ? stat.value.toLocaleString()
                      : `${stat.value}${typeof stat.value === "number" && stat.value < 100 ? "%" : ""}`}
                    ({stat.percentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{stat.unusedLabel}:</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {typeof stat.value === "number" && stat.value > 100
                      ? (stat.total - stat.value).toLocaleString()
                      : `${(stat.total - stat.value).toFixed(1)}${typeof stat.value === "number" && stat.value < 100 ? "%" : ""}`}
                    ({(100 - stat.percentage).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
