"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { createProduct } from "@/lib/inventory" // Your custom API handler
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  barcode: z.string().optional(),
  category_name: z.string().min(1),
  brand: z.string().optional(),
  unit: z.string().min(1),
  current_stock: z.coerce.number().nonnegative(),
  min_stock_level: z.coerce.number().nonnegative(),
  reorder_point: z.coerce.number().nonnegative(),
  max_stock_level: z.coerce.number().nonnegative(),
  cost_price: z.coerce.number().nonnegative(),
  selling_price: z.coerce.number().nonnegative(),
  description: z.string().optional(),
  weight: z.string().optional(), // <-- changed to string
  dimensions: z.string().optional(),
  is_active: z.boolean().default(true),
  track_serial: z.boolean().default(false),
  track_batch: z.boolean().default(false),
  is_composite: z.boolean().default(false),
})

export function AddProductForm({ onSubmit: onSubmitProp, onCancel, loading: loadingProp }: {
  onSubmit?: (values: z.infer<typeof formSchema>) => Promise<void> | void,
  onCancel?: () => void,
  loading?: boolean
}) {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sku: "",
      barcode: "",
      category_name: "",
      brand: "",
      unit: "",
      current_stock: 0,
      min_stock_level: 0,
      reorder_point: 0,
      max_stock_level: 0,
      cost_price: 0,
      selling_price: 0,
      description: "",
      weight: "",
      dimensions: "",
      is_active: true,
      track_serial: false,
      track_batch: false,
      is_composite: false,
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      if (onSubmitProp) {
        await onSubmitProp(values)
      } else {
        await createProduct(values)
        form.reset()
        alert("Product added successfully")
      }
    } catch (err) {
      console.error(err)
      alert("Error adding product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 shadow-2xl rounded-2xl max-w-5xl mx-auto bg-background border h-[80vh] flex flex-col">
      <h2 className="text-2xl font-semibold mb-4 text-primary">Add New Product</h2>
      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Grid: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "sku", "barcode", "category_name", "brand", "unit"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name.replace(/_/g, " ")}</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={field.name} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Grid: Inventory & Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                "current_stock",
                "min_stock_level",
                "reorder_point",
                "max_stock_level",
                "cost_price",
                "selling_price",
                "weight",
                "dimensions",
              ].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{field.name.replace(/_/g, " ")}</FormLabel>
                      <FormControl>
                        <Input
                          type={
                            fieldName === "weight" || fieldName === "dimensions"
                              ? "text"
                              : "number"
                          }
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder="Optional product description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {["is_active", "track_serial", "track_batch", "is_composite"].map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof z.infer<typeof formSchema>}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
                      <FormLabel className="capitalize">{fieldName.replace(/_/g, " ")}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* Submit & Cancel */}
            <div className="flex gap-2">
              <Button type="submit" disabled={loadingProp ?? loading} className="w-full md:w-auto">
                {(loadingProp ?? loading) ? "Saving..." : "Add Product"}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </Card>
  )
}
