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
      className="border border-gray-200 rounded-xl bg-white shadow-sm mb-3 overflow-hidden"
    >
      <div className="p-4 cursor-pointer" onClick={() => onToggleExpansion(product.id)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(product.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0"
            >
              <Package className="w-6 h-6 text-blue-600" />
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate text-base">{product.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Hash className="w-3 h-3" />
                  {product.sku}
                </div>
                <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`} />
                <span className="text-xs text-gray-500">{stockStatus.text}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="font-semibold text-gray-900">${formatCurrency(product.selling_price)}</div>
              <div className="text-xs text-gray-500">{product.current_stock} units</div>
            </div>
            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-100 overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Primary Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
                    <DollarSign className="w-3 h-3" />
                    Pricing
                  </div>
                  <div className="font-semibold text-gray-900">${formatCurrency(product.selling_price)}</div>
                  <div className="text-sm text-gray-600">Cost: ${formatCurrency(product.cost_price)}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
                    <Archive className="w-3 h-3" />
                    Stock Info
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{product.current_stock}</span>
                    <span className="text-sm text-gray-500">/ {product.max_stock_level}</span>
                  </div>
                  <div className="text-sm text-gray-600">Min: {product.min_stock_level}</div>
                </div>
              </div>

              {/* Category and Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
                    <Tag className="w-3 h-3" />
                    Category
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {product.category}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500 uppercase tracking-wide">
                    <Building2 className="w-3 h-3" />
                    Brand
                  </div>
                  <div className="text-gray-700 font-medium">{product.brand}</div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Barcode className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Barcode:</span>
                    <span className="font-mono text-xs">{product.barcode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Unit:</span>
                    <span>{product.unit}</span>
                  </div>
                </div>

                {product.weight > 0 && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Weight className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Weight:</span>
                      <span>{product.weight} kg</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Size:</span>
                      <span className="text-xs">{product.dimensions}</span>
                    </div>
                  </div>
                )}

                {/* Tracking Info */}
                <div className="flex flex-wrap gap-2">
                  {product.track_serial && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Serial Tracking
                    </Badge>
                  )}
                  {product.track_batch && (
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="w-3 h-3 mr-1" />
                      Batch Tracking
                    </Badge>
                  )}
                  {product.is_composite && (
                    <Badge variant="secondary" className="text-xs">
                      <Package className="w-3 h-3 mr-1" />
                      Composite
                    </Badge>
                  )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Created: {formatDate(product.created_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated: {formatDate(product.updated_at)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isActive}
                    className="data-[state=checked]:bg-gradient-to-r from-green-400 to-green-600 data-[state=unchecked]:bg-gradient-to-r from-red-400 to-red-600"
                  />
                  <span className="text-sm text-gray-600">{isActive ? "Active" : "Inactive"}</span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onEdit(product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Product
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => onAdjust(product)}
                      >
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
