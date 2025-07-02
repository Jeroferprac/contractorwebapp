import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
const tableData = [
  { name: "Horizon UI PRO", progress: 17.5, quantity: 2458, date: "24 Jan 2021", checked: false },
  { name: "Horizon UI Free", progress: 10.8, quantity: 1485, date: "12 Jun 2021", checked: true },
  { name: "Weekly Update", progress: 21.3, quantity: 1024, date: "5 Jan 2021", checked: true },
  { name: "Venus 3D Asset", progress: 31.5, quantity: 858, date: "7 Mar 2021", checked: true },
  { name: "Marketplace", progress: 12.2, quantity: 258, date: "17 Dec 2021", checked: false },
]

export function CheckTable() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Check Table</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b dark:text-white">
            <div>NAME</div>
            <div>PROGRESS</div>
            <div>QUANTITY</div>
            <div>DATE</div>
          </div>

          {tableData.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="flex items-center space-x-3">
                <Checkbox checked={item.checked} />
                <span className="text-sm font-medium">{item.name}</span>
              </div>

              <div className="text-sm font-medium">{item.quantity.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-[color:#a3aed0]">{item.date}</div>
              <div className="space-y-1">
                <div className="text-sm font-medium">{item.progress}%</div>
                <Progress value={item.progress} className="h-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
