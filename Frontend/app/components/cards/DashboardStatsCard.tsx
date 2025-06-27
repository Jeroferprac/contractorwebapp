import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface DashboardStatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  isLoading?: boolean
  className?: string
}

export function DashboardStatsCard({
  title,
  value,
  icon,
  isLoading,
  className,
}: DashboardStatsCardProps) {
  return (
    <Card className={cn("p-4", className)}>
      <CardContent className="p-0 space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm text-gray-500">{title}</span>
        </div>
        {isLoading ? (
          <Skeleton className="h-6 w-20" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </CardContent>
    </Card>
  )
}
