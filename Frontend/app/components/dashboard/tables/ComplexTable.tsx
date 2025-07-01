"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {MoreHorizontal} from "lucide-react"

const complexTableData = [
  { name: "Horizon UI PRO", status: "Approved", date: "18 Apr 2021", progress: 75 },
  { name: "Horizon UI Free", status: "Disable", date: "18 Apr 2021", progress: 35 },
  { name: "Marketplace", status: "Error", date: "20 May 2021", progress: 90 },
  { name: "Weekly Updates", status: "Approved", date: "12 Jul 2021", progress: 60 },
]

export function ComplexTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Disable":
        return "bg-red-100 text-red-800"
      case "Error":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Complex Table</CardTitle>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2">
            <div>NAME</div>
            <div>STATUS</div>
            <div>DATE</div>
            <div>PROGRESS</div>
          </div>

          {complexTableData.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="font-medium">{item.name}</div>
              <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
              <div className="text-gray-500">{item.date}</div>
              <div className="space-y-1">
                <Progress value={item.progress} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
