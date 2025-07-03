import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const tableData = [
  { name: "Horizon UI PRO", status: "Approved", date: "18 Apr 2021", progress: 75 },
  { name: "Horizon UI Free", status: "Disable", date: "18 Apr 2021", progress: 35 },
  { name: "Marketplace", status: "Error", date: "20 May 2021", progress: 90 },
  { name: "Weekly Updates", status: "Approved", date: "12 Jul 2021", progress: 60 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700"
    case "Disable":
      return "bg-red-100 text-red-700"
    case "Error":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export function ComplexTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Complex Table</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
            <div>NAME</div>
            <div>STATUS</div>
            <div>DATE</div>
            <div>PROGRESS</div>
          </div>

          {tableData.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="text-sm font-medium">{item.name}</div>
              <div>
                <Badge variant="secondary" className={`${getStatusColor(item.status)} border-0`}>
                  {item.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">{item.date}</div>
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
