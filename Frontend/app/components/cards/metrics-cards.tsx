import { TrendingUp, DollarSign, ShoppingCart, Wallet, CheckSquare, Folder } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MetricsCardsProps {
  stats: {
    earnings: number
    spend: number
    sales: number
    balance: number
    tasks: number
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
      icon: DollarSign,
      label: "Spend this month",
      value: `$${stats.spend}`,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: ShoppingCart,
      label: "Sales",
      value: `$${stats.sales}`,
      change: "+23% since last month",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Wallet,
      label: "Your balance",
      value: `$${stats.balance}`,
      flag: "🇺🇸",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: CheckSquare,
      label: "New Tasks",
      value: stats.tasks.toString(),
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
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 dark:text-white">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-0 shadow-sm">
          <CardContent className="p-4" >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              {metric.flag && <span className="text-lg">{metric.flag}</span>}
            </div>
            <div className="text-sm text-gray-500 mb-1 dark:text-white">{metric.label}</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
            {metric.change && <div className="text-xs text-green-500 mt-1">{metric.change}</div>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}