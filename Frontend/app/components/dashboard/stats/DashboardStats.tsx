"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  BarChart3,
  DollarSign,
  CheckCircle,
  Briefcase
} from "lucide-react"

interface StatsProps {
  stats: {
    earnings: number
    spend: number
    sales: number
    balance: number
    tasks: number
  }
  loading: boolean
}

export default function DashboardStats({ stats, loading }: StatsProps) {
  const cardData = [
    {
      title: "Earnings",
      value: loading ? "..." : `$${stats.earnings}`,
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100"
    },
    {
      title: "Spend this month",
      value: loading ? "..." : `$${stats.spend}`,
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      bg: "bg-green-100"
    },
    {
      title: "Sales",
      value: loading ? "..." : `$${stats.sales}`,
      subtext: "+23% since last month"
    },
    {
      title: "Your balance",
      value: loading ? "..." : `$${stats.balance}`,
      icon: <span className="text-white text-xs font-bold">🇺🇸</span>,
      bg: "bg-red-500 rounded-sm",
      small: true
    },
    {
      title: "New Tasks",
      value: loading ? "..." : `${stats.tasks}`,
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-100"
    },
    {
      title: "Total Projects",
      value: "2935",
      icon: <Briefcase className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-100"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
      {cardData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {stat.icon && (
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.subtext && <p className="text-sm text-green-600">{stat.subtext}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
