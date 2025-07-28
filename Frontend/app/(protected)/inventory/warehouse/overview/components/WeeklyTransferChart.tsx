"use client"

import * as React from "react"
import { useMemo } from "react"
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import type { WarehouseTransfer } from "@/types/warehouse"

interface WeeklyTransferChartProps {
  transfers?: WarehouseTransfer[]
}

const chartConfig = {
  transfers: {
    label: "Transfers",
  },
  inbound: {
    label: "Inbound",
    color: "#8b5cf6", // Purple
  },
  outbound: {
    label: "Outbound",
    color: "#06b6d4", // Cyan
  },
} satisfies ChartConfig

export function WeeklyTransferChart({ transfers = [] }: WeeklyTransferChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")

  // Generate real chart data from transfers
  const chartData = useMemo(() => {
    if (!transfers.length) return []

    const now = new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") daysToSubtract = 30
    else if (timeRange === "7d") daysToSubtract = 7

    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    // Filter transfers within date range
    const filteredTransfers = transfers.filter(transfer => {
      const transferDate = new Date(transfer.transfer_date || transfer.created_at)
      return transferDate >= startDate && transferDate <= now
    })

    // Group by date
    const dailyData: { [key: string]: { inbound: number; outbound: number } } = {}

    // Initialize all dates in range
    for (let i = 0; i <= daysToSubtract; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateKey = date.toISOString().split('T')[0]
      dailyData[dateKey] = { inbound: 0, outbound: 0 }
    }

    // Aggregate transfer data
    filteredTransfers.forEach(transfer => {
      const transferDate = new Date(transfer.transfer_date || transfer.created_at)
      const dateKey = transferDate.toISOString().split('T')[0]
      
      if (dailyData[dateKey]) {
        // Count as outbound (from warehouse)
        dailyData[dateKey].outbound += 1
      }
    })

    // Convert to chart format
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      inbound: data.inbound,
      outbound: data.outbound,
    }))
  }, [transfers, timeRange])

  const filteredData = chartData

  return (
    <Card className="group border-0 shadow-sm bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 h-full">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-gray-100 dark:border-gray-800 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
        <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          Weekly Transfer Activity
        </CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">Showing inbound and outbound transfers over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
            aria-label="Select a value"
          >
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900">
            <SelectItem value="90d" className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 flex-1">
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <defs>
                <linearGradient id="strokeInbound" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="strokeOutbound" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0891b2" />
                </linearGradient>
                <filter id="glowInbound">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <filter id="glowOutbound">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                className="dark:text-gray-400"
                tickFormatter={(value: any) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <Tooltip
                cursor={false}
                content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: any }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-4">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {new Date(label).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="space-y-1">
                          {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {entry.dataKey === 'inbound' ? 'Inbound' : 'Outbound'}:
                              </span>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {entry.value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="outbound"
                stroke="url(#strokeOutbound)"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2, fill: "#fff" }}
                filter="url(#glowOutbound)"
                className="animate-in fade-in duration-1000 delay-300"
              />
              <Line
                type="monotone"
                dataKey="inbound"
                stroke="url(#strokeInbound)"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
                filter="url(#glowInbound)"
                className="animate-in fade-in duration-1000"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Outbound</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-violet-600"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inbound</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
