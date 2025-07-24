"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Package, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StockPagination } from "./StockPagination"

interface StockTableProps {
  data: Array<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    binLocation: string;
    warehouse: string;
    category: string;
    status: string;
    lastUpdated: string;
  }>
  warehouseFilter: string
  categoryFilter: string
  statusFilter: string
}

const statusColors = {
  "in-stock": "bg-green-500/10 text-green-500 border-green-500/20",
  "low-stock": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "out-of-stock": "bg-red-500/10 text-red-500 border-red-500/20",
}

export function StockTable({ data, warehouseFilter, categoryFilter, statusFilter }: StockTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredData = data.filter((item) => {
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesWarehouse && matchesCategory && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

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
          <Package className="w-5 h-5 text-blue-500" />
          Stock Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("productName")}>
                Product Name
                <ArrowUpDown className="w-4 h-4 ml-1 inline" />
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("sku")}>
                SKU
                <ArrowUpDown className="w-4 h-4 ml-1 inline" />
              </TableHead>
              <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("quantity")}>
                Quantity
                <ArrowUpDown className="w-4 h-4 ml-1 inline" />
              </TableHead>
              <TableHead>Bin Location</TableHead>
              <TableHead>Warehouse</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group"
              >
                <TableCell className="font-medium group-hover:text-purple-600 transition-colors">
                  {item.productName}
                </TableCell>
                <TableCell className="font-mono text-sm group-hover:text-foreground/80 transition-colors">
                  {item.sku}
                </TableCell>
                <TableCell className="group-hover:text-foreground/80 transition-colors">
                  {item.quantity.toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-sm group-hover:text-foreground/80 transition-colors">
                  {item.binLocation}
                </TableCell>
                <TableCell className="group-hover:text-foreground/80 transition-colors">{item.warehouse}</TableCell>
                <TableCell>
                  <Badge
                    className={`${statusColors[item.status as keyof typeof statusColors]} group-hover:scale-105 transition-transform`}
                  >
                    {item.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
                  {new Date(item.lastUpdated).toLocaleDateString()}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Stock</DropdownMenuItem>
                      <DropdownMenuItem>Move to Bin</DropdownMenuItem>
                      <DropdownMenuItem>Generate Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <StockPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </CardContent>
    </Card>
  )
}
