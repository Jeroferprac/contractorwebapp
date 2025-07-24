"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertTriangle,
  Plus,
  Package,
  Search,
  Download,
  Columns3,
  ChevronDown,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  RefreshCw,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { StockPagination } from "./StockPagination"

export interface LowStockItem {
  id: string
  name: string
  category: string
  currentStock: number
  minThreshold: number
  warehouse: string
  urgency: "critical" | "high" | "medium"
}

const urgencyColors = {
  critical: "bg-red-500/10 text-red-500 border-red-500/20",
  high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

const getStockPercentage = (current: number, min: number) => {
  return Math.min((current / min) * 100, 100)
}

export function LowStockTable({ data }: { data: LowStockItem[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUrgency, setSelectedUrgency] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [visibleColumns, setVisibleColumns] = useState(["name", "currentStock", "warehouse", "category", "urgency"])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUrgency = !selectedUrgency || item.urgency === selectedUrgency
    const matchesCategory = !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesUrgency && matchesCategory
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
    { key: "name", label: "Product" },
    { key: "currentStock", label: "Stock Level" },
    { key: "warehouse", label: "Warehouse" },
    { key: "category", label: "Category" },
    { key: "urgency", label: "Urgency" },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-semibold">Low Stock Alerts</span>
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
                  Urgency
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedUrgency("")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedUrgency("critical")}>Critical</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedUrgency("high")}>High</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedUrgency("medium")}>Medium</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Category
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedCategory("")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory("Electronics")}>Electronics</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory("Furniture")}>Furniture</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedCategory("Accessories")}>Accessories</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search low stock items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Reorder
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("name") && (
                    <TableHead className="cursor-pointer hover:text-foreground" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center"
                        >
                          <Package className="w-3 h-3 text-blue-600" />
                        </motion.div>
                        Product
                        <ArrowUpDown className="w-4 h-4 ml-1" />
                      </div>
                    </TableHead>
                  )}
                  {visibleColumns.includes("currentStock") && (
                    <TableHead
                      className="cursor-pointer hover:text-foreground"
                      onClick={() => handleSort("currentStock")}
                    >
                      Stock Level
                      <ArrowUpDown className="w-4 h-4 ml-1 inline" />
                    </TableHead>
                  )}
                  {visibleColumns.includes("warehouse") && <TableHead>Warehouse</TableHead>}
                  {visibleColumns.includes("category") && <TableHead>Category</TableHead>}
                  {visibleColumns.includes("urgency") && <TableHead>Urgency</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gradient-to-r hover:from-red-500/5 hover:to-orange-500/5 transition-all duration-300 group"
                  >
                    {visibleColumns.includes("name") && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <motion.div
                            className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            <Package className="w-4 h-4 text-blue-600" />
                          </motion.div>
                          <div>
                            <div className="font-medium group-hover:text-red-600 transition-colors">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                          </div>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("currentStock") && (
                      <TableCell>
                        <div className="space-y-1 min-w-[120px]">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold">{item.currentStock}</span>
                            <span className="text-muted-foreground">/ {item.minThreshold}</span>
                          </div>
                          <Progress
                            value={getStockPercentage(item.currentStock, item.minThreshold)}
                            className="h-1.5"
                          />
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.includes("warehouse") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">
                        {item.warehouse}
                      </TableCell>
                    )}
                    {visibleColumns.includes("category") && (
                      <TableCell className="group-hover:text-foreground/80 transition-colors">
                        {item.category}
                      </TableCell>
                    )}
                    {visibleColumns.includes("urgency") && (
                      <TableCell>
                        <Badge
                          className={`${urgencyColors[item.urgency]} group-hover:scale-105 transition-transform capitalize`}
                        >
                          {item.urgency}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-gradient-to-r hover:from-red-500/10 hover:to-orange-500/10 transition-all duration-300"
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
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reorder Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Threshold
                          </DropdownMenuItem>
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
