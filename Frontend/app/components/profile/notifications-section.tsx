import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal } from "lucide-react"

const notifications = [
  { label: "Item update notifications", enabled: true },
  { label: "Item comment notifications", enabled: false },
  { label: "Buyer review notifications", enabled: true },
  { label: "Rating reminders notifications", enabled: false },
  { label: "Meetups near you notifications", enabled: false },
  { label: "Company news notifications", enabled: true },
  { label: "New launches and projects", enabled: true },
  { label: "Monthly product changes", enabled: false },
  { label: "Subscribe to newsletter", enabled: false },
  { label: "Email me when someone follows me", enabled: true },
]

export function NotificationsSection() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notifications</CardTitle>
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-500 ">{notification.label}</span>
              <Switch checked={notification.enabled} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}