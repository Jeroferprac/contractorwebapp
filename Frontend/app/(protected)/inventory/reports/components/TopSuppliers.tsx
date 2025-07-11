import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const chartData = [
  { name: "Apple", value: 35, color: "#3b82f6" },
  { name: "Samsung", value: 25, color: "#10b981" },
  { name: "Huawei", value: 20, color: "#8b5cf6" },
  { name: "Others", value: 20, color: "#06b6d4" },
]

export function TopSuppliersChart() {
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const createPath = (percentage: number, cumulativePercentage: number) => {
    const startAngle = (cumulativePercentage / 100) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((cumulativePercentage + percentage) / 100) * 2 * Math.PI - Math.PI / 2

    const x1 = 50 + 35 * Math.cos(startAngle)
    const y1 = 50 + 35 * Math.sin(startAngle)
    const x2 = 50 + 35 * Math.cos(endAngle)
    const y2 = 50 + 35 * Math.sin(endAngle)

    const largeArc = percentage > 50 ? 1 : 0

    return `M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Top Suppliers</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 100 100" className="w-32 h-32">
              {chartData.map((item, index) => {
                const path = createPath(item.value, cumulativePercentage)
                cumulativePercentage += item.value
                return <path key={index} d={path} fill={item.color} stroke="white" strokeWidth="0.5" />
              })}
              {/* Inner circle to create donut effect */}
              <circle cx="50" cy="50" r="18" fill="white" />
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name}</span>
              </div>
              <span className="text-xs font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
