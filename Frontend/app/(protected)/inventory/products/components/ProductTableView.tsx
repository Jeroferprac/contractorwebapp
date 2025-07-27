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
import type { Product } from "@/lib/inventory";

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
  onView: (product: Product) => void
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
  onView,
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
          <TableCell className="min-w-[180px] max-w-[220px] lg:min-w-[200px] lg:max-w-[250px] py-3">
            <div className="flex items-center gap-2 lg:gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/25"
              >
                <Package className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate text-sm lg:text-base font-sans">
                  {product.name}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-mono">{product.sku}</span>
                </div>
              </div>
            </div>
          </TableCell>
        )
      case "description":
        return (
          <TableCell className="min-w-[130px] max-w-[180px] lg:min-w-[200px] lg:max-w-[250px]">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs lg:text-sm text-muted-foreground truncate font-sans" title={product.description}>
                {product.description || "No description"}
              </span>
            </div>
          </TableCell>
        )
      case "barcode":
        return (
          <TableCell className="min-w-[100px] lg:min-w-[140px]">
            <div className="flex items-center gap-2 p-1.5 lg:p-2 rounded-md lg:rounded-lg bg-background border border-border">
              <Barcode className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
              <span className="font-mono text-xs lg:text-sm text-foreground">{product.barcode}</span>
            </div>
          </TableCell>
        )
      case "price":
        return (
          <TableCell className="min-w-[100px] lg:min-w-[120px] text-right">
            <div className="space-y-1">
              <div className="flex items-center justify-end gap-1">
                <DollarSign className="w-3 h-3 text-green-500 flex-shrink-0" />
                <span className="font-bold text-foreground text-sm lg:text-base font-sans">
                  ${Math.round(Number(product.selling_price)).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                Cost: ${Math.round(Number(product.cost_price)).toLocaleString()}
              </div>
              <div className="text-xs text-purple-500 font-medium text-right">
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
          <TableCell className="min-w-[100px] lg:min-w-[120px] text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Archive className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                <span className="font-bold text-foreground text-sm lg:text-base font-sans">
                  {Number(product.current_stock).toLocaleString()}
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className={`w-2 h-2 rounded-full ${stockStatus.dotColor} shadow-sm`}
                />
              </div>
              {/* Compact Stock Progress Bar */}
              <div className="flex gap-0.5 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`w-1 h-1.5 rounded-full transition-all duration-500 ${
                      i < getStockBars(product.current_stock, product.min_stock_level)
                        ? "bg-gradient-to-t from-purple-500 to-blue-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Min: {Number(product.min_stock_level).toLocaleString()}
              </div>
            </div>
          </TableCell>
        )
      case "category":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[100px] py-3">
            <div className="flex items-center justify-center">
              <Badge
                variant="outline"
                className="font-medium text-foreground border-purple-500/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs font-sans"
              >
                {product.category?.name || "Uncategorized"}
              </Badge>
            </div>
          </TableCell>
        )
      case "brand":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[100px] py-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
              <span className="text-foreground font-semibold text-xs lg:text-sm font-sans">{product.brand}</span>
            </div>
          </TableCell>
        )
      case "unit":
        return (
          <TableCell className="min-w-[60px] lg:min-w-[100px]">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs lg:text-sm font-sans">{product.unit}</span>
            </div>
          </TableCell>
        )
      case "weight":
        return (
          <TableCell className="min-w-[60px] lg:min-w-[100px]">
            <div className="flex items-center gap-2">
              <Weight className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs lg:text-sm font-sans">{product.weight} kg</span>
            </div>
          </TableCell>
        )
      case "dimensions":
        return (
          <TableCell className="min-w-[100px] lg:min-w-[140px]">
            <div className="flex items-center gap-2">
              <Ruler className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs font-sans">{product.dimensions}</span>
            </div>
          </TableCell>
        )
      case "reorder_point":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Archive className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500" />
              <span className="text-foreground font-medium text-xs lg:text-sm font-sans">{product.reorder_point}</span>
            </div>
          </TableCell>
        )
      case "max_stock_level":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Archive className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
              <span className="text-foreground font-medium text-xs lg:text-sm font-sans">
                {product.max_stock_level}
              </span>
            </div>
          </TableCell>
        )
      case "is_active":
        return (
          <TableCell className="min-w-[60px] lg:min-w-[100px]">
            <div className="flex items-center gap-2">
              {product.is_active ? (
                <>
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/25 text-xs font-sans">
                    Active
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 lg:w-4 lg:h-4 text-red-500" />
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/25 text-xs font-sans">
                    Inactive
                  </Badge>
                </>
              )}
            </div>
          </TableCell>
        )
      case "track_serial":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
              <Badge
                variant={product.track_serial ? "default" : "secondary"}
                className={`text-xs transition-all duration-300 font-sans ${
                  product.track_serial
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {product.track_serial ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </TableCell>
        )
      case "track_batch":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Layers className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
              <Badge
                variant={product.track_batch ? "default" : "secondary"}
                className={`text-xs transition-all duration-300 font-sans ${
                  product.track_batch
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {product.track_batch ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </TableCell>
        )
      case "is_composite":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Package className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
              <Badge
                variant={product.is_composite ? "default" : "secondary"}
                className={`text-xs transition-all duration-300 font-sans ${
                  product.is_composite
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {product.is_composite ? "Yes" : "No"}
              </Badge>
            </div>
          </TableCell>
        )
      case "created_at":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Calendar className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs font-sans">{formatDate(product.created_at)}</span>
            </div>
          </TableCell>
        )
      case "updated_at":
        return (
          <TableCell className="min-w-[80px] lg:min-w-[120px]">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 lg:w-4 lg:h-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs font-sans">{formatDate(product.updated_at ?? "")}</span>
            </div>
          </TableCell>
        )
      case "actions":
        return (
          <TableCell className="min-w-[60px] lg:min-w-[80px] py-3 text-center">
            <Popover>
              <PopoverTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-7 w-7 lg:h-8 lg:w-8 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-md shadow-purple-500/25"
                  >
                    <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </motion.div>
              </PopoverTrigger>
              <PopoverContent className="w-44 lg:w-48 bg-background border border-border shadow-xl" align="end">
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
                    onClick={() => onView(product)}
                  >
                    <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
                    onClick={() => onCompare(product.id)}
                  >
                    <Layers className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Compare Prices
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
                    onClick={() => onEdit(product)}
                  >
                    <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Edit Product
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
                    onClick={() => onAdjust(product)}
                  >
                    <Package className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Adjust Stock
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 text-xs lg:text-sm font-sans"
                    onClick={() => onDelete(product)}
                  >
                    <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
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
    <div className="w-full rounded-xl lg:rounded-2xl shadow-xl bg-gradient-to-br from-background via-background to-muted/30 border border-border overflow-hidden">
      <div className="bg-background rounded-lg lg:rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
          <Table className="min-w-full text-xs">
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border hover:bg-muted/30 h-8">
                <TableHead className="w-8 lg:w-12 sticky left-0 bg-background z-10 border-r border-border py-2 px-2 text-xs">
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    onCheckedChange={onToggleAllProducts}
                    className="border-purple-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
                  />
                </TableHead>
                {visibleColumns.map((column) => {
                  if (!column.visible) return null
                  const IconComponent = column.icon
                  return (
                    <TableHead
                      key={column.key}
                      className="font-bold text-foreground text-left whitespace-nowrap text-xs font-sans py-2 px-2"
                    >
                      <div className="flex items-center gap-1 lg:gap-2">
                        <IconComponent className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
                        {column.label}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs">
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/30 transition-all duration-300 border-b border-border/30 h-8 text-xs"
                  >
                    <TableCell className="w-8 lg:w-12 sticky left-0 bg-background group-hover:bg-muted/30 z-10 border-r border-border py-2 px-2">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onCheckedChange={() => onToggleProductSelection(product.id)}
                        className="border-purple-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
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
      </div>
    </div>
  )
}
