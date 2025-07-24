"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  ArrowRightLeft,
  Search,
  Download,
  Columns3,
  ChevronDown,
  Edit,
  X,
  CheckCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { StockPagination } from "./StockPagination"

export interface Transfer {
  id: string
  from: string
  to: string
  items: number
  status: "completed" | "in-transit" | "pending"
  date: string
}

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  "in-transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

export function RecentTransfersTable({ data }: { data: Transfer[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [visibleColumns, setVisibleColumns] = useState(["id", "from", "to", "items", "status", "date"])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !selectedStatus || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const allColumns = [
    { key: "id", label: "Transfer ID" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "items", label: "Items" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRightLeft className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-semibold">Recent Transfers</span>
            </CardTitle>
            <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-white shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns3 className="w-4 h-4 mr-2" />
                  Columns
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {allColumns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={visibleColumns.includes(column.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setVisibleColumns([...visibleColumns, column.key])
                      } else {
                        setVisibleColumns(visibleColumns.filter((col) => col !== column.key))
                      }
                    }}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Status
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStatus("")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("in-transit")}>In Transit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("id") && (
                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("id")}>
                      Transfer ID
                      <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                    </TableHead>
                  )}
                  {visibleColumns.includes("from") && <TableHead>From Warehouse</TableHead>}
                  {visibleColumns.includes("to") && <TableHead>To Warehouse</TableHead>}
                  {visibleColumns.includes("items") && (
                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("items")}>
                      Items
                      <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                    </TableHead>
                  )}
                  {visibleColumns.includes("status") && <TableHead>Status</TableHead>}
                  {visibleColumns.includes("date") && (
                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("date")}>
                      Date
                      <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                    </TableHead>
                  )}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((transfer) => (
                  <TableRow
                    key={transfer.id}
                    className="hover:bg-gradient-to-r hover:from-teal-500/5 hover:to-blue-500/5 transition-all duration-300 group"
                  >
                    {visibleColumns.includes("id") && (
                      <TableCell className="font-medium font-mono group-hover:text-teal-600 transition-colors">
                        {transfer.id}
                      </TableCell>
                    )}
                    {visibleColumns.includes("from") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">
                        {transfer.from}
                      </TableCell>
                    )}
                    {visibleColumns.includes("to") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">{transfer.to}</TableCell>
                    )}
                    {visibleColumns.includes("items") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-xs font-semibold">{transfer.items}</span>
                          </motion.div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableCell>
                        <Badge
                          className={`${statusColors[transfer.status]} group-hover:scale-105 transition-transform`}
                        >
                          <motion.div className="flex items-center gap-1">
                            {transfer.status === "completed" && <CheckCircle className="w-3 h-3" />}
                            {transfer.status.replace("-", " ")}
                          </motion.div>
                        </Badge>
                      </TableCell>
                    )}
                    {visibleColumns.includes("date") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">
                        {new Date(transfer.date).toLocaleDateString()}
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-blue-500/10 transition-all duration-300"
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
            totalPages={Math.ceil(filteredData.length / itemsPerPage)}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}
