"use client"

import { Search, Filter, Building, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StockFilterBarProps {
  warehouseFilter: string
  onWarehouseChange: (value: string) => void
  categoryFilter: string
  onCategoryChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  warehouseOptions: string[]
  categoryOptions: string[]
}

export function StockFilterBar({
  warehouseFilter,
  onWarehouseChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  warehouseOptions,
  categoryOptions,
}: StockFilterBarProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products, SKU, or bin location..."
                className="pl-10 hover:border-purple-500/30 focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Warehouse Filter */}
            <Select value={warehouseFilter} onValueChange={onWarehouseChange}>
              <SelectTrigger className="w-full lg:w-48 hover:border-purple-500/30 focus:border-purple-500 transition-colors">
                <Building className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouseOptions.map((w) => (
                  <SelectItem key={w} value={w}>{w === "all" ? "All Warehouses" : w}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full lg:w-40 hover:border-purple-500/30 focus:border-purple-500 transition-colors">
                <Tag className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full lg:w-40 hover:border-purple-500/30 focus:border-purple-500 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
