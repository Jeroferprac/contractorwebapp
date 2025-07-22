"use client"

import type React from "react"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Zap,
  X,
  Tag,
  BarChart3,
  DollarSign,
  Settings,
  FileText,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface AddProductFormProps {
  onCancel: () => void
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  initialData?: unknown
  loading: boolean
  submitting: boolean
  apiError?: string | null
  apiSuccess?: boolean
  categories: { category: string; count?: number }[]
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
  barcode: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
  current_stock: z.number().optional(),
  min_stock_level: z.number().optional(),
  reorder_point: z.number().optional(),
  max_stock_level: z.number().optional(),
  cost_price: z.number().optional(),
  selling_price: z.number().optional(),
  description: z.string().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  is_active: z.boolean().optional(),
  track_serial: z.boolean().optional(),
  track_batch: z.boolean().optional(),
  is_composite: z.boolean().optional(),
})

export const AddProductForm: React.FC<AddProductFormProps> = ({
  onCancel,
  onSubmit,
  initialData,
  loading,
  submitting,
  apiError,
  apiSuccess,
  categories = [],
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      sku: "",
      barcode: "",
      category: "",
      brand: "",
      unit: "",
      current_stock: 0,
      min_stock_level: 0,
      reorder_point: 0,
      max_stock_level: 0,
      cost_price: 0,
      selling_price: 0,
      description: "",
      weight: 0,
      dimensions: "",
      is_active: false,
      track_serial: false,
      track_batch: false,
      is_composite: false,
    },
    mode: "onChange",
  })

  const isInvalid = !form.formState.isValid

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-1 p-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-2xl">
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 tracking-tight">Add New Product</h2>
        <span className="text-sm text-blue-100/80">Fill in the product details below</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-4 right-4 text-white hover:text-blue-200"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      {/* Form Content Area - visually attached to header */}
      <div className="bg-white dark:bg-[#181c2a] rounded-b-2xl p-4 max-h-[500px] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-10" id="product-form">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-500" /> Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">
                          Product Name{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product name" required className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>This will be the display name for your product.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">
                          SKU{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter SKU" required className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>Stock Keeping Unit (unique product code).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Barcode</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter barcode" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>Optional: Product barcode.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Category</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter category" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>Organize your product by category.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Brand</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter brand name" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>Optional: Specify the product brand.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="unit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Unit of Measure</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., pieces, kg, liters" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>How you measure this product (e.g., pieces, kg).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
              />
            </div>
          </div>
            {/* Subtle divider between sections */}
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          {/* Stock Management Section */}
              <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-500" /> Stock Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                  name="current_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Current Stock</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="min_stock_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Minimum Stock Level</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                  name="reorder_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Reorder Point</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                  name="max_stock_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Maximum Stock Level</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {/* Pricing Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-500" /> Pricing & Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Cost Price</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0.00" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="selling_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">
                          Selling Price{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0.00" required className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Weight</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="e.g., 1.5" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormDescription>Product weight (kg).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Dimensions</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 10x5x3 cm" className="h-9 text-sm px-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
              />
            </div>
          </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {/* Options Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-500" /> Product Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Checkbox
                id="is_active"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        />
                        <div>
                          <label
                            htmlFor="is_active"
                            className="text-base font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                Active Product
              </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Product is available for sale</p>
            </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="track_serial"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Checkbox
                id="track_serial"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <div>
                          <label
                            htmlFor="track_serial"
                            className="text-base font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                Track Serial Numbers
              </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Enable serial number tracking</p>
            </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="track_batch"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Checkbox
                id="track_batch"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <div>
                          <label
                            htmlFor="track_batch"
                            className="text-base font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                Track Batches
              </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Enable batch tracking</p>
            </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_composite"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <Checkbox
                id="is_composite"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                        />
                        <div>
                          <label
                            htmlFor="is_composite"
                            className="text-base font-semibold text-slate-900 dark:text-slate-100 cursor-pointer"
                          >
                Composite Product
              </label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Product made from components</p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
            {/* Description Section */}
          <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" /> Description
              </h3>
              <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold">Product Description</FormLabel>
                        <FormControl>
            <Textarea
                            {...field}
                            placeholder="Enter detailed product description..."
                            className="min-h-[120px] text-base border-2 border-slate-200 dark:border-slate-700 focus:border-slate-500 focus:ring-slate-500/20 bg-white dark:bg-slate-800 rounded-xl shadow-sm transition-all duration-300 resize-none"
                            rows={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
            />
          </div>
            </div>
            {/* Status Messages */}
            {apiError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
                  <p className="text-red-700 dark:text-red-300">{apiError}</p>
                </div>
            </div>
          )}
            {apiSuccess && (
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">Success</h3>
                  <p className="text-green-700 dark:text-green-300">Product added successfully!</p>
                </div>
      </div>
            )}
            {/* Action Buttons */}
            <DialogFooter className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-4 md:gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
                className="px-8 py-3 h-12 text-base font-semibold border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl bg-transparent"
        >
          Cancel
        </Button>
        <Button
          type="submit"
                form="product-form"
          disabled={submitting || isInvalid || loading}
                className="px-8 py-3 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading || submitting ? (
            <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {loading ? "Saving..." : "Adding..."}
            </>
          ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    {initialData ? "Save Changes" : "Add Product"}
                  </>
          )}
        </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </div>
  )
}
