"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Legend } from "recharts"
import { Warehouse } from "lucide-react"

interface StockByWarehouseChartProps {
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
  warehouses: Array<{ id: string; name: string }>
}

export function StockByWarehouseChart({ data, warehouses }: StockByWarehouseChartProps) {
  // Aggregate data by warehouse and date
  const whNames = warehouses.map((w) => w.name)
  const chartData: Record<string, any> = {}
  data.forEach((item) => {
    const date = item.lastUpdated.slice(0, 10)
    if (!chartData[date]) chartData[date] = { date }
    whNames.forEach((wh) => {
      chartData[date][wh] = chartData[date][wh] || 0
    })
    chartData[date][item.warehouse] += item.quantity
  })
  const chartArray = Object.values(chartData).sort((a: any, b: any) => a.date.localeCompare(b.date))

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group-hover:text-green-600 transition-colors">
          <Warehouse className="w-5 h-5 text-green-500" />
          Stock by Warehouse
        </CardTitle>
        <p className="text-sm text-muted-foreground">Inventory levels across all warehouse locations</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartArray}>
              <defs>
                {whNames.map((wh, i) => (
                  <linearGradient key={wh} id={`${wh}Gradient`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4]} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {whNames.map((wh, i) => (
                <Area
                  key={wh}
                  type="monotone"
                  dataKey={wh}
                  stroke={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4]}
                  fill={`url(#${wh}Gradient)`}
                  strokeWidth={2}
                  dot={{ fill: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"][i % 4], strokeWidth: 2, r: 3 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
