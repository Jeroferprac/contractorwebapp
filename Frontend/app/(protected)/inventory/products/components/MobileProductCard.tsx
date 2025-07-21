"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  ChevronDown,
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Product } from "./ProductTable"

interface MobileProductCardProps {
  product: Product
  isExpanded: boolean
  isSelected: boolean
  onToggleExpansion: (productId: string) => void
  onToggleSelection: (productId: string) => void
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
}

export function MobileProductCard({
  product,
  isExpanded,
  isSelected,
  onToggleExpansion,
  onToggleSelection,
  onCompare,
  onEdit,
  onAdjust,
  onDelete,
  formatCurrency,
  formatDate,
  getStockStatus,
}: MobileProductCardProps) {
  const stockStatus = getStockStatus(product.current_stock, product.min_stock_level)
  const isActive = Number(product.current_stock) > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      className="rounded-xl lg:rounded-2xl shadow-lg bg-background mb-3 lg:mb-4 p-4 lg:p-6 text-foreground border border-border hover:border-purple-500/50 transition-all duration-500 font-sans overflow-hidden"
    >
      <div className="cursor-pointer" onClick={() => onToggleExpansion(product.id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(product.id)}
              onClick={(e) => e.stopPropagation()}
              className="border-purple-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
            />
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/25"
            >
              <Package className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-foreground truncate text-sm lg:text-base">{product.name}</div>
              <div className="flex items-center gap-2 mt-0.5 lg:mt-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Hash className="w-3 h-3" />
                  {product.sku}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className={`w-2 h-2 rounded-full ${stockStatus.dotColor} shadow-lg`}
                />
                <span className="text-xs text-muted-foreground font-medium">{stockStatus.text}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="font-bold text-foreground text-sm lg:text-base truncate">
                ${Math.round(Number(product.selling_price)).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground truncate">{product.current_stock} units</div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3, type: "spring" }}>
              <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500" />
            </motion.div>
          </div>
        </div>

        {/* Enhanced Stock Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1.5 lg:h-2 mt-3 lg:mt-4 border border-border">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, Math.round((Number(product.current_stock) / Number(product.max_stock_level || 1)) * 100))}%`,
            }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-1.5 lg:h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/50"
          />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, type: "spring" }}
            className="border-t border-border overflow-hidden mt-3 lg:mt-4"
          >
            <div className="pt-4 lg:pt-6 space-y-4 lg:space-y-6">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-1 lg:space-y-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    <DollarSign className="w-3 h-3" />
                    Pricing
                  </div>
                  <div className="font-bold text-foreground text-base lg:text-xl truncate">
                    ${Math.round(Number(product.selling_price)).toLocaleString()}
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground truncate">
                    Cost: ${Math.round(Number(product.cost_price)).toLocaleString()}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-1 lg:space-y-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    <Archive className="w-3 h-3" />
                    Stock Info
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-base lg:text-xl truncate">
                      {Number(product.current_stock).toLocaleString()}
                    </span>
                    <span className="text-xs lg:text-sm text-muted-foreground truncate">
                      / {Number(product.max_stock_level).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs lg:text-sm text-muted-foreground truncate">
                    Min: {Number(product.min_stock_level).toLocaleString()}
                  </div>
                </motion.div>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-1 lg:space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    <Tag className="w-3 h-3" />
                    Category
                  </div>
                  <Badge
                    variant="outline"
                    className="w-fit text-foreground border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 text-xs"
                  >
                    {product.category}
                  </Badge>
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-1 lg:space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    <Building2 className="w-3 h-3" />
                    Brand
                  </div>
                  <div className="text-foreground font-semibold text-sm">{product.brand}</div>
                </motion.div>
              </div>

              {/* Additional Details */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 lg:space-y-4 pt-3 lg:pt-4 border-t border-border"
              >
                <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm">
                  <div className="flex items-center gap-2 p-2 lg:p-3 rounded-lg bg-muted/50 border border-border">
                    <Barcode className="w-3 h-3 lg:w-4 lg:h-4 text-purple-500" />
                    <span className="text-muted-foreground text-xs">Barcode:</span>
                    <span className="font-mono text-xs text-foreground">{product.barcode}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 lg:p-3 rounded-lg bg-muted/50 border border-border">
                    <Package className="w-3 h-3 lg:w-4 lg:h-4 text-blue-500" />
                    <span className="text-muted-foreground text-xs">Unit:</span>
                    <span className="text-foreground text-xs">{product.unit}</span>
                  </div>
                </div>

                {product.weight > 0 && (
                  <div className="grid grid-cols-2 gap-3 lg:gap-4 text-sm">
                    <div className="flex items-center gap-2 p-2 lg:p-3 rounded-lg bg-muted/50 border border-border">
                      <Weight className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                      <span className="text-muted-foreground text-xs">Weight:</span>
                      <span className="text-foreground text-xs">{product.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 lg:p-3 rounded-lg bg-muted/50 border border-border">
                      <Ruler className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                      <span className="text-muted-foreground text-xs">Size:</span>
                      <span className="text-xs text-foreground">{product.dimensions}</span>
                    </div>
                  </div>
                )}

                {/* Tracking Info */}
                <div className="flex flex-wrap gap-2">
                  {product.track_serial && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Serial Tracking
                    </Badge>
                  )}
                  {product.track_batch && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    >
                      <Layers className="w-3 h-3 mr-1" />
                      Batch Tracking
                    </Badge>
                  )}
                  {product.is_composite && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg shadow-purple-500/25"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Composite
                    </Badge>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3 lg:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                    <Calendar className="w-3 h-3" />
                    <span className="text-muted-foreground">Created: {formatDate(product.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border">
                    <Clock className="w-3 h-3" />
                    <span className="text-muted-foreground">Updated: {formatDate(product.updated_at)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between pt-3 lg:pt-4 border-t border-border"
              >
                <div className="flex items-center gap-2 lg:gap-3">
                  <Switch
                    checked={isActive}
                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-500 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-red-500 data-[state=unchecked]:to-pink-500"
                  />
                  <span className="text-xs lg:text-sm text-muted-foreground font-medium">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 lg:h-10 lg:w-10 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300"
                      >
                        <MoreHorizontal className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent className="w-44 lg:w-48 bg-background border border-border shadow-2xl" align="end">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm"
                        onClick={() => onCompare(product.id)}
                      >
                        <Eye className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        Compare Prices
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        Edit Product
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-foreground hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 text-xs lg:text-sm"
                        onClick={() => onAdjust(product)}
                      >
                        <Package className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        Adjust Stock
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-red-500 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 text-xs lg:text-sm"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
