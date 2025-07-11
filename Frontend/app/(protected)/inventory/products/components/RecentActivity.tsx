"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Activity {
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
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium">{activity.action}</span>
                <span className="text-gray-500"> • {activity.item}</span>
              </div>
              <span className="text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
