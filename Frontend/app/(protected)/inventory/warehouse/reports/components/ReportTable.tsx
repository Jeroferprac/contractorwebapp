"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, FileText } from "lucide-react"
import { StockPagination } from "../../stock/components/StockPagination"

interface ReportTableProps {
  filters: {
    dateRange: { from: string; to: string }
    warehouses: string[]
    products: string[]
    status: string
  }
  data: Array<{
    id: string;
    date: string;
    productName: string;
    quantity: number;
    sourceWarehouse: string;
    destinationWarehouse: string;
    status: string;
  }>
}

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20 dark:bg-green-500/20",
  "in-transit": "bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-500/20",
}

export function ReportTable({ filters, data }: ReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const filteredData = data.filter((item) => {
    const matchesWarehouse =
      filters.warehouses.length === 0 ||
      filters.warehouses.some(
        (wh) => item.sourceWarehouse.toLowerCase().includes(wh) || item.destinationWarehouse.toLowerCase().includes(wh),
      )
    const matchesProduct =
      filters.products.length === 0 ||
      filters.products.some((prod) => item.productName.toLowerCase().includes(prod.replace("-", " ")))
    const matchesStatus = filters.status === "all" || item.status === filters.status
    return matchesWarehouse && matchesProduct && matchesStatus
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
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Transfer Report Data
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {paginatedData.length} of {filteredData.length} transfers
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-white/5 dark:hover:bg-white/5">
                <TableHead
                  className="cursor-pointer hover:text-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
                  onClick={() => handleSort("date")}
                >
                  Date
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
                  onClick={() => handleSort("id")}
                >
                  Transfer ID
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
                  Product Name
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:text-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
                  onClick={() => handleSort("quantity")}
                >
                  Quantity
                  <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                </TableHead>
                <TableHead className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
                  Source Warehouse
                </TableHead>
                <TableHead className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
                  Destination Warehouse
                </TableHead>
                <TableHead className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((transfer, index) => (
                <motion.tr
                  key={transfer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-white/10 hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group"
                >
                  <TableCell className="group-hover:text-foreground/90 transition-colors">
                    {new Date(transfer.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium font-mono group-hover:text-purple-600 transition-colors">
                    {transfer.id}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/90 transition-colors">
                    {transfer.productName}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/90 transition-colors">
                    {transfer.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/90 transition-colors">
                    {transfer.sourceWarehouse}
                  </TableCell>
                  <TableCell className="group-hover:text-foreground/90 transition-colors">
                    {transfer.destinationWarehouse}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${statusColors[transfer.status as keyof typeof statusColors]} group-hover:scale-105 transition-transform backdrop-blur-sm`}
                    >
                      {transfer.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>

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
