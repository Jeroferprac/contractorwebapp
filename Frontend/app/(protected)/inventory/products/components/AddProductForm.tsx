"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  DollarSign,
  FileText,
  Loader2,
  Settings,
  Tag,
  X,
  Zap,
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
  category: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
  current_stock: z.number().optional(),
  min_stock_level: z.number().optional(),
  reorder_point: z.number().optional(),
  max_stock_level: z.number().optional(),
  cost_price: z.number().optional(),
  selling_price: z.number().optional(),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  is_active: z.boolean().optional(),
  track_serial: z.boolean().optional(),
  track_batch: z.boolean().optional(),
  is_composite: z.boolean().optional(),
  description: z.string().optional(),
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
      category: "",
      brand: "",
      unit: "",
      current_stock: 0,
      min_stock_level: 0,
      reorder_point: 0,
      max_stock_level: 0,
      cost_price: 0,
      selling_price: 0,
      weight: "",
      dimensions: "",
      is_active: false,
      track_serial: false,
      track_batch: false,
      is_composite: false,
      description: "",
    },
    mode: "onChange",
  })

  const isInvalid = !form.formState.isValid

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    await onSubmit(values)
  }

  return (
    <div className="rounded-2xl shadow-2xl bg-white dark:bg-[#181c2a] border border-slate-200 dark:border-slate-800 p-0 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Add New Product</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8" id="product-form">
            {/* Basic Information Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
            <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Basic Information</h2>
                    <p className="text-slate-600 dark:text-slate-400">Essential product details</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product Name{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter product name" required />
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
                        <FormLabel>
                          SKU{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter SKU" required />
                        </FormControl>
                        <FormDescription>Stock Keeping Unit (unique product code).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="h-12 text-base border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl">
                            {categories.map((catObj: { category: string; count?: number }) => (
                    <SelectItem
                      key={catObj.category}
                      value={catObj.category}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {catObj.category}
                                {typeof catObj.count === "number" && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {catObj.count}
                                  </Badge>
                                )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter brand name" />
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
                        <FormLabel>Unit of Measure</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., pieces, kg, liters" />
                        </FormControl>
                        <FormDescription>How you measure this product (e.g., pieces, kg).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
              />
            </div>
              </CardContent>
            </Card>
          {/* Stock Management Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
              <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Stock Management</h2>
                    <p className="text-slate-600 dark:text-slate-400">Inventory levels and thresholds</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="current_stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stock</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" />
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
                        <FormLabel>Minimum Stock Level</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" />
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
                        <FormLabel>Reorder Point</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" />
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
                        <FormLabel>Maximum Stock Level</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" placeholder="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                />
              </div>
              </CardContent>
            </Card>
            {/* Pricing Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
          </div>
            <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pricing & Specifications</h2>
                    <p className="text-slate-600 dark:text-slate-400">Cost and selling prices</p>
            </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cost_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost Price</FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0.00" />
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
                        <FormLabel>
                          Selling Price{" "}
                          <Badge variant="destructive" className="ml-2 text-xs">
                            Required
                          </Badge>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="number" step="0.01" placeholder="0.00" required />
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
                        <FormLabel>Weight</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1.5 kg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 10x5x3 cm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
              />
            </div>
              </CardContent>
            </Card>
            {/* Options Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
            <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Options</h2>
                    <p className="text-slate-600 dark:text-slate-400">Configure tracking and status</p>
            </div>
          </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              </CardContent>
            </Card>
            {/* Description Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Description</h2>
                    <p className="text-slate-600 dark:text-slate-400">Additional product information</p>
            </div>
          </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Description</FormLabel>
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
              </CardContent>
            </Card>
            {/* Status Messages */}
          {apiError && (
              <Card className="border-0 shadow-xl bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <div>
                      <h3 className="font-semibold text-red-900 dark:text-red-100">Error</h3>
                      <p className="text-red-700 dark:text-red-300">{apiError}</p>
                    </div>
            </div>
                </CardContent>
              </Card>
            )}
            {apiSuccess && (
              <Card className="border-0 shadow-xl bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-100">Success</h3>
                      <p className="text-green-700 dark:text-green-300">Product added successfully!</p>
                    </div>
      </div>
                </CardContent>
              </Card>
            )}
            {/* Action Buttons */}
            <DialogFooter className="pt-8 border-t border-slate-200 dark:border-slate-700">
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
