import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative"
  icon?: React.ReactNode
  color?: string
}

export function StatsCard({ title, value, change, changeType, icon, color = "blue" }: StatsCardProps) {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <div className="flex items-center mt-1">
                {changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          {icon && <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>}
        </div>
      </CardContent>
    </Card>
  )
}