"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

interface StockAreaChartProps {
  dateRange: string
  data: Array<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    binLocation: string;
    warehouse: string;
    category: string;
    status: string;
    lastUpdated: string;
  }>
}

export function StockAreaChart({ dateRange, data }: StockAreaChartProps) {
  // Aggregate data for chart (e.g., group by date, sum quantity/value)
  // For now, just show total stock per day (by lastUpdated)
  const chartData = data.reduce((acc: Record<string, { date: string; stock: number }>, item) => {
    const date = item.lastUpdated.slice(0, 10)
    if (!acc[date]) acc[date] = { date, stock: 0 }
    acc[date].stock += item.quantity
    return acc
  }, {})
  const chartArray = Object.values(chartData).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 group">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Total Stock Trend
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">+15%</p>
            <p className="text-sm text-muted-foreground">vs last period</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Stock levels over the last {dateRange} days</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartArray}>
              <defs>
                <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} className="text-xs" tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value: string) => `Date: ${value}`}
                formatter={(value: number, name: string) => [
                  value.toLocaleString(),
                  "Stock Quantity",
                ]}
              />
              <Area
                type="monotone"
                dataKey="stock"
                stroke="#3b82f6"
                fill="url(#stockGradient)"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
