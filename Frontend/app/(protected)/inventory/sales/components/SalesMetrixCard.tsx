"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3 } from "lucide-react"
import { motion } from "framer-motion"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  chartData: number[]
  delay?: number
}

function MiniChart({ data, trend }: { data: number[]; trend: "up" | "down" }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-1 h-12 w-20">
      {data.map((value, index) => {
        const height = ((value - min) / range) * 100
        const isLast = index === data.length - 1
        return (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(height, 10)}%` }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`flex-1 rounded-sm ${
              isLast ? "bg-gradient-to-t from-purple-500 to-blue-500" : "bg-gray-400/50 dark:bg-gray-600/30"
            }`}
          />
        )
      })}
    </div>
  )
}

function MetricCard({ title, value, change, trend, icon, chartData, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-[#020817]/40 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:hover:shadow-purple-500/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg dark:shadow-purple-500/20">
                <div className="text-white">{icon}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
                    {value}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
              )}
              <span
                className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"
                }`}
              >
                {change}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">from last week</span>
            </div>
            <MiniChart data={chartData} trend={trend} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MetricCardsProps {
  salesData: any[]
}

export function MetricCards({ salesData }: MetricCardsProps) {
  // Calculate metrics from sales data
  const totalRevenue = salesData.reduce((sum, sale) => sum + Number.parseFloat(sale.total_amount || "0"), 0)
  const totalOrders = salesData.length
  const averageSale = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Mock chart data - in real app, calculate from actual data
  const revenueChart = [45, 52, 48, 61, 55, 67, 73]
  const ordersChart = [12, 15, 13, 18, 16, 21, 25]
  const avgChart = [2.1, 2.3, 2.2, 2.5, 2.4, 2.7, 2.9]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="New Net Income"
        value={`$${totalRevenue.toLocaleString()}`}
        change="0.5%"
        trend="down"
        icon={<DollarSign className="h-6 w-6 text-purple-600" />}
        chartData={revenueChart}
        delay={0}
      />
      <MetricCard
        title="Total Order"
        value={totalOrders.toLocaleString()}
        change="1.0%"
        trend="up"
        icon={<ShoppingCart className="h-6 w-6 text-purple-600" />}
        chartData={ordersChart}
        delay={0.1}
      />
      <MetricCard
        title="Average Sales"
        value={`${averageSale.toFixed(0)}`}
        change="1.0%"
        trend="up"
        icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
        chartData={avgChart}
        delay={0.2}
      />
    </div>
  )
}
