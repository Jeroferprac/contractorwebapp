"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ChevronRight,
  Filter,
  Columns,
  Search,
  Package,
  Calendar,
  User,
  DollarSign,
  Hash,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SaleItem {
  product_id: string
  quantity: string
  unit_price: string
  line_total: string
  id: string
  created_at: string
}

interface Sale {
  customer_name: string
  sale_date: string
  status: string
  notes: string
  id: string
  total_amount: string
  created_at: string
  items: SaleItem[]
}

interface SalesOrderTableProps {
  sales: Sale[]
  onEdit?: (id: string) => void
  onView?: (id: string) => void
}

const statusConfig = {
  completed: {
    label: "Fulfilled",
    color: "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
    icon: CheckCircle,
    textColor: "text-green-700 dark:text-green-400",
  },
  pending: {
    label: "Pending Receipt",
    color: "bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700",
    icon: Clock,
    textColor: "text-purple-700 dark:text-purple-400",
  },
  shipping: {
    label: "Shipping",
    color: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    icon: Truck,
    textColor: "text-blue-700 dark:text-blue-400",
  },
  overdue: {
    label: "Overdue",
    color: "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
    icon: AlertCircle,
    textColor: "text-orange-700 dark:text-orange-400",
  },
}

export function SalesOrderTable({ sales, onEdit, onView }: SalesOrderTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [visibleColumns, setVisibleColumns] = useState({
    orderNumber: true,
    date: true,
    customer: true,
    status: true,
    amount: true,
    items: true,
  })

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRows(newExpanded)
  }

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(sale.status)
    return matchesSearch && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSales = filteredSales.slice(startIndex, endIndex)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="w-full"
    >
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-lg dark:bg-[#020817]/40 dark:backdrop-blur-xl dark:border-white/10 dark:shadow-2xl dark:shadow-purple-500/5">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
              Sales Orders
            </CardTitle>
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-white/50 backdrop-blur-sm border-white/30 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder:text-gray-400"
                />
              </div>
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 backdrop-blur-sm border-white/30 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/90 backdrop-blur-md dark:bg-[#020817]/90 dark:backdrop-blur-xl dark:border-white/20">
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("completed")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "completed"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "completed"))
                      }
                    }}
                    className="dark:text-white dark:hover:bg-white/10"
                  >
                    Completed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("pending")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "pending"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "pending"))
                      }
                    }}
                    className="dark:text-white dark:hover:bg-white/10"
                  >
                    Pending
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={statusFilter.includes("shipping")}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setStatusFilter([...statusFilter, "shipping"])
                      } else {
                        setStatusFilter(statusFilter.filter((s) => s !== "shipping"))
                      }
                    }}
                    className="dark:text-white dark:hover:bg-white/10"
                  >
                    Shipping
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/50 backdrop-blur-sm border-white/30 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                  >
                    <Columns className="h-4 w-4 mr-2" />
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white/90 backdrop-blur-md dark:bg-[#020817]/90 dark:backdrop-blur-xl dark:border-white/20">
                  {Object.entries(visibleColumns).map(([key, visible]) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={visible}
                      onCheckedChange={(checked) => {
                        setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                      }}
                      className="dark:text-white dark:hover:bg-white/10"
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20 dark:border-white/10">
                  <th className="w-12 p-3 text-left">
                    <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700" />
                  </th>
                  {visibleColumns.orderNumber && (
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        Order ID
                      </div>
                    </th>
                  )}
                  {visibleColumns.date && (
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date
                      </div>
                    </th>
                  )}
                  {visibleColumns.customer && (
                    <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Name
                      </div>
                    </th>
                  )}
                  {visibleColumns.status && (
                    <th className="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  )}
                  {visibleColumns.amount && (
                    <th className="p-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <div className="flex items-center justify-end gap-2">
                        <DollarSign className="h-4 w-4" />
                        Amount
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale, index) => {
                  const statusInfo = getStatusConfig(sale.status)
                  const StatusIcon = statusInfo.icon
                  return (
                    <motion.tr
                      key={sale.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/10 dark:border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="w-12 p-3">
                        <motion.div whileHover={{ scale: 1.1 }}>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                          />
                        </motion.div>
                      </td>
                      {visibleColumns.orderNumber && (
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            >
                              <Hash className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            </motion.div>
                            <span className="text-blue-600 dark:text-blue-400 font-semibold">
                              {sale.id.slice(0, 6).toUpperCase()}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.date && (
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </motion.div>
                            <span className="text-gray-600 dark:text-gray-300 text-sm">
                              {formatDate(sale.sale_date)}
                            </span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.customer && (
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <motion.div
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </motion.div>
                            <span className="font-medium text-gray-800 dark:text-gray-200">{sale.customer_name}</span>
                          </div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="p-3 text-center">
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Badge className={`${statusInfo.color} text-white border-0 font-medium shadow-lg`}>
                              <StatusIcon className="h-4 w-4 mr-1" />
                              {statusInfo.label}
                            </Badge>
                          </motion.div>
                        </td>
                      )}
                      {visibleColumns.amount && (
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <motion.div
                              animate={{ rotate: [0, 15, -15, 0] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <DollarSign className="h-4 w-4 text-green-500 dark:text-green-400" />
                            </motion.div>
                            <span className="font-bold text-gray-900 dark:text-gray-100">
                              ${Number.parseFloat(sale.total_amount).toLocaleString()}
                            </span>
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-2 p-4">
            {paginatedSales.map((sale, index) => {
              const isExpanded = expandedRows.has(sale.id)
              const statusInfo = getStatusConfig(sale.status)
              const StatusIcon = statusInfo.icon
              return (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <motion.div
                    whileHover={{
                      scale: 1.01,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 p-4 cursor-pointer transition-all duration-200 hover:bg-white/70 dark:bg-[#020817]/60 dark:backdrop-blur-lg dark:border-white/20 dark:hover:bg-[#020817]/80"
                    onClick={() => toggleRow(sale.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Checkbox */}
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50"
                        />
                        {/* Order Number */}
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            {sale.id.slice(0, 6).toUpperCase()}
                          </span>
                        </div>
                        {/* Status */}
                        <Badge className={`${statusInfo.color} text-white border-0 font-medium shadow-lg`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        {/* Amount */}
                        <span className="font-bold text-gray-900 dark:text-gray-100 ml-auto">
                          ${Number.parseFloat(sale.total_amount).toLocaleString()}
                        </span>
                      </div>
                      {/* Expand/Collapse Icon */}
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      </motion.div>
                    </div>
                    {/* Mobile Accordion Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="space-y-3">
                            {/* Customer and Date */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Customer
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage
                                      src={`/placeholder.svg?height=24&width=24&query=${sale.customer_name}`}
                                    />
                                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                                      {sale.customer_name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium text-sm dark:text-gray-200">{sale.customer_name}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</p>
                                <p className="font-medium text-sm dark:text-gray-200">{formatDate(sale.sale_date)}</p>
                              </div>
                            </div>
                            {/* Notes */}
                            {sale.notes && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{sale.notes}</p>
                              </div>
                            )}
                            {/* Items */}
                            {visibleColumns.items && sale.items.length > 0 && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                  Items ({sale.items.length})
                                </p>
                                <div className="space-y-2">
                                  {sale.items.slice(0, 2).map((item, itemIndex) => (
                                    <div
                                      key={item.id}
                                      className="bg-white/50 dark:bg-[#020817]/50 rounded-lg p-3 flex items-center justify-between backdrop-blur-sm"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                                        <div>
                                          <p className="font-medium text-sm dark:text-gray-200">
                                            Product {item.product_id.slice(0, 8)}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Qty: {item.quantity}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium text-sm dark:text-gray-200">
                                          ${Number.parseFloat(item.line_total).toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          ${item.unit_price} each
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                  {sale.items.length > 2 && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                      +{sale.items.length - 2} more items
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onView?.(sale.id)
                                }}
                                className="flex-1 bg-white/50 backdrop-blur-sm dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onEdit?.(sale.id)
                                }}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 dark:shadow-purple-500/20"
                              >
                                Edit Order
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {/* Pagination */}
          {filteredSales.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-white/20 dark:border-white/10">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Show</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20 h-8 bg-white/50 dark:bg-white/10 dark:border-white/20 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#020817]/90 dark:backdrop-blur-xl dark:border-white/20">
                    <SelectItem value="5" className="dark:text-white dark:hover:bg-white/10">
                      5
                    </SelectItem>
                    <SelectItem value="10" className="dark:text-white dark:hover:bg-white/10">
                      10
                    </SelectItem>
                    <SelectItem value="20" className="dark:text-white dark:hover:bg-white/10">
                      20
                    </SelectItem>
                  </SelectContent>
                </Select>
                <span>of {filteredSales.length}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="bg-white/50 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 1) + i
                  if (pageNum > totalPages) return null
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg dark:shadow-purple-500/20"
                          : "bg-white/50 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="bg-white/50 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {filteredSales.length === 0 && (
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              </motion.div>
              <p className="text-gray-500 dark:text-gray-400">No sales orders found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
