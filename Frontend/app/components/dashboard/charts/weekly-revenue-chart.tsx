import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WeeklyRevenueChart() {
  const data = [
    { day: "17", value: 60 },
    { day: "18", value: 80 },
    { day: "19", value: 70 },
    { day: "20", value: 90 },
    { day: "21", value: 85 },
    { day: "22", value: 95 },
    { day: "23", value: 75 },
    { day: "24", value: 100 },
    { day: "25", value: 90 },
  ]

  return (
    <Card className="border-0 shadow-sm bg-white dark:bg-[#020817]">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Revenue</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="h-48 flex items-end justify-between space-x-1 overflow-hidden">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1 min-w-0">
              <div className="relative w-full max-w-8">
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-purple-600 hover:to-blue-500"
                  style={{ height: `${(item.value / 100) * 120}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
