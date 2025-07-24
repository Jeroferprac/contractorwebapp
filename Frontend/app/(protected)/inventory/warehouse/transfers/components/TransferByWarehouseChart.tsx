"use client"

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

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
        <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 group-hover:text-blue-600 transition-colors">
          <Building className="w-5 h-5 text-blue-500" />
          Transfers by Warehouse
          </CardTitle>
        <p className="text-sm text-muted-foreground">Transfer volume by location</p>
        </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={{}} className="h-[300px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartArray}>
              <XAxis dataKey="warehouse" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="transfers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
  )
}
