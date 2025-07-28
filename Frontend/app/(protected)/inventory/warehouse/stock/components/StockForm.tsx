"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, X, CheckCircle, Calendar, MapPin, Package, FileText, Building2, Box, Hash, AlertTriangle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getWarehouses, createWarehouseStock, updateWarehouseStock, deleteWarehouseStock } from "@/lib/warehouse"
import { getProducts } from "@/lib/inventory"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"
import type { Product } from "@/types/inventory"

interface StockFormProps {
  stock: WarehouseStock | null
  isEditing: boolean
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
  title?: string
}

export function StockForm({ stock, isEditing, isOpen, onClose, onSuccess }: StockFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [formData, setFormData] = useState<Partial<WarehouseStock>>({
    product_id: "",
    warehouse_id: "",
    quantity: 0,
    reserved_quantity: 0,
    bin_location: "",
    notes: "",
  })
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // Toast functions
  const addToast = (type: 'success' | 'error' | 'warning', message: string, title?: string) => {
    const id = Date.now().toString()
    const newToast: Toast = { id, type, message, title }
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  useEffect(() => {
    Promise.all([getWarehouses(), getProducts()]).then(([wh, pr]) => {
      setWarehouses(wh)
      setProducts(pr)
    })
  }, [])

  useEffect(() => {
    if (stock) {
      setFormData({
        product_id: stock.product_id || "",
        warehouse_id: stock.warehouse_id || "",
        quantity: stock.quantity || 0,
        reserved_quantity: stock.reserved_quantity || 0,
        bin_location: stock.bin_location || "",
        notes: stock.notes || "",
      })
    } else {
      setFormData({
        product_id: "",
        warehouse_id: "",
        quantity: 0,
        reserved_quantity: 0,
        bin_location: "",
        notes: "",
      })
    }
  }, [stock])

  const handleSave = async () => {
    setIsSubmitting(true)
    
    try {
      // Validate required fields
      if (!formData.product_id || !formData.warehouse_id) {
        addToast('error', 'Please select both Product and Warehouse', 'Validation Error')
        return
      }

      // Ensure numeric values are properly converted
      const quantity = Number(formData.quantity) || 0
      const reservedQuantity = Number(formData.reserved_quantity) || 0
      const availableQuantity = quantity - reservedQuantity

      // Validate quantities
      if (quantity < 0) {
        addToast('error', 'Quantity cannot be negative', 'Validation Error')
        return
      }

      if (reservedQuantity < 0) {
        addToast('error', 'Reserved quantity cannot be negative', 'Validation Error')
        return
      }

      if (reservedQuantity > quantity) {
        addToast('error', 'Reserved quantity cannot exceed total quantity', 'Validation Error')
        return
      }

      const payload = {
        product_id: formData.product_id,
        warehouse_id: formData.warehouse_id,
        quantity: quantity,
        reserved_quantity: reservedQuantity,
        available_quantity: availableQuantity, // Always include this as a number
        bin_location: formData.bin_location || "",
        notes: formData.notes || "",
      }

      console.log('Saving stock with payload:', payload)
      console.log('Is editing:', isEditing)
      console.log('Stock ID:', stock?.id)

      if (isEditing && stock?.id) {
        console.log('Updating existing stock...')
        await updateWarehouseStock(stock.id, payload)
      } else {
        console.log('Creating new stock...')
        await createWarehouseStock(payload)
      }

      console.log('Stock saved successfully!')
      setShowSuccess(true)
      addToast('success', 'Stock saved successfully!', 'Success')
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
        setTimeout(() => {
          setShowSuccess(false)
          setTimeout(() => {
            onClose()
            window.location.reload() // Refresh to show updated data
          }, 500)
        }, 2000)
    } catch (error: any) {
      console.error('Error saving stock:', error)
      
      // Handle 422 validation error
      if (error.status === 422 || error.statusCode === 422) {
        let errorMessage = 'Please check all required fields'
        if (error.detail) {
          if (Array.isArray(error.detail)) {
            errorMessage = error.detail.map((err: any) => err.msg || err.message).join(', ')
          } else if (typeof error.detail === 'string') {
            errorMessage = error.detail
          } else if (error.detail.msg) {
            errorMessage = error.detail.msg
          }
        }
        addToast('error', errorMessage, 'Validation Error')
      } else {
        addToast('error', 'Failed to save stock. Please try again.', 'Error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!stock?.id) return
    
    const confirmed = confirm('Are you sure you want to delete this stock item?')
    if (!confirmed) return
    
    setIsSubmitting(true)
    try {
      await deleteWarehouseStock(stock.id)

        setShowSuccess(true)
      addToast('success', 'Stock deleted successfully!', 'Success')
        setTimeout(() => {
          setShowSuccess(false)
          setTimeout(() => {
            onClose()
            window.location.reload() // Refresh to show updated data
          }, 500)
        }, 2000)
    } catch (error: any) {
      console.error('Error deleting stock:', error)
      addToast('error', 'Failed to delete stock. Please try again.', 'Error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    return warehouse?.name || warehouseId
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || productId
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  }

  const sheetVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
      },
    },
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.5,
      },
    },
  }

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.9 }}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl shadow-2xl max-w-sm",
                toast.type === 'success' && "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
                toast.type === 'error' && "bg-gradient-to-r from-red-500 to-pink-500 text-white",
                toast.type === 'warning' && "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
              )}
            >
              <div className="flex-shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="font-semibold text-sm">{toast.title}</p>
                )}
                <p className="text-sm opacity-90">{toast.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeToast(toast.id)}
                className={cn(
                  "text-white hover:bg-white/20 ml-2 flex-shrink-0 p-1 h-auto"
                )}
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stock Form Modal */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl max-w-md w-full max-h-[90vh] overflow-hidden"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {isEditing ? (
                    <Edit className="w-5 h-5 text-white" />
                  ) : (
                    <Package className="w-5 h-5 text-white" />
                  )}
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {isEditing ? "Edit Stock" : "Add New Stock"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEditing ? "Update stock information" : "Create new stock entry"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Form Content */}
            <motion.div
              className="overflow-y-auto p-6 max-h-[calc(90vh-140px)]"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-6">
                {/* Product Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Box className="w-4 h-4 text-purple-500" />
                    Product
                  </Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => handleInputChange("product_id", value)}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id} className="rounded-lg">
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Warehouse Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Warehouse
                  </Label>
                  <Select
                    value={formData.warehouse_id}
                    onValueChange={(value) => handleInputChange("warehouse_id", value)}
                  >
                    <SelectTrigger className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
                      <SelectValue placeholder="Select a warehouse" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id} className="rounded-lg">
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bin Location */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Bin Location
                  </Label>
                  <Input
                    value={formData.bin_location}
                    onChange={(e) => handleInputChange("bin_location", e.target.value)}
                    placeholder="e.g., A1-B2"
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                  />
                </div>

                {/* Quantity Fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Package className="w-4 h-4 text-orange-500" />
                      Total Quantity
                    </Label>
                    <Input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange("quantity", Number(e.target.value))}
                      placeholder="0"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      Reserved Quantity
                    </Label>
                    <Input
                      type="number"
                      value={formData.reserved_quantity}
                      onChange={(e) => handleInputChange("reserved_quantity", Number(e.target.value))}
                      placeholder="0"
                      className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Available Quantity
                    </Label>
                    <Input
                      type="number"
                      value={(formData.quantity || 0) - (formData.reserved_quantity || 0)}
                      disabled
                      placeholder="0"
                      className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-700 rounded-xl"
                    />
                  </div>
                </div>

                {/* Success Message */}
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-green-800 dark:text-green-200 font-medium">
                          {isEditing ? "Stock updated successfully!" : "Stock created successfully!"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex gap-3">
                {isEditing && (
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-xl"
                >
                  {isSubmitting ? (
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {isEditing ? "Update" : "Create"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  )
} 