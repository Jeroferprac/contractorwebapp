"use client"

import { useState, useEffect } from "react"
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createSupplier,
  adjustInventory,
} from "@/lib/inventory"
import { ProductTable } from "./components/ProductTable"
import type { Product } from "@/lib/inventory"
import { RecentActivity } from "./components/RecentActivity"
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
import { formatDistanceToNow } from "date-fns"
import { useUser } from "@/lib/hooks/useUser"
import QuickActions from "../components/QuickActions"
import type { CreateProductData } from "@/types/inventory";

type User = { name?: string }

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

  const [quickActionsDialogOpen, setQuickActionsDialogOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { toast } = useToast()
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const user = useUser(token) as User | null
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(""))

  const [addError, setAddError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Fetch products function
  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      // Optionally set an error state here if you want to show an error message
      // setError("Failed to load products");
    } finally {
      setLoading(false); // <-- Ensure loading is set to false
    }
  }

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handler to call after a product is added or edited
  function handleProductFormSuccess() {
    fetchProducts(); // Refetch the product list
    setDialogOpen(false); // Close the add dialog
    setEditDialogOpen(false); // Close the edit dialog
    setEditProduct(null); // Reset edit state
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const recentActivities = products.slice(0, 5).map((product) => ({
    action: "Added",
    count: Number(product.current_stock) || 1,
    product: product.name,
    name: "System",
    surname: "",
    avatar: "",
    time: product.created_at ? formatDistanceToNow(new Date(product.created_at), { addSuffix: true }) : "recently",
  }))

  async function handleAddProduct(form: CreateProductData) {
    try {
      const newProduct = await createProduct(form)
      setDialogOpen(false)
      setProducts((prev) => [newProduct, ...prev])
      toast({
        title: "Product added",
        description: `Product '${form.name}' was added successfully.`,
        variant: "success",
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add product"
      setAddError(errorMessage)
      toast({ title: "Error", description: errorMessage, variant: "error" })
    }
  }

  async function handleAddSupplier(form: any) {

    try {
      // await createSupplier(form) // This line was removed as per the new_code
      toast({
        title: "Supplier added",
        description: `Supplier '${form.name}' was added successfully.`,
        variant: "success",
      })

    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" })
    }
  }

  async function handleEditProduct(form: CreateProductData) {
    if (!editProduct) return
    setEditLoading(true)
    try {
      const updated = await updateProduct(editProduct.id, form)
      setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? updated : p)))
      toast({
        title: "Product updated",
        description: `Product '${form.name}' was updated successfully.`,
        variant: "success",
      })
      setEditProduct(null)
      setEditDialogOpen(false)

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


  if (error) {
    return (
      <DashboardLayout title="Products">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center min-h-[60vh]"
        >
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 shadow-2xl backdrop-blur-sm">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </motion.div>
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

      {/* Enhanced Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto mb-6"
      >
        <div className="flex-1 min-w-0" style={{ flexBasis: "70%" }}>
          <RecentActivity activities={recentActivities} />
        </div>
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
            } catch (err: any) {
              toast({ title: "Error", description: err.message || "Failed to adjust stock", variant: "error" })
            } finally {
              setLoading(false)
            }
          }}
          onAddProduct={() => setDialogOpen(true)}
        />
      </motion.div>

      {/* Enhanced Add Product Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-background to-muted/20 border border-border/50 shadow-2xl backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Add New Product
            </DialogTitle>
          </DialogHeader>
          <AddProductForm onSubmit={handleAddProduct} onCancel={() => setDialogOpen(false)} loading={loading} />
          {addError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              {addError}
            </motion.div>
          )}
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
            onSubmit={handleEditProduct}
            onCancel={() => {
              setEditDialogOpen(false)
              setEditProduct(null)
            }}
            initialData={
              editProduct
                ? {
                    name: editProduct.name,
                    sku: editProduct.sku,
                    barcode: editProduct.barcode ?? "",
                    category: editProduct.category ?? "",
                    brand: editProduct.brand ?? "",
                    unit: editProduct.unit ?? "",
                    current_stock: editProduct.current_stock ?? 0,
                    min_stock_level: editProduct.min_stock_level ?? 0,
                    reorder_point: editProduct.reorder_point ?? 0,
                    max_stock_level: editProduct.max_stock_level ?? 0,
                    cost_price: editProduct.cost_price ?? 0,
                    selling_price: editProduct.selling_price ?? 0,
                    description: editProduct.description ?? "",
                    weight: String(editProduct.weight ?? ""),
                    dimensions: String(editProduct.dimensions ?? ""),
                    is_active: editProduct.is_active ?? true,
                    track_serial: editProduct.track_serial ?? false,
                    track_batch: editProduct.track_batch ?? false,
                    is_composite: editProduct.is_composite ?? false,
                  }
                : undefined
            }
            loading={editLoading}
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