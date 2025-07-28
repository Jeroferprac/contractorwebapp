"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Package, Loader2 } from "lucide-react"
import { createWarehouseStock } from "@/lib/warehouse"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"

interface AddBinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouses: Warehouse[]
  products: any[]
  onSuccess?: () => void
}

export function AddBinModal({ open, onOpenChange, warehouses, products, onSuccess }: AddBinModalProps) {
  const [formData, setFormData] = useState({
    warehouse_id: "",
    product_id: "",
    bin_location: "",
    quantity: "",
    reserved_quantity: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const stockData = {
        warehouse_id: formData.warehouse_id,
        product_id: formData.product_id,
        bin_location: formData.bin_location,
        quantity: parseFloat(formData.quantity) || 0,
        reserved_quantity: parseFloat(formData.reserved_quantity) || 0,
        notes: formData.notes,
      }

      await createWarehouseStock(stockData)
      
      // Reset form
      setFormData({
        warehouse_id: "",
        product_id: "",
        bin_location: "",
        quantity: "",
        reserved_quantity: "",
        notes: "",
      })
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      console.error("Error creating stock:", err)
      setError("Failed to create stock. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setFormData({
        warehouse_id: "",
        product_id: "",
        bin_location: "",
        quantity: "",
        reserved_quantity: "",
        notes: "",
      })
      setError(null)
    onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Stock Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-4 border-0 bg-white/60 dark:bg-slate-800/60">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Stock Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select
                  value={formData.warehouse_id}
                  onValueChange={(value) => setFormData({ ...formData, warehouse_id: value })}
                  required
                >
                  <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({warehouse.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product">Product *</Label>
                <Select
                  value={formData.product_id}
                  onValueChange={(value) => setFormData({ ...formData, product_id: value })}
                  required
                >
                  <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bin_location">Bin Location</Label>
                <Input
                  id="bin_location"
                  placeholder="e.g., BIN-A12"
                  value={formData.bin_location}
                  onChange={(e) => setFormData({ ...formData, bin_location: e.target.value })}
                  className="bg-white/80 dark:bg-slate-800/80 border-white/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="bg-white/80 dark:bg-slate-800/80 border-white/20"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reserved_quantity">Reserved Quantity</Label>
                <Input
                  id="reserved_quantity"
                  type="number"
                  placeholder="0"
                  value={formData.reserved_quantity}
                  onChange={(e) => setFormData({ ...formData, reserved_quantity: e.target.value })}
                  className="bg-white/80 dark:bg-slate-800/80 border-white/20"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-white/80 dark:bg-slate-800/80 border-white/20"
              />
            </div>
          </Card>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="bg-white/80 dark:bg-slate-800/80 border-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Stock"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
