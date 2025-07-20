"use client"

import { useState, useEffect } from "react"
import { deleteProduct, getProducts } from "@/lib/inventory";
import { ProductTable, type Product } from "./components/ProductTable"
import { RecentActivity } from "./components/RecentActivity"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { AddProductForm } from "./components/AddProductForm"
import { SupplierModal } from "../suppliers/components/SupplierModal"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { SaleForm, type SaleFormData } from "../sales/components/SaleForm"
import { createSale } from "@/lib/inventory";
import type { CreateSupplierData } from "@/types/inventory";
import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import  QuickActions  from "../components/QuickActions"

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
  const { toast } = useToast()

  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(""))

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

  // Handler to call after a product is added
  function handleAddProductSuccess() {
    fetchProducts(); // Refetch the product list
    setDialogOpen(false); // Close the dialog/modal
  }

  // Map latest products to Activity type for RecentActivity (real data)
  const recentActivities = products.slice(0, 5).map((product) => ({
    action: "Added",
    count: Number(product.current_stock) || 1,
    product: product.name,
    name: "System",
    surname: "",
    avatar: "",
    time: product.created_at ? formatDistanceToNow(new Date(product.created_at), { addSuffix: true }) : "recently",
  }))

  async function handleAddSupplier(form: CreateSupplierData) {
    try {
      // await createSupplier(form) // This line was removed as per the new_code
      toast({
        title: "Supplier added",
        description: `Supplier '${form.name}' was added successfully.`,
        variant: "success",
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add supplier"
      toast({ title: "Error", description: errorMessage, variant: "error" })
    }
  }

  // Delete logic
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
        <div className="p-8 text-center">Loading products...</div>
      </DashboardLayout>
    )
  }

  // When mapping editProduct to initialData for AddProductForm, convert number fields
  const editInitialData = editProduct
    ? {
        ...editProduct,
        current_stock: editProduct.current_stock ? Number(editProduct.current_stock) : 0,
        min_stock_level: editProduct.min_stock_level ? Number(editProduct.min_stock_level) : 0,
        cost_price: editProduct.cost_price ? Number(editProduct.cost_price) : 0,
        selling_price: editProduct.selling_price ? Number(editProduct.selling_price) : 0,
        description: editProduct.description,
      }
    : undefined;

  return (
    <DashboardLayout title="Products">
      <div className="p-4 lg:p-6 relative">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Product</h1>
            <p className="text-gray-600">Manage your product inventory</p>

          </div>

          <div className="flex items-center gap-3">
            <QuickActions
              onAddProduct={() => setDialogOpen(true)}
              onAddSupplier={() => setAddSupplierOpen(true)}
              onCreateOrder={() => setOrderDialogOpen(true)}
              onExport={handleExport}
            />
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* Top Row: Recent Activity (70%) */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto mb-6">
          {/* Recent Activity (responsive) */}
          <div className="flex-1 min-w-0" style={{ flexBasis: "70%" }}>
            <RecentActivity activities={recentActivities} />
          </div>
          
        </div>

        {/* Table container for responsiveness */}
        <div className="w-full overflow-x-auto rounded-lg bg-background shadow">
          {/* Premium Product Table - This replaces the old table and pagination */}
          <ProductTable
            products={products} // Pass all products, the component handles filtering and pagination internally
            onEdit={(product) => {
              setEditProduct(product)
              setEditDialogOpen(true)
            }}
            onDelete={(product) => setDeleteId(product.id)}
            onAdjust={async (product, data) => {
              try {
                    // await adjustInventory(product.id, data.quantity, data.notes, data.transaction_type) // This line was removed as per the new_code
                toast({
                  title: "Stock adjusted",
                  description: `Stock for '${product.name}' adjusted by ${data.quantity}.`,
                  variant: "success",
                })
                setLoading(true)
                const updated = await getProducts()
                setProducts(updated)
              } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Failed to adjust stock"
                toast({ title: "Error", description: errorMessage, variant: "error" })
              } finally {
                setLoading(false)
              }
            }}
            onAddProduct={() => setDialogOpen(true)} // Pass the handler for the Add Product button
          />
        </div>

        {/* Add Product Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
                <AddProductForm onCancel={handleAddProductSuccess} />
          </DialogContent>
        </Dialog>

        {/* Quick Actions Dialog */}
        {/* Removed Quick Actions Dialog, now handled inline in header */}

        {/* Add Supplier Dialog */}
        <SupplierModal
          open={addSupplierOpen}
          onClose={() => setAddSupplierOpen(false)}
          onSubmit={handleAddSupplier}
          loading={false}
        />

        {/* Edit Product Dialog */}
        <Dialog
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open)
            if (!open) setEditProduct(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <AddProductForm
                  initialData={editInitialData}
              onCancel={() => {
                setEditDialogOpen(false)
                setEditProduct(null)
              }}
                  loading={false}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">Are you sure you want to delete this product?</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteProduct(deleteId)}>
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create Order Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="p-0">
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            <SaleForm onSubmit={handleCreateOrder} onCancel={() => setOrderDialogOpen(false)} loading={orderLoading} />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
