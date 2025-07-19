"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Hash,
  Barcode,
  DollarSign,
  Archive,
  Weight,
  Ruler,
  Tag,
  Building2,
  Calendar,
  Clock,
  Shield,
  Layers,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Product } from "./ProductTable"

interface Column {
  key: string
  label: string
  visible: boolean
  icon: any
  essential: boolean
  expandable: boolean
}

interface ProductTableViewProps {
  products: Product[]
  visibleColumns: Column[]
  selectedProducts: string[]
  onToggleAllProducts: () => void
  onToggleProductSelection: (productId: string) => void
  onCompare: (productId: string) => void
  onEdit: (product: Product) => void
  onAdjust: (product: Product) => void
  onDelete: (product: Product) => void
  formatCurrency: (value: string | number) => string
  formatDate: (dateString: string) => string
  getStockStatus: (
    currentStock: string | number,
    minStock: string | number,
  ) => { color: string; dotColor: string; text: string }
  getStockBars: (currentStock: string | number, minStock: string | number) => number
}

export function ProductTableView({
  products,
  visibleColumns,
  selectedProducts,
  onToggleAllProducts,
  onToggleProductSelection,
  onCompare,
  onEdit,
  onAdjust,
  onDelete,
  formatCurrency,
  formatDate,
  getStockStatus,
  getStockBars,
}: ProductTableViewProps) {
  const renderCellContent = (product: Product, columnKey: string) => {
    switch (columnKey) {
      case "name":
        return (
          <TableCell className="min-w-[250px] max-w-[300px]">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0"
              >
                <Package className="w-5 h-5 text-blue-600" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">{product.name}</div>
                <div className="flex items-center gap-1 mt-1">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-sm text-gray-500 font-mono">{product.sku}</span>
                </div>
              </div>
            </div>
          </TableCell>
        )

      case "description":
        return (
          <TableCell className="min-w-[200px] max-w-[250px]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-sm text-gray-600 truncate" title={product.description}>
                {product.description || "No description"}
              </span>
            </div>
          </TableCell>
        )

      case "barcode":
        return (
          <TableCell className="min-w-[140px]">
            <div className="flex items-center gap-2">
              <Barcode className="w-4 h-4 text-gray-400" />
              <span className="font-mono text-sm">{product.barcode}</span>
            </div>
          </TableCell>
        )

      case "price":
        return (
          <TableCell className="min-w-[140px]">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-900">${formatCurrency(product.selling_price)}</span>
              </div>
              <div className="text-sm text-gray-500">Cost: ${formatCurrency(product.cost_price)}</div>
              <div className="text-xs text-gray-400">
                Margin:{" "}
                {(
                  ((Number(product.selling_price) - Number(product.cost_price)) / Number(product.selling_price)) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          </TableCell>
        )

      case "stock":
        const stockStatus = getStockStatus(product.current_stock, product.min_stock_level)
        return (
          <TableCell className="min-w-[140px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4 text-gray-400" />
                <span className="font-semibold text-gray-900">{product.current_stock}</span>
                <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`} />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-1 rounded-full ${
                      i < getStockBars(product.current_stock, product.min_stock_level)
                        ? stockStatus.color
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Min: {product.min_stock_level} | Max: {product.max_stock_level}
              </div>
            </div>
          </TableCell>
        )

      case "category":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <Badge variant="outline" className="font-normal">
                {product.category}
              </Badge>
            </div>
          </TableCell>
        )

      case "brand":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700 font-medium">{product.brand}</span>
            </div>
          </TableCell>
        )

      case "unit":
        return (
          <TableCell className="min-w-[100px]">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{product.unit}</span>
            </div>
          </TableCell>
        )

      case "weight":
        return (
          <TableCell className="min-w-[100px]">
            <div className="flex items-center gap-2">
              <Weight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{product.weight} kg</span>
            </div>
          </TableCell>
        )

      case "dimensions":
        return (
          <TableCell className="min-w-[140px]">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">{product.dimensions}</span>
            </div>
          </TableCell>
        )

      case "reorder_point":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-orange-500" />
              <span className="text-gray-700">{product.reorder_point}</span>
            </div>
          </TableCell>
        )

      case "max_stock_level":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">{product.max_stock_level}</span>
            </div>
          </TableCell>
        )

      case "is_active":
        return (
          <TableCell className="min-w-[100px]">
            <div className="flex items-center gap-2">
              {product.is_active ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700 font-medium">Active</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700 font-medium">Inactive</span>
                </>
              )}
            </div>
          </TableCell>
        )

      case "track_serial":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <Badge variant={product.track_serial ? "default" : "secondary"} className="text-xs">
                {product.track_serial ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </TableCell>
        )

      case "track_batch":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-400" />
              <Badge variant={product.track_batch ? "default" : "secondary"} className="text-xs">
                {product.track_batch ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </TableCell>
        )

      case "is_composite":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-400" />
              <Badge variant={product.is_composite ? "default" : "secondary"} className="text-xs">
                {product.is_composite ? "Yes" : "No"}
              </Badge>
            </div>
          </TableCell>
        )

      case "created_at":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">{formatDate(product.created_at)}</span>
            </div>
          </TableCell>
        )

      case "updated_at":
        return (
          <TableCell className="min-w-[120px]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 w-4 text-gray-400" />
              <span className="text-gray-600 text-sm">{formatDate(product.updated_at)}</span>
            </div>
          </TableCell>
        )

      case "actions":
        return (
          <TableCell className="min-w-[80px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => onCompare(product.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Compare Prices
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => onAdjust(product)}>
                    <Package className="h-4 w-4 mr-2" />
                    Adjust Stock
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </TableCell>
        )

      default:
        return <TableCell>-</TableCell>
    }
  }

  return (
    <div className="w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="w-12 sticky left-0 bg-gray-50/50 z-10">
              <Checkbox checked={selectedProducts.length === products.length} onCheckedChange={onToggleAllProducts} />
            </TableHead>
            {visibleColumns.map((column) => {
              if (!column.visible) return null
              const IconComponent = column.icon
              return (
                <TableHead key={column.key} className="font-semibold text-left whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-gray-500" />
                    {column.label}
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="w-12 sticky left-0 bg-white group-hover:bg-gray-50/50 z-10">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => onToggleProductSelection(product.id)}
                  />
                </TableCell>
                {visibleColumns.map((column) => {
                  if (!column.visible) return null
                  return (
                    <React.Fragment key={`${product.id}-${column.key}`}>
                      {renderCellContent(product, column.key)}
                    </React.Fragment>
                  )
                })}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  )
}
