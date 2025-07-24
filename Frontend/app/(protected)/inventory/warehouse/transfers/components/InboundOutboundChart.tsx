"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface InboundOutboundChartProps {
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

export function InboundOutboundChart({ data }: InboundOutboundChartProps) {
  // Aggregate inbound/outbound by date
  const chartData: Record<string, { date: string; inbound: number; outbound: number }> = {}

  data.forEach((item) => {
    const date = item.date.slice(0, 10)
    if (!chartData[date]) chartData[date] = { date, inbound: 0, outbound: 0 }
    if (item.status === "completed") {
      chartData[date].inbound += item.items
      chartData[date].outbound += item.items
    }
  })

  const chartArray = Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Inbound vs Outbound Transfers</span>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">Transfer flow comparison over time</p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col pt-0">
          <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-100 dark:border-gray-700">
            <ChartContainer
              config={{
                inbound: {
                  label: "Inbound",
                  color: "#10b981",
                },
                outbound: {
                  label: "Outbound",
                  color: "#f59e0b",
                },
              }}
              className="h-[300px] flex-1"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartArray} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" vertical={false} />
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
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="inbound"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#inboundGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "white" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="outbound"
                    stroke="#f59e0b"
                    fillOpacity={1}
                    fill="url(#outboundGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2, fill: "white" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
