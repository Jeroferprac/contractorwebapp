"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getProducts } from "@/lib/inventory"

export interface SaleItemForm {
  product_id: string
  quantity: string
  unit_price: string
  line_total?: string
}

export interface SaleFormData {
  customer_name: string
  sale_date: string
  status: string
  notes: string
  items: SaleItemForm[]
  total_amount?: string
}

interface Product {
  id: string
  name: string
  sku: string
}

interface SaleFormProps {
  initialData?: SaleFormData
  onSubmit: (data: SaleFormData) => void
  onCancel: () => void
  loading?: boolean
}

export function SaleForm({ initialData, onSubmit, onCancel, loading }: SaleFormProps) {
  const [form, setForm] = useState<SaleFormData>(
    initialData || {
      customer_name: "",
      sale_date: "",
      status: "completed",
      notes: "",
      items: [{ product_id: "", quantity: "", unit_price: "" }],
    },
  )

  const [submitting, setSubmitting] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)

  useEffect(() => {
    setProductsLoading(true)
    getProducts()
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setProductsError(null)
      })
      .catch(() => setProductsError("Failed to load products"))
      .finally(() => setProductsLoading(false))
  }, [])

  // Calculate line totals and total_amount on the fly
  const itemsWithTotals = form.items.map((item) => {
    const qty = Number.parseFloat(item.quantity) || 0
    const price = Number.parseFloat(item.unit_price) || 0
    return {
      ...item,
      line_total: (qty * price).toFixed(2),
    }
  })

  const totalAmount = itemsWithTotals
    .reduce((sum, item) => sum + Number.parseFloat(item.line_total || "0"), 0)
    .toFixed(2)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleItemChange(idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const items = [...form.items]
    items[idx] = { ...items[idx], [e.target.name]: e.target.value }
    setForm({ ...form, items })
  }

  function addItem() {
    setForm({ ...form, items: [...form.items, { product_id: "", quantity: "", unit_price: "" }] })
  }

  function removeItem(idx: number) {
    const items = form.items.filter((_, i) => i !== idx)
    setForm({ ...form, items })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ ...form, items: itemsWithTotals, total_amount: totalAmount })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 dark:bg-[#020817]/95 backdrop-blur-xl rounded-lg shadow-2xl w-full max-w-lg mx-2 sm:mx-0 sm:w-[500px] max-h-[90vh] flex flex-col border border-white/20 dark:border-white/10 dark:shadow-purple-500/10">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
            {initialData ? "Edit Sale" : "Place Order"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl font-bold focus:outline-none transition-colors"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Customer Name</label>
            <Input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              placeholder="Customer Name"
              required
              disabled={loading}
              className="w-full bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Sale Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Sale Date</label>
            <Input
              name="sale_date"
              type="date"
              value={form.sale_date}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Status</label>
            <Input
              name="status"
              value={form.status}
              onChange={handleChange}
              placeholder="Status"
              required
              disabled={loading}
              className="w-full bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Notes</label>
            <Input
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Notes"
              disabled={loading}
              className="w-full bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Items</span>
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                disabled={loading}
                className="sm:w-auto w-full sm:ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 dark:shadow-purple-500/20"
              >
                Add Item
              </Button>
            </div>

            {productsLoading ? (
              <div className="text-gray-500 dark:text-gray-400">Loading products...</div>
            ) : productsError ? (
              <div className="text-red-500 dark:text-red-400">{productsError}</div>
            ) : (
              <div className="space-y-2">
                {itemsWithTotals.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                    <select
                      name="product_id"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(idx, e)}
                      required
                      disabled={loading}
                      className="col-span-4 border rounded px-2 py-1 min-w-[100px] text-center w-full bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
                    >
                      <option value="">Select Product</option>
                      {products.map((p) => (
                        <option
                          key={p.id}
                          value={p.id}
                          className="bg-white dark:bg-[#020817] text-gray-900 dark:text-white"
                        >
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                    <Input
                      name="quantity"
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) => handleItemChange(idx, e)}
                      placeholder="Qty"
                      required
                      disabled={loading}
                      className="col-span-2 w-full text-center bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
                    />
                    <Input
                      name="unit_price"
                      type="number"
                      value={item.unit_price || ""}
                      onChange={(e) => handleItemChange(idx, e)}
                      placeholder="Unit Price"
                      required
                      disabled={loading}
                      className="col-span-2 w-full text-center bg-white/50 dark:bg-[#020817]/60 text-gray-900 dark:text-white border-gray-300 dark:border-white/20 backdrop-blur-sm"
                    />
                    <Input
                      name="line_total"
                      value={item.line_total}
                      readOnly
                      placeholder="Line Total"
                      className="col-span-3 w-full text-center bg-gray-50/50 dark:bg-[#020817]/30 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 backdrop-blur-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      disabled={form.items.length === 1 || loading}
                      className="col-span-1 flex items-center justify-center text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-lg font-bold focus:outline-none disabled:opacity-50 transition-colors"
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="pt-2 border-t border-gray-200 dark:border-white/10">
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Total Amount</label>
            <Input
              name="total_amount"
              value={totalAmount}
              readOnly
              placeholder="Total Amount"
              className="w-full font-bold text-lg bg-gray-50/50 dark:bg-[#020817]/30 text-gray-900 dark:text-white border-gray-200 dark:border-white/10 backdrop-blur-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4 border-t border-gray-200 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full sm:w-auto bg-white/50 dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/20"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading}
              className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 dark:shadow-purple-500/20"
            >
              {loading ? "Saving..." : submitting ? "Saving..." : initialData ? "Save Changes" : "Add Sale"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
