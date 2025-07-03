import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function DailyTrafficChart() {
  const data = [2, 4, 6, 8, 7, 9, 6, 8, 5, 7, 9, 6]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Daily Traffic</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">2,579</div>
          <div className="text-sm text-gray-500 mb-2">Visitors</div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 text-sm font-medium">+2.45%</span>
          </div>
        </div>

        <div className="h-24 flex items-end justify-between space-x-1">
          {data.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-purple-500 to-blue-400 rounded-t-sm flex-1"
              style={{ height: `${value * 8}px` }}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
