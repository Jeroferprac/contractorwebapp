"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Building } from "lucide-react"

interface TransferByWarehouseChartProps {
  data: Array<{
    id: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    date: string;
    status: string;
    priority: string;
  }>
}

export function TransferByWarehouseChart({ data }: TransferByWarehouseChartProps) {
  // Aggregate by warehouse
  const whTotals: Record<string, number> = {}
  data.forEach((item) => {
    whTotals[item.toWarehouse] = (whTotals[item.toWarehouse] || 0) + 1
  })
  const chartArray = Object.entries(whTotals).map(([warehouse, transfers]) => ({ warehouse, transfers }))

  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  return (
    <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors text-gray-900 dark:text-gray-100">
          <Building className="w-5 h-5 text-blue-500" />
          Transfers by Warehouse
        </CardTitle>
        <p className="text-sm text-muted-foreground dark:text-gray-400">Transfer volume by location</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={{}} className="h-[300px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartArray}>
              <XAxis dataKey="warehouse" axisLine={false} tickLine={false} className="text-xs" tick={{ fill: isDark ? "#d1d5db" : "#374151" }} />
              <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{ fill: isDark ? "#d1d5db" : "#374151" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="transfers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
