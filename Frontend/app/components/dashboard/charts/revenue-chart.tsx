import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface RevenueChartProps {
  data: { month: string; thisMonth: number; lastMonth: number }[]
  loading: boolean
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-1" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-6 w-40 mb-4" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Calculate total from your actual data
  const totalSpent = data.reduce((sum, item) => sum + item.thisMonth, 0)
  const lastMonthTotal = data.reduce((sum, item) => sum + item.lastMonth, 0)
  const growth = lastMonthTotal > 0 ? ((totalSpent - lastMonthTotal) / lastMonthTotal) * 100 : 0

  // Generate SVG path from your actual data
  const generatePath = (dataPoints: number[], color: string) => {
    if (dataPoints.length === 0) return ""

    const maxValue = Math.max(...dataPoints)
    const minValue = Math.min(...dataPoints)
    const range = maxValue - minValue || 1

    const points = dataPoints.map((value, index) => {
      const x = 20 + index * (360 / (dataPoints.length - 1))
      const y = 180 - ((value - minValue) / range) * 120 // Scale to fit in chart area
      return `${x} ${y}`
    })

    return `M ${points.join(" L ")}`
  }

  const thisMonthData = data.map((item) => item.thisMonth)
  const lastMonthData = data.map((item) => item.lastMonth)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">This month</div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">${totalSpent.toFixed(2)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">${(totalSpent / 10).toFixed(1)}K</div>
          <div className="text-sm text-gray-500 mb-2">Total Spent</div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${growth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(2)}%
            </span>
            <Badge
              variant="secondary"
              className={`border-0 ${growth >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
            >
              {growth >= 0 ? "On track" : "Below target"}
            </Badge>
          </div>
        </div>

        {/* Chart with your actual data */}
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Chart lines using your actual data */}
            <path d={generatePath(thisMonthData, "#8b5cf6")} fill="none" stroke="#8b5cf6" strokeWidth="3" />
            <path d={generatePath(lastMonthData, "#06b6d4")} fill="none" stroke="#06b6d4" strokeWidth="2" />

            {/* Data points */}
            {thisMonthData.map((value, index) => {
              const maxValue = Math.max(...thisMonthData)
              const minValue = Math.min(...thisMonthData)
              const range = maxValue - minValue || 1
              const x = 20 + index * (360 / (thisMonthData.length - 1))
              const y = 180 - ((value - minValue) / range) * 120

              return (
                <circle
                  key={`this-${index}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#8b5cf6"
                  className="hover:r-6 transition-all cursor-pointer"
                />
              )
            })}
          </svg>

          {/* Month labels from your actual data */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-4">
            {data.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
