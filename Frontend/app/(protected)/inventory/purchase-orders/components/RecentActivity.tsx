"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface Activity {
  action: string
  item: string
  time: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Clock className="h-4 w-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">
                {activity.action} {activity.item}
              </p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 