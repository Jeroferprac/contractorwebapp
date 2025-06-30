"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts"

interface RevenueLineChartProps {
  data: {
    month: string
    value: number
  }[]
}

export default function RevenueLineChart({ data }: RevenueLineChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">$37.5K</CardTitle>
            <p className="text-sm text-muted-foreground">Total Spent • +2.45%</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-600">On track</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">This month</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Line type="monotone" dataKey="value" stroke="#4318FF" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
