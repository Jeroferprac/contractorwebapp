"use client"

import { useState, useEffect } from "react"
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
  TrendingDown,
  Warehouse,
  Filter,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  critical: "bg-red-500/20 text-red-400 border-red-500/30 shadow-red-500/20",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30 shadow-orange-500/20",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20",
}

const urgencyIcons = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
}

const getStockPercentage = (current: number, min: number) => {
  return Math.min((current / min) * 100, 100)
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
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
  const [isMobile, setIsMobile] = useState(false)
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="bg-background border border-border shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="pb-6 bg-gradient-to-r from-red-100/40 to-orange-100/40 dark:from-red-500/10 dark:to-orange-500/10 border-b border-border rounded-t-3xl">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-r from-red-200 to-orange-200 dark:from-red-500 dark:to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/25"
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0], boxShadow: "0 20px 40px rgba(239, 68, 68, 0.4)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <AlertTriangle className="w-5 h-5 text-foreground" />
                </motion.div>
                <div>
                  <span className="text-lg font-bold text-foreground leading-tight">Low Stock Alerts</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Monitor critical inventory levels</p>
                </div>
              </CardTitle>
              <div className="flex items-center gap-2 w-full max-w-xl justify-end">
                <Input
                  placeholder="Search low stock items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-purple-500/50 h-9 px-3 text-sm w-56 shadow-sm mr-2"
                />
                <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-500/10 dark:to-blue-500/10 text-foreground border-0 shadow-md hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all"
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      Filter
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 rounded-2xl shadow-xl bg-background border border-border p-4">
                    <div className="font-semibold mb-2 text-lg text-foreground">Filter Options</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium mb-1 text-muted-foreground">Urgency</div>
                        <select
                          className="w-full rounded-xl border border-border p-2 bg-background text-foreground"
                          value={selectedUrgency}
                          onChange={e => setSelectedUrgency(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                        </select>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1 text-muted-foreground">Category</div>
                        <select
                          className="w-full rounded-xl border border-border p-2 bg-background text-foreground"
                          value={selectedCategory}
                          onChange={e => setSelectedCategory(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1 text-muted-foreground">Columns</div>
                        {allColumns.map((column) => (
                          <label key={column.key} className="flex items-center gap-2 text-sm mb-1">
                            <input
                              type="checkbox"
                              checked={visibleColumns.includes(column.key)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setVisibleColumns([...visibleColumns, column.key])
                                } else {
                                  setVisibleColumns(visibleColumns.filter((col) => col !== column.key))
                                }
                              }}
                            />
                            {column.label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button size="sm" variant="outline" className="rounded-xl" onClick={() => { setSelectedUrgency(""); setSelectedCategory(""); setVisibleColumns(allColumns.map(c => c.key)); }}>Reset</Button>
                      <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md" onClick={() => setFilterPopoverOpen(false)}>Apply</Button>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:from-purple-600 hover:to-blue-600 transition-all">
                  <Plus className="w-4 h-4 mr-1" />
                  Reorder
                </Button>
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 dark:from-amber-500 dark:to-orange-500 text-white shadow-md hover:from-amber-500 hover:to-orange-600 transition-all">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-6 mb-4 shadow-lg">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /><circle cx="12" cy="12" r="10" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">All stocks are healthy!</h2>
            <p className="text-muted-foreground mb-4">No products are currently below the minimum threshold.</p>
            <Button variant="outline" disabled className="rounded-2xl">Reorder Stock</Button>
          </div>
        ) : (
          <CardContent className="p-0">
            {isMobile ? (
              <div className="p-4 space-y-4">
                {paginatedData.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-background border border-border rounded-2xl p-4 space-y-2 shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                        <Package className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground font-mono">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Stock:</span>
                      <span className="text-foreground font-bold">{item.currentStock} / {item.minThreshold}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Warehouse:</span>
                      <span className="text-foreground font-medium">{item.warehouse}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Urgency:</span>
                      <Badge className={`${urgencyColors[item.urgency]} rounded-xl px-3 py-1 font-semibold`}>
                        <span className="mr-2">{urgencyIcons[item.urgency]}</span>
                        {item.urgency}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-end pt-2 border-t border-border">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300 rounded-xl text-foreground"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-background border-border">
                          <DropdownMenuItem className="text-foreground hover:bg-white/10">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-white/10">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reorder Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground hover:bg-white/10">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Threshold
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="rounded-2xl overflow-hidden">
                  <TableHeader>
                    <TableRow className="border-border hover:bg-gradient-to-r hover:from-red-100/30 hover:to-orange-100/30 dark:hover:from-red-500/10 dark:hover:to-orange-500/10 transition-all duration-300 group rounded-2xl">
                      {visibleColumns.includes("name") && (
                        <TableHead
                          className="cursor-pointer hover:text-foreground text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center gap-3 h-full">
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 360 }}
                              className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                              transition={{ duration: 0.3 }}
                            >
                              <Package className="w-3 h-3 text-foreground" />
                            </motion.div>
                            <span className="font-semibold">Product</span>
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("currentStock") && (
                        <TableHead
                          className="cursor-pointer hover:text-foreground text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle"
                          onClick={() => handleSort("currentStock")}
                        >
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">Stock Level</span>
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("warehouse") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <Warehouse className="w-4 h-4" />
                            <span className="font-semibold">Warehouse</span>
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("category") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">📦 Category</span>
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("urgency") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">⚠️ Urgency</span>
                          </div>
                        </TableHead>
                      )}
                      <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                        <span className="font-semibold">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {paginatedData.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.05 }}
                          className="border-border hover:bg-gradient-to-r hover:from-red-100/30 hover:to-orange-100/30 dark:hover:from-red-500/10 dark:hover:to-orange-500/10 transition-all duration-300 group rounded-2xl shadow-sm hover:shadow-lg"
                        >
                          {visibleColumns.includes("name") && (
                            <TableCell className="h-16 align-middle">
                              <div className="flex items-center gap-4">
                                <motion.div
                                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg"
                                  whileHover={{
                                    scale: 1.2,
                                    rotate: [0, -10, 10, 0],
                                    boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)",
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Package className="w-5 h-5 text-foreground" />
                                </motion.div>
                                <div className="flex flex-col justify-center">
                                  <div className="font-semibold text-foreground group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-lg leading-tight">
                                    {item.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground leading-tight">{item.category}</div>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.includes("currentStock") && (
                            <TableCell>
                              <div className="space-y-2 min-w-[140px]">
                                <div className="flex justify-between text-sm">
                                  <span className="font-bold text-foreground text-lg">{item.currentStock}</span>
                                  <span className="text-muted-foreground">/ {item.minThreshold}</span>
                                </div>
                                <div className="relative">
                                  <Progress
                                    value={getStockPercentage(item.currentStock, item.minThreshold)}
                                    className="h-2 bg-white/10 rounded-full overflow-hidden"
                                  />
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${getStockPercentage(item.currentStock, item.minThreshold)}%` }}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.includes("warehouse") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                              {item.warehouse}
                            </TableCell>
                          )}
                          {visibleColumns.includes("category") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                              {item.category}
                            </TableCell>
                          )}
                          {visibleColumns.includes("urgency") && (
                            <TableCell>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Badge
                                  className={`${urgencyColors[item.urgency]} group-hover:scale-105 transition-all duration-300 capitalize font-semibold shadow-lg rounded-xl px-3 py-1`}
                                >
                                  <span className="mr-2">{urgencyIcons[item.urgency]}</span>
                                  {item.urgency}
                                </Badge>
                              </motion.div>
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-gradient-to-r hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300 rounded-xl text-foreground"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-background border-border">
                                <DropdownMenuItem className="text-foreground hover:bg-white/10">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground hover:bg-white/10">
                                  <RefreshCw className="w-4 h-4 mr-2" />
                                  Reorder Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-foreground hover:bg-white/10">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Threshold
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="border-t border-border bg-gradient-to-r from-purple-100/10 to-blue-100/10 dark:from-purple-500/5 dark:to-blue-500/5">
              <StockPagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredData.length / itemsPerPage)}
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
