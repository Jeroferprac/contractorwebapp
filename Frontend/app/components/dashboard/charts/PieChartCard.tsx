"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const pieData = [
  { name: "Desktop", value: 63, color: "#4318FF" },
  { name: "Mobile", value: 25, color: "#6AD2FF" },
  { name: "Tablet", value: 12, color: "#EFF4FB" },
]

export default function PieChartCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your Pie Chart</CardTitle>
          <span className="text-sm text-muted-foreground">Monthly</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full" />
            <span className="text-sm">63%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full" />
            <span className="text-sm">25%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
