"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar } from "recharts"

const weeklyData = [
  { day: "Mon", value: 20 },
  { day: "Tue", value: 40 },
  { day: "Wed", value: 30 },
  { day: "Thu", value: 50 },
  { day: "Fri", value: 45 },
  { day: "Sat", value: 60 },
  { day: "Sun", value: 55 },
]

export default function DailyTrafficChart() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Daily Traffic</CardTitle>
            <p className="text-2xl font-bold">
              2,579 <span className="text-sm font-normal text-muted-foreground">Visitors</span>
            </p>
            <p className="text-sm text-green-600">+2.45%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklyData}>
            <Bar dataKey="value" fill="#4318FF" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
