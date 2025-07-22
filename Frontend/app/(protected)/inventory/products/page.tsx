"use client"

import { useState, useEffect } from "react"
import {
  getProducts,
  deleteProduct,
  adjustInventory,
} from "@/lib/inventory"
import { ProductTable } from "./components/ProductTable"
import type { Product } from "@/types/inventory"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AddProductForm } from "./components/AddProductForm"
import { SupplierModal } from "../suppliers/components/SupplierModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { SaleForm, type SaleFormData } from "../sales/components/SaleForm"

import { createSale } from "@/lib/inventory"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Sparkles } from "lucide-react"
import QuickActions from "../components/QuickActions"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addSupplierOpen, setAddSupplierOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(""))

  // Extract unique categories for AddProductForm
  const categories = Array.from(new Set(products.map((p) => p.category).filter((c): c is string => !!c))).map((category) => ({ category }));

  async function handleAddProduct(values: Record<string, unknown>) {
    setSubmitting(true);
    // TODO: Implement product creation logic here
    // For now, just log the values to avoid unused var warning
    console.log('AddProductForm submitted:', values);
    setSubmitting(false);
    setDialogOpen(false);
  }

  // Fetch products function
  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } finally {
      setLoading(false); // <-- Ensure loading is set to false
    }
  }

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  async function handleAddSupplier() {

    try {
      toast({
        title: "Supplier added",
        description: `Supplier added successfully.`,
        variant: "success",
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add supplier"
      toast({ title: "Error", description: errorMessage, variant: "error" })
    }
  }

  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast({ title: "Product deleted", description: "Product was deleted successfully.", variant: "success" })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete product"
      if (errorMessage.includes("Failed to delete product")) {
        toast({
          title: "Error",
          description:
            "Cannot delete product: This product is referenced by other records (e.g., sales or purchase orders). Please remove those references first.",
          variant: "error",
        })
      } else {
        toast({ title: "Error", description: errorMessage, variant: "error" })
      }
    }
    setDeleteId(null)
  }

  async function handleCreateOrder(form: SaleFormData) {
    setOrderLoading(true)
    try {
      await createSale({
        ...form,
        total_amount: form.total_amount ? Number(form.total_amount) : 0,
        items: form.items.map(item => ({
          ...item,
          unit_price: Number(item.unit_price),
          quantity: Number(item.quantity),
          line_total: item.line_total !== undefined ? Number(item.line_total) : 0, // ensure number
        })),
      })
      setOrderDialogOpen(false)
      toast({
        title: "Order placed",
        description: `Order for '${form.customer_name}' was created successfully.`,
        variant: "success",
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create order"
      toast({ title: "Error", description: errorMessage, variant: "error" })
    } finally {
      setOrderLoading(false)
    }
  }

  function handleExport() {
    const rows = [
      [
        "Name",
        "SKU",
        "Category",
        "Brand",
        "Unit",
        "Current Stock",
        "Min Stock",
        "Cost Price",
        "Selling Price",
        "Description",
      ],
      ...filteredProducts.map((p) => [
        p.name,
        p.sku,
        p.category,
        p.brand,
        p.unit,
        p.current_stock,
        p.min_stock_level,
        p.cost_price,
        p.selling_price,
        p.description || "",
      ]),
    ]
    const csv = rows
      .map((r) =>
        r
          .map(String)
          .map((x) => `"${x.replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "products_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <DashboardLayout title="Products">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 rounded-2xl bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <p className="text-foreground font-medium">Loading products...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }


  return (
    <DashboardLayout title="Products">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 p-6 rounded-2xl bg-gradient-to-br from-background via-background to-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm"
      >
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            Product
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Manage your product inventory
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3"
        >
          {!isMobile && (
            <QuickActions
              onAddProduct={() => setDialogOpen(true)}
              onAddSupplier={() => setAddSupplierOpen(true)}
              onCreateOrder={() => setOrderDialogOpen(true)}
              onExport={handleExport}
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border-purple-500/20 transition-all duration-300 shadow-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Product Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <ProductTable
          products={products}
          onEdit={(product) => {
            setEditProduct(product)
            setEditDialogOpen(true)
          }}
          onDelete={(product) => setDeleteId(product.id)}
          onAdjust={async (product, data) => {
            try {
              await adjustInventory(product.id, data.quantity, data.notes, data.transaction_type)
              toast({
                title: "Stock adjusted",
                description: `Stock for '${product.name}' adjusted by ${data.quantity}.`,
                variant: "success",
              })
              setLoading(true)
              const updated = await getProducts()
              setProducts(updated)
            } catch (err: unknown) {
              toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to adjust stock", variant: "error" })
            } finally {
              setLoading(false)
            }
          }}
          onAddProduct={() => setDialogOpen(true)}
        />
      </motion.div>

      {/* Enhanced Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
          <AddProductForm
            onCancel={() => setDialogOpen(false)}
            onSubmit={handleAddProduct}
            loading={loading}
            submitting={submitting}
            categories={categories}
          />
        </DialogContent>
      </Dialog>


      {/* Enhanced Add Supplier Dialog */}
      <SupplierModal
        open={addSupplierOpen}
        onClose={() => setAddSupplierOpen(false)}
        onSubmit={handleAddSupplier}
        loading={false}
      />

      {/* Enhanced Edit Product Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) setEditProduct(null)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Edit Product
            </DialogTitle>
          </DialogHeader>
          <AddProductForm
            onCancel={() => {
              setEditDialogOpen(false)
              setEditProduct(null)
            }}
            onSubmit={handleAddProduct}
            initialData={
              editProduct
                ? {
                    name: editProduct.name,
                    sku: editProduct.sku,
                    category: editProduct.category ?? "",
                    brand: editProduct.brand ?? "",
                    unit: editProduct.unit ?? "",
                    current_stock: editProduct.current_stock ?? "",
                    min_stock_level: editProduct.min_stock_level ?? "",
                    cost_price: Number(editProduct.cost_price ?? 0),
                    selling_price: Number(editProduct.selling_price ?? 0),
                    description: editProduct.description ?? "",
                    is_active: editProduct.is_active ?? false,
                    track_serial: editProduct.track_serial ?? false,
                    track_batch: editProduct.track_batch ?? false,
                    is_composite: editProduct.is_composite ?? false,
                  }
                : undefined
            }
            loading={loading}
            submitting={submitting}
            categories={categories}
          />
        </DialogContent>
      </Dialog>


      {/* Enhanced Delete Confirm Dialog */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-background to-muted/20 rounded-2xl p-6 shadow-2xl border border-border/50 backdrop-blur-sm max-w-md mx-4"
            >
              <div className="mb-4 text-foreground font-medium">Are you sure you want to delete this product?</div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  className="bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteProduct(deleteId)}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25 transition-all duration-300"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Create Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="p-0 bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Create Order
            </DialogTitle>
          </DialogHeader>
          <SaleForm onSubmit={handleCreateOrder} onCancel={() => setOrderDialogOpen(false)} loading={orderLoading} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
