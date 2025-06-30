"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const weeklyData = [
  { day: "17", value: 20 },
  { day: "18", value: 40 },
  { day: "19", value: 30 },
  { day: "20", value: 50 },
  { day: "21", value: 45 },
  { day: "22", value: 60 },
  { day: "23", value: 55 },
  { day: "24", value: 70 },
  { day: "25", value: 65 },
]

export default function WeeklyRevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="value" fill="#4318FF" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
