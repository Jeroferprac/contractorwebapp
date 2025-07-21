"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Product } from "./ProductTable"

interface ProductAdjustModalProps {
  product: Product | null
  onClose: () => void
  onAdjust: (
    product: Product,
    data: { quantity: number; notes: string; transaction_type: "inbound" | "outbound" },
  ) => void
}

export function ProductAdjustModal({ product, onClose, onAdjust }: ProductAdjustModalProps) {
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustNotes, setAdjustNotes] = useState("")
  const [adjustType, setAdjustType] = useState<"inbound" | "outbound">("inbound")
  const [adjustLoading, setAdjustLoading] = useState(false)

  const handleAdjust = async () => {
    if (!product) return
    setAdjustLoading(true)
    await onAdjust(product, { quantity: adjustQty, notes: adjustNotes, transaction_type: adjustType })
    setAdjustLoading(false)
    onClose()
  }

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full max-w-full overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>
        {product && (
          <div className="space-y-4">
            <div className="text-sm text-gray-700">
              Product: <span className="font-medium">{product.name}</span> (SKU: {product.sku})
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Adjustment Quantity</label>
              <Input
                type="number"
                value={adjustQty}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="w-full"
                placeholder="Enter quantity (e.g. -5 or 10)"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Transaction Type</label>
              <select
                className="border rounded-md px-3 h-10 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as "inbound" | "outbound")}
              >
                <option value="inbound">Inbound (Add Stock)</option>
                <option value="outbound">Outbound (Remove Stock)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Reason/Notes</label>
              <Input
                type="text"
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                className="w-full"
                placeholder="Reason for adjustment"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleAdjust} disabled={adjustLoading || adjustQty === 0} className="w-full sm:w-auto">
                {adjustLoading ? <span className="spinner-class" /> : "Adjust"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
