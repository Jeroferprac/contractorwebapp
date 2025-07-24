"use client"

import { Calendar, Building, Filter, Package, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { motion } from "framer-motion"

interface TransferFilterProps {
  dateRange: { from: string; to: string }
  onDateRangeChange: (range: { from: string; to: string }) => void
  warehouseFilter: string[]
  onWarehouseChange: (warehouses: string[]) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  warehouseOptions: string[]
}

export function TransferFilter({
  dateRange,
  onDateRangeChange,
  warehouseFilter,
  onWarehouseChange,
  statusFilter,
  onStatusChange,
  warehouseOptions,
}: TransferFilterProps) {
  const clearFilters = () => {
    onDateRangeChange({ from: "", to: "" })
    onWarehouseChange([])
    onStatusChange("all")
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border-0 overflow-hidden">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/25">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Report Filters</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="bg-transparent hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 border-gray-200 dark:border-gray-700"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Filters Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Date Range</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500/30 focus:border-purple-500 transition-all duration-200"
                  >
                    <Calendar className="mr-2 h-4 w-4 text-purple-500" />
                    <span className="truncate">
                      {dateRange.from && dateRange.to ? `${dateRange.from} - ${dateRange.to}` : "Select range"}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="range"
                    numberOfMonths={2}
                    onSelect={(range: DateRange | undefined) => {
                      if (range?.from && range?.to) {
                        onDateRangeChange({
                          from: format(range.from, "yyyy-MM-dd"),
                          to: format(range.to, "yyyy-MM-dd"),
                        })
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Warehouses */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Warehouses</label>
              <Select value={warehouseFilter[0] || "all"} onValueChange={(value) => onWarehouseChange([value])}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500/30 focus:border-purple-500 transition-all duration-200">
                  <Building className="w-4 h-4 mr-2 text-blue-500" />
                  <SelectValue placeholder="Select warehouses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  {warehouseOptions.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Products */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Products</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500/30 focus:border-purple-500 transition-all duration-200">
                  <Package className="w-4 h-4 mr-2 text-green-500" />
                  <SelectValue placeholder="Select products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Status</label>
              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-500/30 focus:border-purple-500 transition-all duration-200">
                  <Filter className="w-4 h-4 mr-2 text-orange-500" />
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Apply Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-300 opacity-0 pointer-events-none">
                Actions
              </label>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
