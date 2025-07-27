"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { FormEvent } from "react"

interface ProductFormValues {
  name?: string
  sku?: string
  barcode?: string
  category_name?: string
  brand?: string
  unit?: string
  current_stock?: number
  min_stock_level?: number
  reorder_point?: number
  max_stock_level?: number
  cost_price?: number
  selling_price?: number
  weight?: number
  dimensions?: string
  description?: string
  is_active?: boolean
  is_taxable?: boolean
  track_expiry?: boolean
  track_batch?: boolean
  is_composite?: boolean
}

interface AddProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
  loading?: boolean
  initialData?: ProductFormValues
}

export function AddProductForm({
  onSubmit,
  onCancel,
  loading = false,
  initialData = {},
}: AddProductFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Card className="relative w-full max-w-3xl shadow-2xl rounded-2xl border-0">
        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Add New Product
          </CardTitle>
          <p className="text-gray-500 dark:text-gray-300 text-base">
            Fill in the details below to add a new product to your inventory.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit}>
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {/* Basic Info */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-2">Basic Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "name", label: "Name", required: true },
                  { name: "sku", label: "SKU", required: true },
                  { name: "barcode", label: "Barcode" },
                  { name: "category_name", label: "Category Name" },
                  { name: "brand", label: "Brand" },
                  { name: "unit", label: "Unit" },
                ].map(({ name, label, required }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                      {label}{required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#181f36] text-gray-900 dark:text-white"
                      name={name}
                      required={required}
                      defaultValue={initialData[name as keyof ProductFormValues] ?? ""}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>

              {/* Stock Details */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-8">Stock Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  "current_stock",
                  "min_stock_level",
                  "reorder_point",
                  "max_stock_level",
                  "cost_price",
                  "selling_price",
                  "weight",
                ].map((name) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 capitalize">
                      {name.replace(/_/g, " ")}
                    </label>
                    <input
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#181f36] text-gray-900 dark:text-white"
                      name={name}
                      type="number"
                      min={0}
                      defaultValue={initialData[name as keyof ProductFormValues] ?? 0}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    Dimensions
                  </label>
                  <input
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#181f36] text-gray-900 dark:text-white"
                    name="dimensions"
                    defaultValue={initialData.dimensions ?? ""}
                  />
                </div>
              </div>

              {/* Description */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-8">Description</h3>
              <div>
                <textarea
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-[#181f36] text-gray-900 dark:text-white min-h-[80px]"
                  name="description"
                  defaultValue={initialData.description ?? ""}
                  placeholder="Enter product description"
                />
              </div>

              {/* Boolean Toggles */}
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 mt-8">Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "is_active", label: "Active" },
                  { name: "is_taxable", label: "Taxable" },
                  { name: "track_expiry", label: "Track Expiry" },
                  { name: "track_batch", label: "Track Batch" },
                  { name: "is_composite", label: "Is Composite" },
                ].map(({ name, label }) => (
                  <label
                    key={name}
                    className="flex items-center gap-2 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      name={name}
                      defaultChecked={Boolean(initialData[name as keyof ProductFormValues])}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-gray-300 dark:border-gray-700"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
