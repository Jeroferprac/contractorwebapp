"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Eye, X, CheckCircle, Calendar, MapPin, Package, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { getWarehouses } from "@/lib/warehouse"
import type { Warehouse, WarehouseTransfer } from "@/types/warehouse"

interface TransferFormProps {
  transfer: WarehouseTransfer | null
  isEditing: boolean
  isOpen: boolean
  onClose: () => void
}

const statusConfig = {
  completed: {
    label: "Completed",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
  },
  pending: {
    label: "Pending",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
  },
  "in-transit": {
    label: "In Transit",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
  },
} as const

export function TransferForm({ transfer, isEditing, isOpen, onClose }: TransferFormProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<WarehouseTransfer>>(
    transfer || {
      transfer_number: "",
      from_warehouse_id: "",
      to_warehouse_id: "",
      transfer_date: "",
      status: "pending",
      notes: "",
      created_by: "",
      items: [],
    }
  )
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])

  useEffect(() => {
    getWarehouses().then(setWarehouses)
  }, [])

  useEffect(() => {
    setFormData(
      transfer || {
        transfer_number: "",
        from_warehouse_id: "",
        to_warehouse_id: "",
        transfer_date: "",
        status: "pending",
        notes: "",
        created_by: "",
        items: [],
      }
    )
  }, [transfer])

  if (!formData) return null

  const handleSave = async () => {
    setIsSubmitting(true)

    // Generate a unique transfer number if not present
    const transfer_number = formData.transfer_number || `TRF-${Date.now()}`

    // Build the payload for backend
    const payload = {
      transfer_number,
      from_warehouse_id: formData.from_warehouse_id,
      to_warehouse_id: formData.to_warehouse_id,
      transfer_date: formData.transfer_date || new Date().toISOString().slice(0, 10),
      status: formData.status || "pending",
      notes: formData.notes || "",
      created_by: formData.created_by, // Should be set from user context/session
      items: formData.items || [], // TODO: Add product selection UI if not present
    }

    try {
      const res = await fetch("/api/v1/inventory/inventory/warehouses/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create transfer")

      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setTimeout(() => {
          onClose()
        }, 500)
      }, 2000)
    } catch (err) {
      // TODO: Show error toast
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
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
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
      },
    },
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
      },
    },
  }

  // Helper function to get warehouse name by ID
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    return warehouse?.name || warehouseId
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Sheet Content - Compact Size */}
          <motion.div
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 overflow-hidden border-l-2 border-purple-500"
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ borderRadius: "20px 0 0 20px" }}
          >
            <div className="h-full flex flex-col relative">
              {/* Success Notification - Compact */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    className="absolute top-4 left-4 right-4 z-60"
                    initial={{ opacity: 0, y: -30, scale: 0.9 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 25,
                      },
                    }}
                    exit={{
                      opacity: 0,
                      y: -30,
                      scale: 0.9,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                      <motion.div
                        className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{
                          scale: 1,
                          rotate: 0,
                          transition: { delay: 0.2, type: "spring", stiffness: 400 },
                        }}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.div>
                      <span className="font-semibold text-sm">Transfer updated successfully!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header - Compact */}
              <motion.div
                className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shadow-md",
                      isEditing
                        ? "bg-gradient-to-br from-purple-500 to-blue-500"
                        : "bg-gradient-to-br from-gray-500 to-gray-600",
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEditing ? <Edit className="w-5 h-5 text-white" /> : <Eye className="w-5 h-5 text-white" />}
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {isEditing ? "Edit Transfer" : "Transfer Details"}
                    </h2>
                    <p className="text-xs text-gray-500 font-medium">{formData.transfer_number || formData.id}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </motion.button>
              </motion.div>

              {/* Form Content - Compact */}
              <motion.div
                className="flex-1 overflow-y-auto p-5 space-y-5"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {/* Transfer Number */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="transferNumber" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-3 h-3 text-purple-500" />
                    Transfer Number
                    </Label>
                    <Input
                    id="transferNumber"
                    value={formData.transfer_number || ""}
                      disabled={!isEditing}
                    onChange={(e) => handleInputChange("transfer_number", e.target.value)}
                    className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-60"
                    />
                  </motion.div>

                {/* Location Section - Compact Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="fromWarehouse" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-green-500" />
                      From Warehouse
                    </Label>
                    {isEditing ? (
                      <Select 
                        value={formData.from_warehouse_id} 
                        onValueChange={(value) => handleInputChange("from_warehouse_id", value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-all duration-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border border-gray-200 shadow-xl">
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id} className="rounded-md text-sm">
                              {warehouse.name}
                          </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={getWarehouseName(formData.from_warehouse_id || "")}
                        disabled
                        className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm disabled:opacity-60"
                      />
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="toWarehouse" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" />
                      To Warehouse
                    </Label>
                    {isEditing ? (
                      <Select 
                        value={formData.to_warehouse_id} 
                        onValueChange={(value) => handleInputChange("to_warehouse_id", value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-all duration-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border border-gray-200 shadow-xl">
                          {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id} className="rounded-md text-sm">
                              {warehouse.name}
                          </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={getWarehouseName(formData.to_warehouse_id || "")}
                        disabled
                        className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm disabled:opacity-60"
                      />
                    )}
                  </motion.div>
                </div>

                {/* Status and Date - Compact Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="status" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <div className={cn("w-3 h-3 rounded-full", statusConfig[formData.status as keyof typeof statusConfig]?.color || "bg-gray-500")} />
                      Status
                    </Label>
                    {isEditing ? (
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange("status", value)}
                      >
                        <SelectTrigger className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 transition-all duration-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border border-gray-200 shadow-xl">
                          <SelectItem value="pending" className="rounded-md text-sm">
                            Pending
                          </SelectItem>
                          <SelectItem value="in-transit" className="rounded-md text-sm">
                            In Transit
                          </SelectItem>
                          <SelectItem value="completed" className="rounded-md text-sm">
                            Completed
                          </SelectItem>
                          <SelectItem value="cancelled" className="rounded-md text-sm">
                            Cancelled
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="h-10 flex items-center px-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-2 h-2 rounded-full", statusConfig[formData.status as keyof typeof statusConfig]?.color || "bg-gray-500")} />
                          <span className="font-medium text-sm text-gray-900">
                            {statusConfig[formData.status as keyof typeof statusConfig]?.label || formData.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="transferDate" className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-orange-500" />
                      Transfer Date
                    </Label>
                    <Input
                      id="transferDate"
                      type="date"
                      value={formData.transfer_date || ""}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange("transfer_date", e.target.value)}
                      className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-60"
                    />
                  </motion.div>
                </div>

                {/* Notes - Compact */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="notes" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="w-3 h-3 text-indigo-500" />
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    disabled={!isEditing}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Add transfer notes..."
                    className="min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 disabled:opacity-60 resize-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    />
                  </motion.div>

                {/* Created By */}
                  <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="createdBy" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-3 h-3 text-purple-500" />
                    Created By
                    </Label>
                    <Input
                    id="createdBy"
                    value={formData.created_by || ""}
                    disabled
                    className="h-10 rounded-lg border border-gray-200 bg-gray-50 text-sm disabled:opacity-60"
                    />
                  </motion.div>
              </motion.div>

              {/* Footer Actions - Compact */}
              {isEditing && (
                <motion.div
                  className="flex gap-3 p-5 border-t border-gray-100 bg-gray-50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div className="flex-1">
                    <Button
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg h-10 font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="flex items-center gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          />
                          Saving...
                        </motion.div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </motion.div>
                  <motion.div className="flex-1">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="w-full bg-white border border-gray-300 rounded-lg h-10 font-semibold text-sm hover:bg-gray-50 transition-all duration-300 text-gray-700"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
