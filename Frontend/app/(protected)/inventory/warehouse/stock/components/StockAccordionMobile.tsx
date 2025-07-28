"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { WarehouseStock, Warehouse } from "@/types/warehouse"
import type { Product } from "@/types/inventory"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  ChevronRight, 
  Package, 
  MapPin, 
  Building2, 
  Calendar,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Box,
  LocateIcon as Location
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getProducts } from "@/lib/inventory"
import { deleteWarehouseStock } from "@/lib/warehouse"
import { StockForm } from "./StockForm"

interface StockAccordionMobileProps {
  data: WarehouseStock[]
  warehouses: Warehouse[]
  warehouseFilter: string
  statusFilter: string
  binLocationFilter: string
}

// Helper functions
const getWarehouseName = (warehouseId: string, warehouses: Warehouse[]) => {
  const warehouse = warehouses.find(w => w.id === warehouseId)
  return warehouse?.name || warehouseId
}

const getStatus = (quantity: number) => {
  if (quantity === 0) return "out-of-stock"
  if (quantity < 10) return "low-stock"
  return "in-stock"
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A"
  try {
    return new Date(dateString).toLocaleDateString()
  } catch {
    return "N/A"
  }
}

const statusConfig = {
  "in-stock": {
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  "low-stock": {
    icon: AlertTriangle,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  "out-of-stock": {
    icon: Clock,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
}

export function StockAccordionMobile({ data, warehouses, warehouseFilter, statusFilter, binLocationFilter }: StockAccordionMobileProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [products, setProducts] = useState<Product[]>([])
  
  // StockForm state
  const [selectedStock, setSelectedStock] = useState<WarehouseStock | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Fetch products for name lookup
  useState(() => {
    getProducts().then(setProducts)
  })

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || productId
  }

  // StockForm handlers
  const handleView = (stock: WarehouseStock) => {
    setSelectedStock(stock)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleEdit = (stock: WarehouseStock) => {
    setSelectedStock(stock)
    setIsEditing(true)
    setIsFormOpen(true)
  }

  const handleDelete = async (stock: WarehouseStock) => {
    if (confirm(`Are you sure you want to delete this stock item?`)) {
      try {
        await deleteWarehouseStock(stock.id)
        window.location.reload() // Refresh to show updated data
      } catch (error) {
        console.error('Error deleting stock:', error)
        alert('Failed to delete stock item')
      }
    }
  }

  const handleCreate = () => {
    setSelectedStock(null)
    setIsEditing(false)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedStock(null)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add New Stock Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <Button
            onClick={handleCreate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Stock
          </Button>
        </motion.div>

        {/* Stock Items */}
        <AnimatePresence>
          {data.map((item, index) => {
            const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
            const status = getStatus(quantity)
            const warehouseName = getWarehouseName(item.warehouse_id, warehouses)
            const productName = getProductName(item.product_id)
            const statusInfo = statusConfig[status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon
            const isExpanded = expandedItems.has(item.id)

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <motion.div 
                        className="flex items-center gap-3 flex-1"
                        whileHover={{ scale: 1.02, x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className="w-10 h-10 rounded-xl border-2 border-purple-500 flex items-center justify-center bg-transparent">
                          <Box className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {productName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            ID: {item.product_id}
                          </p>
                        </div>
                      </motion.div>
                      
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          statusInfo.bgColor
                        )}>
                          <StatusIcon className={cn("w-4 h-4", statusInfo.color)} />
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 space-y-3 pt-4 border-t border-border"
                        >
                          {/* Quantity */}
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <div className="w-8 h-8 rounded-lg border-2 border-blue-500 flex items-center justify-center bg-transparent">
                              <Package className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Quantity</p>
                              <p className="text-lg font-semibold text-foreground">
                                {quantity.toLocaleString()}
                              </p>
                            </div>
                          </motion.div>

                          {/* Bin Location */}
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <div className="w-8 h-8 rounded-lg border-2 border-green-500 flex items-center justify-center bg-transparent">
                              <Location className="w-4 h-4 text-green-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Bin Location</p>
                              <p className="text-lg font-semibold text-foreground">
                                {item.bin_location || "N/A"}
                              </p>
                            </div>
                          </motion.div>

                          {/* Warehouse */}
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <div className="w-8 h-8 rounded-lg border-2 border-orange-500 flex items-center justify-center bg-transparent">
                              <Building2 className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Warehouse</p>
                              <p className="text-lg font-semibold text-foreground">
                                {warehouseName}
                              </p>
                            </div>
                          </motion.div>

                          {/* Last Updated */}
                          <motion.div 
                            className="flex items-center gap-3"
                            whileHover={{ scale: 1.02, x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <div className="w-8 h-8 rounded-lg border-2 border-red-500 flex items-center justify-center bg-transparent">
                              <Calendar className="w-4 h-4 text-red-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                              <p className="text-lg font-semibold text-foreground">
                                {formatDate(item.created_at)}
                              </p>
                            </div>
                          </motion.div>

                          {/* Actions */}
                          <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(item)}
                                className="flex items-center gap-2 rounded-xl"
                              >
                                <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                View
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(item)}
                                className="flex items-center gap-2 rounded-xl"
                              >
                                <Edit className="w-4 h-4 text-green-600 dark:text-green-400" />
                                Edit
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(item)}
                                className="flex items-center gap-2 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                Delete
                              </Button>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* StockForm Modal */}
      <StockForm
        stock={selectedStock}
        isEditing={isEditing}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </>
  )
}
