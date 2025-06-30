"use client"

import {
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const complexTableData = [
  { name: "Horizon UI PRO", status: "Approved", date: "18 Apr 2021", progress: 75 },
  { name: "Horizon UI Free", status: "Disable", date: "18 Apr 2021", progress: 35 },
  { name: "Marketplace", status: "Error", date: "20 May 2021", progress: 90 },
  { name: "Weekly Updates", status: "Approved", date: "12 Jul 2021", progress: 50 },
]

export default function ComplexTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Complex Table</CardTitle>
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
              <TableHead>STATUS</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>PROGRESS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complexTableData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === "Approved"
                        ? "default"
                        : item.status === "Error"
                        ? "destructive"
                        : "secondary"
                    }
                    className="flex items-center gap-1 w-fit"
                  >
                    {item.status === "Approved" && <CheckCircle className="w-3 h-3" />}
                    {item.status === "Disable" && <XCircle className="w-3 h-3" />}
                    {item.status === "Error" && <AlertCircle className="w-3 h-3" />}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.date}</TableCell>
                <TableCell>
                  <Progress value={item.progress} className="w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
