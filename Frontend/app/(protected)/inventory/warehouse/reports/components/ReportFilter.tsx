"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, Calendar, Building, Package, Filter, RotateCcw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

interface ReportFilterProps {
  filters: {
    dateRange: { from: string; to: string }
    warehouses: string[]
    products: string[]
    status: string
  }
  onFiltersChange: (filters: any) => void
}

const warehouses = [
  { value: "central", label: "Central Distribution" },
  { value: "east", label: "East Coast Hub" },
  { value: "midwest", label: "Midwest Storage" },
  { value: "southern", label: "Southern Depot" },
]

const products = [
  { value: "wireless-headphones", label: "Wireless Headphones" },
  { value: "office-chair", label: "Office Chair" },
  { value: "usb-cable", label: "USB Cable" },
  { value: "laptop-stand", label: "Laptop Stand" },
  { value: "desk-lamp", label: "Desk Lamp" },
]

export function ReportFilter({ filters, onFiltersChange }: ReportFilterProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [productSearch, setProductSearch] = useState("")

  const filteredProducts = products.filter((product) =>
    product.label.toLowerCase().includes(productSearch.toLowerCase()),
  )

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      onFiltersChange({
        ...filters,
        dateRange: {
          from: format(range.from, "yyyy-MM-dd"),
          to: format(range.to, "yyyy-MM-dd"),
        },
      })
    }
  }

  const handleWarehouseChange = (warehouse: string, checked: boolean) => {
    const newWarehouses = checked
      ? [...filters.warehouses, warehouse]
      : filters.warehouses.filter((w) => w !== warehouse)

    onFiltersChange({
      ...filters,
      warehouses: newWarehouses,
    })
  }

  const handleProductChange = (product: string, checked: boolean) => {
    const newProducts = checked ? [...filters.products, product] : filters.products.filter((p) => p !== product)

    onFiltersChange({
      ...filters,
      products: newProducts,
    })
  }

  const resetFilters = () => {
    onFiltersChange({
      dateRange: { from: "", to: "" },
      warehouses: [],
      products: [],
      status: "all",
    })
    setProductSearch("")
  }

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 dark:hover:bg-white/5 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-purple-500" />
                Report Filters
              </CardTitle>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Date Range Picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateRange.from && filters.dateRange.to
                        ? `${filters.dateRange.from} - ${filters.dateRange.to}`
                        : "Select date range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-card/95 backdrop-blur-xl border border-white/10"
                    align="start"
                  >
                    <CalendarComponent mode="range" numberOfMonths={2} onSelect={handleDateRangeChange} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Warehouse Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Warehouses</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300"
                    >
                      <Building className="mr-2 h-4 w-4" />
                      {filters.warehouses.length > 0 ? `${filters.warehouses.length} selected` : "Select warehouses"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-card/95 backdrop-blur-xl border border-white/10">
                    <div className="space-y-3">
                      {warehouses.map((warehouse) => (
                        <div key={warehouse.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={warehouse.value}
                            checked={filters.warehouses.includes(warehouse.value)}
                            onCheckedChange={(checked) => handleWarehouseChange(warehouse.value, checked as boolean)}
                          />
                          <label
                            htmlFor={warehouse.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {warehouse.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Product Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Products</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      {filters.products.length > 0 ? `${filters.products.length} selected` : "Select products"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 bg-card/95 backdrop-blur-xl border border-white/10">
                    <div className="space-y-3">
                      <Input
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="bg-background/50 backdrop-blur-sm"
                      />
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {filteredProducts.map((product) => (
                          <div key={product.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={product.value}
                              checked={filters.products.includes(product.value)}
                              onCheckedChange={(checked) => handleProductChange(product.value, checked as boolean)}
                            />
                            <label
                              htmlFor={product.value}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {product.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                >
                  <SelectTrigger className="bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl border border-white/10">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={resetFilters}
                className="bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
