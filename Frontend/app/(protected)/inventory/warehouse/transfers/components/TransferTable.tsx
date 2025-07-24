"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, ArrowUpDown, Eye, Edit, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StockPagination } from "../../stock/components/StockPagination"

interface TransferTableProps {
  data: Array<{
    id: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    date: string;
    status: string;
    priority: string;
  }>
}

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  "in-transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TransferTable({ data }: TransferTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-blue-500" />
          Transfer History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("id")}>
                  Transfer ID
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead>From Warehouse</TableHead>
                <TableHead>To Warehouse</TableHead>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("items")}>
                  Items
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((transfer) => (
                <TableRow
                  key={transfer.id}
                  className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group"
                >
                  <TableCell className="font-medium font-mono group-hover:text-purple-600 transition-colors">
                    {transfer.id}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/80 transition-colors">
                    {transfer.fromWarehouse}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/80 transition-colors">
                    {transfer.toWarehouse}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/80 transition-colors">{transfer.items}</TableCell>
                  <TableCell className="group-hover:text-foreground/80 transition-colors">
                    {new Date(transfer.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[transfer.status as keyof typeof statusColors]} group-hover:scale-105 transition-transform`}
                    >
                      {transfer.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 transition-all duration-300"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Transfer
                        </DropdownMenuItem>
                        {transfer.status === "pending" && (
                          <DropdownMenuItem className="text-red-600">
                            <X className="w-4 h-4 mr-2" />
                            Cancel Transfer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <StockPagination
          currentPage={currentPage}
          totalPages={Math.ceil(data.length / itemsPerPage)}
          itemsPerPage={itemsPerPage}
          totalItems={data.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </CardContent>
    </Card>
  )
}
