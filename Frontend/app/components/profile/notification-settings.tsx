"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal } from "lucide-react"

const initialNotifications = [
  { id: "item-updates", label: "Item update notifications", enabled: true },
  { id: "item-comments", label: "Item comment notifications", enabled: false },
  { id: "buyer-reviews", label: "Buyer review notifications", enabled: true },
  { id: "rating-reminders", label: "Rating reminders notifications", enabled: false },
  { id: "meetups", label: "Meetups near you notifications", enabled: false },
  { id: "company-news", label: "Company news notifications", enabled: true },
  { id: "new-launches", label: "New launches and projects", enabled: true },
  { id: "monthly-changes", label: "Monthly product changes", enabled: false },
  { id: "newsletter", label: "Subscribe to newsletter", enabled: false },
  { id: "email-follows", label: "Email me when someone follows me", enabled: true },
]

export function NotificationSettings() {
  const [settings, setSettings] = useState(initialNotifications)

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm dark:bg-[#020817]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900">Notifications</h3>
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <label className="text-sm text-gray-600 cursor-pointer flex-1 pr-4">{setting.label}</label>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
