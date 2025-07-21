"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getCategories, createProduct } from "@/lib/inventory"
import type { CreateProductData } from "@/types/inventory"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, BarChart3, Loader2 } from "lucide-react"

interface AddProductFormProps {
  onCancel: () => void
  initialData?: Partial<CreateProductData>
  loading?: boolean
}

export function AddProductForm({ onCancel, initialData, loading }: Omit<AddProductFormProps, "onSubmit">) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    sku: initialData?.sku ?? "",
    category: initialData?.category ?? "",
    brand: initialData?.brand ?? "",
    unit: initialData?.unit ?? "",
    current_stock: initialData?.current_stock !== undefined ? String(initialData.current_stock) : "",
    min_stock_level: initialData?.min_stock_level !== undefined ? String(initialData.min_stock_level) : "",
    reorder_point: initialData?.reorder_point !== undefined ? String(initialData.reorder_point) : "",
    max_stock_level: initialData?.max_stock_level !== undefined ? String(initialData.max_stock_level) : "",
    cost_price: initialData?.cost_price !== undefined ? String(initialData.cost_price) : "",
    selling_price: initialData?.selling_price !== undefined ? String(initialData.selling_price) : "",
    description: initialData?.description ?? "",
    weight: initialData?.weight ?? "",
    dimensions: initialData?.dimensions ?? "",
    is_active: initialData?.is_active ?? true,
    track_serial: initialData?.track_serial ?? false,
    track_batch: initialData?.track_batch ?? false,
    is_composite: initialData?.is_composite ?? false,
  })

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [categories, setCategories] = useState<{ category: string; count?: number }[]>([])

  useEffect(() => {
    getCategories().then((data) => {
      if (Array.isArray(data)) {
        setCategories(data)
      } else if (data?.categories) {
        setCategories(data.categories)
      }
    })
  }, [])

  function validate(currentForm = form) {
    const newErrors: { [key: string]: string } = {}
    if (!currentForm.name.trim()) newErrors.name = "Product name is required"
    if (!currentForm.sku.trim()) newErrors.sku = "SKU is required"
    if (!String(currentForm.selling_price).trim()) newErrors.selling_price = "Selling price is required"
    if (currentForm.selling_price && isNaN(Number(currentForm.selling_price)))
      newErrors.selling_price = "Must be a valid number"
    if (currentForm.current_stock && isNaN(Number(currentForm.current_stock)))
      newErrors.current_stock = "Must be a valid number"
    if (currentForm.min_stock_level && isNaN(Number(currentForm.min_stock_level)))
      newErrors.min_stock_level = "Must be a valid number"
    if (currentForm.reorder_point && isNaN(Number(currentForm.reorder_point)))
      newErrors.reorder_point = "Must be a valid number"
    if (currentForm.max_stock_level && isNaN(Number(currentForm.max_stock_level)))
      newErrors.max_stock_level = "Must be a valid number"
    if (currentForm.cost_price && isNaN(Number(currentForm.cost_price))) newErrors.cost_price = "Must be a valid number"
    return newErrors
  }

  useEffect(() => {
    setErrors(validate())
  }, [form])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleCheckbox = (name: string, checked: boolean) => {
    setForm({ ...form, [name]: checked })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setApiError(null)

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setSubmitting(true)
    try {
      const payload: CreateProductData = {
        name: form.name,
        sku: form.sku,
        category: form.category || undefined,
        brand: form.brand || undefined,
        unit: form.unit || undefined,
        current_stock: form.current_stock !== "" ? Number(form.current_stock) : 0,
        min_stock_level: form.min_stock_level !== "" ? Number(form.min_stock_level) : 0,
        reorder_point: form.reorder_point !== "" ? Number(form.reorder_point) : 0,
        max_stock_level: form.max_stock_level !== "" ? Number(form.max_stock_level) : 0,
        cost_price: form.cost_price !== "" ? Number(form.cost_price) : 0,
        selling_price: form.selling_price !== "" ? Number(form.selling_price) : 0,
        description: form.description || undefined,
        weight: form.weight || undefined,
        dimensions: form.dimensions || undefined,
        is_active: form.is_active,
        track_serial: form.track_serial,
        track_batch: form.track_batch,
        is_composite: form.is_composite,
      }

      await createProduct(payload)
      onCancel()
    } catch {
      setApiError("Failed to add product. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const isInvalid = Object.keys(errors).length > 0

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Modal Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.name && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SKU <span className="text-red-500">*</span>
              </label>
              <Input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.sku ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.sku && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.sku}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value })}>
                <SelectTrigger className="h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  {categories.map((catObj) => (
                    <SelectItem
                      key={catObj.category}
                      value={catObj.category}
                      className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {catObj.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Brand</label>
              <Input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Enter brand name"
                className="h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit of Measure</label>
              <Input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="e.g., pieces, kg, liters"
                className="h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stock Management Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stock Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inventory levels and thresholds</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Stock</label>
                <Input
                  name="current_stock"
                  type="number"
                  value={form.current_stock}
                  onChange={handleChange}
                  placeholder="0"
                  className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.current_stock ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.current_stock && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.current_stock}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Stock Level
                </label>
                <Input
                  name="min_stock_level"
                  type="number"
                  value={form.min_stock_level}
                  onChange={handleChange}
                  placeholder="0"
                  className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.min_stock_level ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {errors.min_stock_level && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.min_stock_level}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Reorder Point</label>
                <Input
                  name="reorder_point"
                  type="number"
                  value={form.reorder_point}
                  onChange={handleChange}
                  placeholder="0"
                  className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.reorder_point ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Stock Level
                </label>
                <Input
                  name="max_stock_level"
                  type="number"
                  value={form.max_stock_level}
                  onChange={handleChange}
                  placeholder="0"
                  className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                    errors.max_stock_level ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cost Price</label>
              <Input
                name="cost_price"
                type="number"
                step="0.01"
                value={form.cost_price}
                onChange={handleChange}
                placeholder="0.00"
                className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.cost_price ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <Input
                name="selling_price"
                type="number"
                step="0.01"
                value={form.selling_price}
                onChange={handleChange}
                placeholder="0.00"
                className={`h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 ${
                  errors.selling_price ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.selling_price && (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.selling_price}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight</label>
              <Input
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g., 1.5 kg"
                className="h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dimensions</label>
              <Input
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder="e.g., 10x5x3 cm"
                className="h-11 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => handleCheckbox("is_active", !!checked)}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Active Product
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="track_serial"
                checked={form.track_serial}
                onCheckedChange={(checked) => handleCheckbox("track_serial", !!checked)}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="track_serial" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Track Serial Numbers
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="track_batch"
                checked={form.track_batch}
                onCheckedChange={(checked) => handleCheckbox("track_batch", !!checked)}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="track_batch" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Track Batches
              </label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="is_composite"
                checked={form.is_composite}
                onCheckedChange={(checked) => handleCheckbox("is_composite", !!checked)}
                className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="is_composite" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Composite Product
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              className="min-h-[100px] border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* Error Message */}
          {apiError && (
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 text-sm p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5" />
              {apiError}
            </div>
          )}
        </form>
      </div>

      {/* Modal Footer */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6 py-2 h-11 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || isInvalid || loading}
          className="px-6 py-2 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
        >
          {loading || submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {loading ? "Saving..." : "Adding..."}
            </>
          ) : initialData ? (
            "Save Changes"
          ) : (
            "Add Product"
          )}
        </Button>
      </div>
    </div>
  )
}
