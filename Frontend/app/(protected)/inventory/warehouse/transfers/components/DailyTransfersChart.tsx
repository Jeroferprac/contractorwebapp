"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Calendar } from "lucide-react"

interface DailyTransfersChartProps {
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

export function DailyTransfersChart({ data }: DailyTransfersChartProps) {
  // Aggregate by day of week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const dayTotals: Record<string, number> = {}
  data.forEach((item) => {
    const d = new Date(item.date)
    const day = days[d.getDay()]
    dayTotals[day] = (dayTotals[day] || 0) + 1
  })
  const chartArray = days.map((day) => ({ day, transfers: dayTotals[day] || 0 }))

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border shadow-lg hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
          <Calendar className="w-5 h-5 text-purple-500" />
          Daily Transfer Volume
        </CardTitle>
        <p className="text-sm text-muted-foreground">Transfer activity by day of week</p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ChartContainer config={{}} className="h-[300px] flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartArray}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs" />
              <YAxis axisLine={false} tickLine={false} className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="transfers"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#8b5cf6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
