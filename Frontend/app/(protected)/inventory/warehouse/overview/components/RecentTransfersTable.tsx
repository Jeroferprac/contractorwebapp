"use client"

import { useState, useEffect } from "react"
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
  Clock,
  Truck,
  FileX,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
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
  completed: "bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20",
  "in-transit": "bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-yellow-500/20",
}

const statusIcons = {
  completed: <CheckCircle className="w-3 h-3" />,
  "in-transit": <Truck className="w-3 h-3" />,
  pending: <Clock className="w-3 h-3" />,
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
}

export function RecentTransfersTable({ data }: { data: Transfer[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [visibleColumns, setVisibleColumns] = useState(["id", "from", "to", "items", "status", "date"])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [isMobile, setIsMobile] = useState(false)

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

  const handleExport = () => {
    const csvContent = [
      ["Transfer ID", "From", "To", "Items", "Status", "Date"],
      ...filteredData.map((item) => [item.id, item.from, item.to, item.items.toString(), item.status, item.date]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "transfers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const allColumns = [
    { key: "id", label: "Transfer ID" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "items", label: "Items" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ]

  // Empty State Component
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-teal-500/30">
          <FileX className="w-12 h-12 text-teal-400" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
          <ArrowRightLeft className="w-4 h-4 text-white" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No transfers found</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        {searchTerm || selectedStatus
          ? "No transfers match your current filters. Try adjusting your search criteria."
          : "No transfer data available at the moment. Transfers will appear here once created."}
      </p>
      {(searchTerm || selectedStatus) && (
        <Button
          onClick={() => {
            setSearchTerm("")
            setSelectedStatus("")
          }}
          className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white"
        >
          Clear Filters
        </Button>
      )}
    </motion.div>
  )

  // Mobile Card Component
  const MobileCard = ({ transfer }: { transfer: Transfer }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(20, 184, 166, 0.2)" }}
      className="bg-background border border-border backdrop-blur-sm rounded-xl p-4 space-y-2"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg">
            <ArrowRightLeft className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground font-mono">{transfer.id}</h3>
            <p className="text-sm text-muted-foreground">{new Date(transfer.date).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge className={`${statusColors[transfer.status]} rounded-xl px-3 py-1 font-semibold`}>
          <div className="flex items-center gap-2">
            {statusIcons[transfer.status]}
            {transfer.status.replace("-", " ")}
          </div>
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">📤 From:</span>
          <span className="text-foreground font-medium">{transfer.from}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">📥 To:</span>
          <span className="text-foreground font-medium">{transfer.to}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">📦 Items:</span>
          <div className="flex items-center gap-2">
            <motion.div
              className="w-6 h-6 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.2 }}
            >
              <span className="text-xs font-bold text-white">{transfer.items}</span>
            </motion.div>
            <span className="text-foreground font-medium">{transfer.items} items</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end pt-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-blue-500/20 transition-all duration-300 rounded-xl text-white"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-background border-border">
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-white/10">
              <Edit className="w-4 h-4 mr-2" />
              Edit Transfer
            </DropdownMenuItem>
            {transfer.status === "pending" && (
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                <X className="w-4 h-4 mr-2" />
                Cancel Transfer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full">
      <Card className="bg-background border border-border shadow-2xl backdrop-blur-xl rounded-2xl overflow-hidden">
        <CardHeader className="pb-6 bg-gradient-to-r from-teal-100/40 to-blue-100/40 dark:from-teal-500/10 dark:to-blue-500/10 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <CardTitle className="flex items-center gap-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-teal-200 to-blue-200 dark:from-teal-500 dark:to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/25"
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0], boxShadow: "0 20px 40px rgba(20, 184, 166, 0.4)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ArrowRightLeft className="w-6 h-6 text-foreground" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold text-foreground">Recent Transfers</span>
                <p className="text-sm text-muted-foreground mt-1">Track inventory movements</p>
              </div>
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
              <Button
                onClick={handleExport}
                size="sm"
                className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:from-blue-600 hover:to-purple-600 transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </motion.div>
          </div>
          {/* Enhanced Filters Row - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl shadow-lg"
                  >
                    <Columns3 className="w-4 h-4 mr-2" />
                    Columns
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-background border-border">
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
                      className="text-white hover:bg-white/10"
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl shadow-lg"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Status
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border-border">
                  <DropdownMenuItem onClick={() => setSelectedStatus("")} className="text-white hover:bg-white/10">
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("completed")}
                    className="text-white hover:bg-white/10"
                  >
                    ✅ Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("in-transit")}
                    className="text-white hover:bg-white/10"
                  >
                    🚛 In Transit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedStatus("pending")}
                    className="text-white hover:bg-white/10"
                  >
                    ⏳ Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="relative flex-1 w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search transfers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:ring-2 focus:ring-purple-500/50 w-full"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl shadow-lg w-full sm:w-auto"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-white/5">
                      {visibleColumns.includes("id") && (
                        <TableHead
                          className="cursor-pointer hover:text-foreground text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle"
                          onClick={() => handleSort("id")}
                        >
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">Transfer ID</span>
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("from") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">From Warehouse</span>
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("to") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">To Warehouse</span>
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("items") && (
                        <TableHead
                          className="cursor-pointer hover:text-foreground text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle"
                          onClick={() => handleSort("items")}
                        >
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">Items</span>
                            <ArrowUpDown className="w-4 h-4 ml-1" />
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("status") && (
                        <TableHead className="text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle">
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">Status</span>
                          </div>
                        </TableHead>
                      )}
                      {visibleColumns.includes("date") && (
                        <TableHead
                          className="cursor-pointer hover:text-foreground text-muted-foreground bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm h-14 align-middle"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center gap-2 h-full">
                            <span className="font-semibold">Date</span>
                            <ArrowUpDown className="w-4 h-4 ml-1" />
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
                      {paginatedData.map((transfer, index) => (
                        <motion.tr
                          key={transfer.id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          transition={{ delay: index * 0.05 }}
                          className="border-border hover:bg-gradient-to-r hover:from-teal-500/10 hover:to-blue-500/10 transition-all duration-500 group"
                        >
                          {visibleColumns.includes("id") && (
                            <TableCell className="font-medium font-mono group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 text-foreground text-lg h-16 align-middle">
                              {transfer.id}
                            </TableCell>
                          )}
                          {visibleColumns.includes("from") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium h-16 align-middle">
                              {transfer.from}
                            </TableCell>
                          )}
                          {visibleColumns.includes("to") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium h-16 align-middle">
                              {transfer.to}
                            </TableCell>
                          )}
                          {visibleColumns.includes("items") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg"
                                  whileHover={{
                                    scale: 1.2,
                                    boxShadow: "0 10px 30px rgba(107, 114, 128, 0.5)",
                                  }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <span className="text-sm font-bold text-foreground">{transfer.items}</span>
                                </motion.div>
                                <span className="font-medium">{transfer.items} items</span>
                              </div>
                            </TableCell>
                          )}
                          {visibleColumns.includes("status") && (
                            <TableCell>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Badge
                                  className={`${statusColors[transfer.status]} group-hover:scale-105 transition-all duration-300 shadow-lg rounded-xl px-3 py-1 font-semibold`}
                                >
                                  <div className="flex items-center gap-2">
                                    {statusIcons[transfer.status]}
                                    {transfer.status.replace("-", " ")}
                                  </div>
                                </Badge>
                              </motion.div>
                            </TableCell>
                          )}
                          {visibleColumns.includes("date") && (
                            <TableCell className="text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                              {new Date(transfer.date).toLocaleDateString()}
                            </TableCell>
                          )}
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-gradient-to-r hover:from-teal-500/20 hover:to-blue-500/20 transition-all duration-300 rounded-xl text-white"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-background border-border">
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Transfer
                                </DropdownMenuItem>
                                {transfer.status === "pending" && (
                                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel Transfer
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden p-4 space-y-4">
                <AnimatePresence>
                  {paginatedData.map((transfer, index) => (
                    <motion.div
                      key={transfer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MobileCard transfer={transfer} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
          <div className="border-t border-border bg-gradient-to-r from-teal-500/5 to-blue-500/5">
            <StockPagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredData.length / itemsPerPage)}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
              buttonClassName="rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow hover:from-blue-600 hover:to-purple-600 transition-all"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
