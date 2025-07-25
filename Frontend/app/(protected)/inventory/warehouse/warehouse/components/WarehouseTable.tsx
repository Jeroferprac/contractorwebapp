"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Package,
  MoreVertical,
  Edit,
  Eye,
  Archive,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"

interface WarehouseTableWarehouse {
  id: string
  name: string
  address: string
  totalBins: number
  stockCount: number
  status: "active" | "inactive"
  region: string
  manager: string
  utilization: number
  lastUpdated: string
}

interface WarehouseTableProps {
  warehouses: WarehouseTableWarehouse[]
  onSelect: (id: string) => void
  selectedIds: string[]
  isDarkMode?: boolean
}

export function WarehouseTable({ warehouses, onSelect, selectedIds, isDarkMode = false }: WarehouseTableProps) {
  const [selectAll, setSelectAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Calculate pagination
  const totalPages = Math.ceil(warehouses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, warehouses.length)
  const currentWarehouses = warehouses.slice(startIndex, endIndex)

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      currentWarehouses.forEach((warehouse) => {
        if (selectedIds.includes(warehouse.id)) {
          onSelect(warehouse.id)
        }
      })
    } else {
      // Select all
      currentWarehouses.forEach((warehouse) => {
        if (!selectedIds.includes(warehouse.id)) {
          onSelect(warehouse.id)
        }
      })
    }
    setSelectAll(!selectAll)
  }

  const getStatusColor = (status: string) => {
    if (status === "active") {
      return isDarkMode
        ? "bg-green-500/20 text-green-400 border-green-500/30"
        : "bg-green-100 text-green-700 border-green-200"
    }
    return isDarkMode ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-100 text-red-700 border-red-200"
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return isDarkMode ? "text-red-400" : "text-red-600"
    if (utilization >= 75) return isDarkMode ? "text-yellow-400" : "text-yellow-600"
    return isDarkMode ? "text-green-400" : "text-green-600"
  }

  if (warehouses.length === 0) {
    return (
      <div
        className={`h-[300px] flex items-center justify-center rounded-lg ${isDarkMode ? "bg-[#020817]" : "bg-white"}`}
      >
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <span className="text-gray-500">No warehouses found</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-lg shadow-xl overflow-hidden ${isDarkMode ? "bg-[#020817]" : "bg-white"}`}
    >
      {/* Table Header */}
      <div
        className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700 bg-[#0b1437]" : "border-gray-200 bg-gray-50"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Warehouses</h2>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              {warehouses.length} Total
            </Badge>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              Add Warehouse
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={isDarkMode ? "bg-[#0b1437]" : "bg-gray-50"}>
            <tr>
              <th className="px-4 py-2 text-left w-10">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
                />
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Warehouse
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Region
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Manager
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Stats
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Utilization
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Last Updated
              </th>
              <th
                className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? "divide-gray-700" : "divide-gray-200"}`}>
            {currentWarehouses.map((warehouse, index) => (
              <tr
                key={warehouse.id}
                onClick={() => onSelect(warehouse.id)}
      className={`group cursor-pointer transition-all duration-300 ${
                  selectedIds.includes(warehouse.id)
          ? isDarkMode
            ? "bg-purple-500/10 border-l-4 border-l-purple-500"
            : "bg-purple-50 border-l-4 border-l-purple-500"
          : isDarkMode
            ? "hover:bg-purple-500/5"
            : "hover:bg-gray-50"
      }`}
    >
      {/* Select Checkbox */}
                <td className="px-4 py-3">
        <Checkbox
                    checked={selectedIds.includes(warehouse.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      onSelect(warehouse.id)
                    }}
          className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
        />
      </td>

      {/* Warehouse Info */}
                <td className="px-4 py-3">
        <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-purple-500/30 transition-all duration-300">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-xs">
                        {`W${index + 1}`}
              </AvatarFallback>
            </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`font-semibold text-sm group-hover:text-purple-500 transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {warehouse.name}
              </h3>
              <Badge className={`${getStatusColor(warehouse.status)} text-xs`}>{warehouse.status}</Badge>
            </div>
                      <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
                        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                          {warehouse.address}
                        </span>
            </div>
          </div>
        </div>
      </td>

      {/* Region */}
                <td className="px-4 py-3">
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {warehouse.region}
                  </span>
      </td>

      {/* Manager */}
                <td className="px-4 py-3">
        <span className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          {warehouse.manager}
        </span>
      </td>

      {/* Stats */}
                <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Package className="w-3 h-3 text-blue-500" />
              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Bins</span>
            </div>
            <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {warehouse.totalBins}
            </span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Stock</span>
            </div>
            <span className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {warehouse.stockCount.toLocaleString()}
            </span>
          </div>
        </div>
      </td>

      {/* Utilization */}
                <td className="px-4 py-3">
        <div className="space-y-1 min-w-[100px]">
          <div className="flex justify-between items-center">
            <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Utilization</span>
            <span className={`text-xs font-medium ${getUtilizationColor(warehouse.utilization)}`}>
              {warehouse.utilization}%
            </span>
          </div>
                    <Progress value={warehouse.utilization} className="h-1.5 bg-gray-200 dark:bg-gray-700" />
        </div>
      </td>

      {/* Last Updated */}
                <td className="px-4 py-3">
        <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          {new Date(warehouse.lastUpdated).toLocaleDateString()}
        </span>
      </td>

      {/* Actions */}
                <td className="px-4 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isDarkMode
                    ? "hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 text-gray-300"
                    : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={isDarkMode ? "bg-[#020817] border-gray-700" : "bg-white border-gray-200"}
          >
            <DropdownMenuItem
              className={`${
                isDarkMode
                  ? "hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 text-gray-300"
                  : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${
                isDarkMode
                  ? "hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 text-gray-300"
                  : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
              }`}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Warehouse
            </DropdownMenuItem>
            <DropdownMenuItem
              className={`${
                isDarkMode
                  ? "hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 text-gray-300"
                  : "hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
              }`}
            >
              <Archive className="w-4 h-4 mr-2" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className={`px-4 py-3 border-t ${isDarkMode ? "border-gray-700 bg-[#0b1437]" : "border-gray-200 bg-gray-50"}`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Showing {startIndex + 1}-{endIndex} of {warehouses.length} warehouses
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`h-8 w-8 p-0 ${
                isDarkMode
                  ? "bg-[#020817] border-gray-700 text-gray-300 hover:bg-[#0b1437]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`h-8 w-8 p-0 ${
                isDarkMode
                  ? "bg-[#020817] border-gray-700 text-gray-300 hover:bg-[#0b1437]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1
              return (
                <Button
                  key={i}
                  variant={currentPage === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`h-8 w-8 p-0 ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
                      : isDarkMode
                        ? "bg-[#020817] border-gray-700 text-gray-300 hover:bg-[#0b1437]"
                        : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`h-8 w-8 p-0 ${
                isDarkMode
                  ? "bg-[#020817] border-gray-700 text-gray-300 hover:bg-[#0b1437]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`h-8 w-8 p-0 ${
                isDarkMode
                  ? "bg-[#020817] border-gray-700 text-gray-300 hover:bg-[#0b1437]"
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
