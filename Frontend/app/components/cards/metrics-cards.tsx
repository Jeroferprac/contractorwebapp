import { TrendingUp, DollarSign, ShoppingCart, Wallet, CheckSquare, Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricsCardsProps {
  stats: {
    earnings: number
    quotation: number
    projects: number
  }
  loading: boolean
}

export function MetricsCards({ stats, loading }: MetricsCardsProps) {
  const metrics = [
    {
      icon: TrendingUp,
      label: "Earnings",
      value: `$${stats.earnings}`,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: CheckSquare,
      label: "Quotation",
      value: stats.quotation.toString(),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Folder,
      label: "Total Projects",
      value: stats.projects.toString(),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg" />
              </div>
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-6 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-sm w-full">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${metric.color}`} />
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mb-1 dark:text-white">{metric.label}</div>
            <div className="text-lg sm:text-xl xl:text-2xl font-bold text-gray-900 dark:text-white break-words">
              {metric.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
