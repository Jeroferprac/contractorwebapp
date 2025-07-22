"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState } from "react"

interface ChartData {
  name: string
  sales: number
  orders: number
  revenue: number
}

interface ProfessionalAreaChartProps {
  chartData: ChartData[]
}

export function ProfessionalAreaChart({ chartData }: ProfessionalAreaChartProps) {
  const [activeTab, setActiveTab] = useState<"Day" | "Week" | "Month" | "Year">("Week")

  const totalSales = chartData.reduce((sum, item) => sum + item.revenue, 0)

  const chartConfig = {
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-1))",
    },
  }

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg dark:bg-[#020817]/40 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:shadow-purple-500/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
                Overall sales
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
                  ${totalSales.toLocaleString()}
                </span>
                <span className="px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium rounded-full shadow-lg dark:shadow-purple-500/20">
                  +2.1%
                </span>
              </div>
            </div>
            <div className="flex gap-1 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-lg p-1">
              {(["Day", "Week", "Month", "Year"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  className={`text-xs ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-sm dark:shadow-purple-500/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  className="dark:fill-gray-400"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  className="dark:fill-gray-400"
                  tickFormatter={(value: number) => `$${value}k`}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent className="dark:bg-[#020817]/90 dark:backdrop-blur-xl dark:border-white/20" />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="url(#purpleBlueGradient)"
                  strokeWidth={3}
                  fill="url(#salesGradient)"
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2, fill: "#fff" }}
                />
                <defs>
                  <linearGradient id="purpleBlueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
