"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const checkTableData = [
  { name: "Horizon UI PRO", progress: 17.5, quantity: 2458, date: "24 Jan 2021", checked: false },
  { name: "Horizon UI Free", progress: 10.8, quantity: 1485, date: "12 Jun 2021", checked: true },
  { name: "Weekly Update", progress: 21.3, quantity: 1024, date: "5 Jan 2021", checked: true },
  { name: "Venus 3D Asset", progress: 31.5, quantity: 858, date: "7 Mar 2021", checked: true },
  { name: "Marketplace", progress: 12.2, quantity: 258, date: "17 Dec 2021", checked: false },
]

export default function CheckTable() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Check Table</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NAME</TableHead>
              <TableHead>PROGRESS</TableHead>
              <TableHead>QUANTITY</TableHead>
              <TableHead>DATE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checkTableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={item.checked} />
                    <span>{item.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.progress}%</span>
                    <Progress value={item.progress} className="w-16" />
                  </div>
                </TableCell>
                <TableCell>{item.quantity.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
