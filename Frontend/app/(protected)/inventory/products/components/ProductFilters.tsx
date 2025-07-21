"use client"

import { motion } from "framer-motion"
import { Search, Settings2, Plus, Eye, EyeOff, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductSearchBar } from "./ProductSearchBar";

interface Column {
  key: string
  label: string
  visible: boolean
  icon: any
  essential: boolean
  expandable: boolean
}

interface FilterOptions {
  categories: string[]
  brands: string[]
  statuses: { value: string; label: string }[]
  priceRanges: { value: string; label: string }[]
  stockRanges: { value: string; label: string }[]
}

interface ProductFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filters: Record<string, string>
  setFilters: (filters: Record<string, string>) => void
  filterOptions: FilterOptions
  visibleColumns: Column[]
  toggleColumnVisibility: (columnKey: string) => void
  isMobile: boolean
  onAddProduct?: () => void
}

export function ProductFilters({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  filterOptions,
  visibleColumns,
  toggleColumnVisibility,
  isMobile,
  onAddProduct,
}: ProductFiltersProps) {
  const essentialColumns = visibleColumns.filter((col) => col.essential)
  const optionalColumns = visibleColumns.filter((col) => !col.essential)
  const visibleCount = visibleColumns.filter((col) => col.visible).length
  const activeFiltersCount = Object.values(filters).filter((value) => value && value !== "all").length

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value })
  }

  const clearFilter = (key: string) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
  }

  const clearAllFilters = () => {
    setFilters({})
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border p-4 dark:bg-[#020817]"
    >
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
        {/* Left Section: Comprehensive Filters */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3 flex-1">
          {/* Multi-Filter Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 px-3 py-2 rounded-lg bg-transparent text-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Filter Products</h4>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs h-6 px-2">
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Category</label>
                  <select
                    className="w-full h-8 px-2 text-sm border rounded-md bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl"
                    value={filters.category || "all"}
                    onChange={(e) => updateFilter("category", e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand Filter */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block font-sans">Brand</label>
                  <select
                    className="w-full h-8 px-2 text-sm border rounded-lg bg-background/50 backdrop-blur-sm text-foreground border-border/50 hover:border-purple-500/50 transition-all duration-300"
                    value={filters.brand || "all"}
                    onChange={(e) => updateFilter("brand", e.target.value)}
                  >
                    <option value="all">All Brands</option>
                    {filterOptions.brands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Status</label>
                  <select
                    className="w-full h-8 px-2 text-sm border rounded-md bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl"
                    value={filters.status || "all"}
                    onChange={(e) => updateFilter("status", e.target.value)}
                  >
                    <option value="all">All Status</option>
                    {filterOptions.statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Price Range</label>
                  <select
                    className="w-full h-8 px-2 text-sm border rounded-md bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl"
                    value={filters.price_range || "all"}
                    onChange={(e) => updateFilter("price_range", e.target.value)}
                  >
                    <option value="all">All Prices</option>
                    {filterOptions.priceRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock Range Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-2 block">Stock Range</label>
                  <select
                    className="w-full h-8 px-2 text-sm border rounded-md bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl"
                    value={filters.stock_range || "all"}
                    onChange={(e) => updateFilter("stock_range", e.target.value)}
                  >
                    <option value="all">All Stock Levels</option>
                    {filterOptions.stockRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "all") return null

                let displayValue = value
                if (key === "status") {
                  const statusOption = filterOptions.statuses.find((s) => s.value === value)
                  displayValue = statusOption?.label || value
                } else if (key === "price_range") {
                  const priceOption = filterOptions.priceRanges.find((p) => p.value === value)
                  displayValue = priceOption?.label || value
                } else if (key === "stock_range") {
                  const stockOption = filterOptions.stockRanges.find((s) => s.value === value)
                  displayValue = stockOption?.label || value
                }

                return (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {displayValue}
                    <button onClick={() => clearFilter(key)} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                      <X className="h-2 w-2" />
                    </button>
                  </Badge>
                )
              })}
            </div>
          )}

          {/* Enhanced Columns Toggle Button (visible on desktop) */}
          {!isMobile && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 py-2 rounded-lg bg-transparent text-sm">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Columns
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {visibleCount}
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">Manage Columns</h4>
                    <Badge variant="outline" className="text-xs">
                      {visibleCount} visible
                    </Badge>
                  </div>

                  {/* Essential Columns */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-3 w-3 text-green-600" />
                      <span className="text-xs font-medium text-green-700">Essential Columns</span>
                    </div>
                    <div className="space-y-2 pl-5">
                      {essentialColumns.map((column) => {
                        const IconComponent = column.icon
                        return (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={column.key}
                              checked={column.visible}
                              onCheckedChange={() => toggleColumnVisibility(column.key)}
                            />
                            <IconComponent className="h-3 w-3 text-gray-500" />
                            <label htmlFor={column.key} className="text-sm flex-1">
                              {column.label}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Optional Columns */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <EyeOff className="h-3 w-3 text-gray-500" />
                      <span className="text-xs font-medium text-gray-600">Optional Columns</span>
                    </div>
                    <div className="space-y-2 pl-5 max-h-40 overflow-y-auto">
                      {optionalColumns.map((column) => {
                        const IconComponent = column.icon
                        return (
                          <div key={column.key} className="flex items-center space-x-2">
                            <Checkbox
                              id={column.key}
                              checked={column.visible}
                              onCheckedChange={() => toggleColumnVisibility(column.key)}
                            />
                            <IconComponent className="h-3 w-3 text-gray-500" />
                            <label htmlFor={column.key} className="text-sm flex-1">
                              {column.label}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Right Section: Search and Add Product Button */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:w-64">
            <ProductSearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search products..."
            />
          </div>
          {/* Add Product Button */}
          {onAddProduct && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 h-9 px-4 py-2 rounded-lg whitespace-nowrap"
              onClick={onAddProduct}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
