"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Package } from "lucide-react"

interface TopProductChartProps {
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

export function TopProductChart({ data }: TopProductChartProps) {
  // Aggregate top 5 products by total quantity
  const productTotals: Record<string, number> = {}
  data.forEach((item) => {
    productTotals[item.productName] = (productTotals[item.productName] || 0) + item.quantity
  })
  const topProducts = Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], i) => ({
      name,
      value,
      color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"][i % 5],
    }))
  // Chart data: one bar per product
  const chartData = topProducts.map((p) => ({ product: p.name, quantity: p.value }))

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
          <Package className="w-5 h-5 text-purple-500" />
          Top 5 Products
        </CardTitle>
        <p className="text-sm text-muted-foreground">Stock movement by product</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                {topProducts.map((p, i) => (
                  <linearGradient key={p.name} id={`${p.name}Gradient`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={p.color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={p.color} stopOpacity={0.1} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="product" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              {topProducts.map((p, i) => (
                <Area
                  key={p.name}
                  type="monotone"
                  dataKey="quantity"
                  stroke={p.color}
                  fill={`url(#${p.name}Gradient)`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        {/* Legend */}
        <div className="mt-4 space-y-2">
          {topProducts.map((p, i) => (
            <div key={p.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-muted-foreground">{p.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
