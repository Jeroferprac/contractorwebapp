"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"
import { getWarehouses } from "@/lib/warehouse"
import { getProducts } from "@/lib/inventory"
import { createTransfer } from "@/lib/warehouse"
import { useUserStore } from "@/store/userStore"

interface TransferFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  warehouses?: Array<{ id: string; name: string }>
  products?: Array<{ id: string; name: string }>
  onSuccess?: () => void
  editingTransfer?: any // Optional, for edit mode
}

interface TransferItem {
  id: string
  product: string
  quantity: number
}

export function TransferForm({ open, onOpenChange, warehouses: propWarehouses, products: propProducts, onSuccess, editingTransfer }: TransferFormProps) {
  const [warehouses, setWarehouses] = useState<Array<{ id: string; name: string }>>(propWarehouses || [])
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>(propProducts || [])
  const [fromWarehouse, setFromWarehouse] = useState("")
  const [toWarehouse, setToWarehouse] = useState("")
  const [priority, setPriority] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<TransferItem[]>([{ id: "1", product: "", quantity: 0 }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const firstFieldRef = useRef<HTMLButtonElement | null>(null)
  const user = useUserStore((state) => state.user)

  // Fetch warehouses/products if not provided
  useEffect(() => {
    if (!propWarehouses) getWarehouses().then((ws) => setWarehouses(ws))
    if (!propProducts) getProducts().then((ps) => setProducts(ps))
  }, [propWarehouses, propProducts])

  // Pre-fill for edit mode
  useEffect(() => {
    if (editingTransfer) {
      setFromWarehouse(editingTransfer.fromWarehouse || "")
      setToWarehouse(editingTransfer.toWarehouse || "")
      setPriority(editingTransfer.priority || "")
      setNotes(editingTransfer.notes || "")
      setItems(editingTransfer.items || [{ id: "1", product: "", quantity: 0 }])
    } else {
      setFromWarehouse("")
      setToWarehouse("")
      setPriority("")
      setNotes("")
      setItems([{ id: "1", product: "", quantity: 0 }])
    }
  }, [editingTransfer, open])

  // Focus management
  useEffect(() => {
    if (open && firstFieldRef.current) {
      firstFieldRef.current.focus()
    }
  }, [open])

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), product: "", quantity: 0 }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof TransferItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Validation
  const validate = () => {
    if (!fromWarehouse || !toWarehouse || fromWarehouse === toWarehouse) return "Select different source and destination warehouses."
    if (items.length === 0 || items.some((item) => !item.product || !item.quantity || item.quantity <= 0)) return "Add at least one valid item."
    return null
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    try {
      const payload = {
        transfer_number: `TRF-${Date.now()}`,
        from_warehouse_id: fromWarehouse,
        to_warehouse_id: toWarehouse,
        status: "pending",
        notes,
        items: items.map((item) => ({
          product_id: item.product,
          quantity: String(item.quantity),
          id: "",
          received_quantity: "0",
          created_at: new Date().toISOString(),
        })),
        priority,
        created_by: user?.id || ""
      }
      await createTransfer(payload)
      setSuccess(true)
      setLoading(false)
      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError("Failed to create transfer.")
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} aria-label="Transfer Form Modal">
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-modal="true" role="dialog">
        <DialogHeader>
          <DialogTitle>{editingTransfer ? "Edit Transfer" : "Create New Transfer"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit} aria-label="Transfer Form">
          {/* Transfer Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-warehouse">From Warehouse</Label>
              <Select value={fromWarehouse} onValueChange={setFromWarehouse} aria-label="From Warehouse">
                <SelectTrigger ref={firstFieldRef} tabIndex={0} aria-label="From Warehouse">
                  <SelectValue placeholder="Select source warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="to-warehouse">To Warehouse</Label>
              <Select value={toWarehouse} onValueChange={setToWarehouse} aria-label="To Warehouse">
                <SelectTrigger tabIndex={0} aria-label="To Warehouse">
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w) => (
                    <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transfer Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Transfer Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem} aria-label="Add Item">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Select value={item.product} onValueChange={(value) => updateItem(item.id, "product", value)} aria-label="Product">
                          <SelectTrigger tabIndex={0} aria-label="Product">
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-32">
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={item.quantity || ""}
                          onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                          aria-label="Quantity"
                        />
                      </div>
                      {items.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeItem(item.id)} aria-label="Remove Item">
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority} aria-label="Priority">
                <SelectTrigger tabIndex={0} aria-label="Priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Add any additional notes or instructions..." rows={3} value={notes} onChange={e => setNotes(e.target.value)} aria-label="Notes" />
            </div>
          </div>

          {/* Error/Success Feedback */}
          {error && <div className="text-red-500" role="alert">{error}</div>}
          {success && <div className="text-green-600" role="status">Transfer created successfully!</div>}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} aria-label="Cancel">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
              disabled={loading}
              aria-label={editingTransfer ? "Update Transfer" : "Create Transfer"}
            >
              {loading ? "Saving..." : editingTransfer ? "Update Transfer" : "Create Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
