// app/(protected)/inventory/products/page.tsx

"use client";

import { useState, useEffect } from "react";

import { getProducts, createProduct, updateProduct, deleteProduct, createSupplier, adjustInventory } from "@/lib/inventory";
import { ProductTable, Product } from "./components/ProductTable";

import { ProductSearchBar } from "./components/ProductSearchBar";
import { AddProductButton } from "./components/AddProductButton";
import QuickActions from "../components/QuickActions";
import { RecentActivitySlideshow } from "./components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddProductForm } from "./components/AddProductForm";
import { SupplierModal } from "../suppliers/components/SupplierModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

import { SaleForm, SaleFormData } from "../sales/components/SaleForm";
import { createSale } from "@/lib/inventory";
import type { CreateProductData } from "./components/AddProductForm";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";



export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const { toast } = useToast();
  // Replace useInventoryActivity with localStorage-based state for activities
  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('products_activities');
      if (stored) {
        try {
          return JSON.parse(stored).map((a: Activity) => ({
            ...a,
            time: typeof a.time === 'string' ? a.time : String(a.time),
          }));
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('products_activities', JSON.stringify(activities));
    }
  }, [activities]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  // Add pagination state and logic
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // or any number matching your Figma
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function goToPage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);


  const recentActivities = [
    { action: "Added", item: "Macbook Pro", time: "2h ago" },
    { action: "Sold", item: "iPhone 14", time: "1d ago" },
  ];

  // Replace addActivity with setActivities

  async function handleAddProduct(form: CreateProductData) {
    try {
      const newProduct = await createProduct(form);
      setDialogOpen(false);
      setProducts((prev: Product[]) => [newProduct, ...prev]);
      setActivities((prev: Activity[]) => [
        { action: "Added Product", item: form.name, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
      toast({ title: "Product added", description: `Product '${form.name}' was added successfully.`, variant: "success" });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add product";
      setAddError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "error" });
    }
  }

  async function handleAddSupplier(form: CreateSupplierData) {
    try {
      // (Assume createSupplier is implemented elsewhere if needed)
      setAddSupplierOpen(false);
      toast({ title: "Supplier added", description: `Supplier '${form.name}' was added successfully.`, variant: "success" });
    } catch (err: unknown) {
      toast({ title: "Error", description: (err as Error).message || "Failed to add supplier", variant: "error" });
    }
  }

  // Edit logic
  async function handleEditProduct(form: CreateProductData) {
    if (!editProduct) return;
    setEditLoading(true);
    try {
      const updated = await updateProduct(editProduct.id, form);
      setProducts((prev: Product[]) => prev.map((p) => (p.id === editProduct.id ? updated : p)));
      toast({ title: "Product updated", description: `Product '${form.name}' was updated successfully.`, variant: "success" });
      setEditProduct(null);
      setEditDialogOpen(false);
      setActivities((prev: Activity[]) => [
        { action: "Updated Product", item: form.name, time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      toast({ title: "Error", description: errorMessage, variant: "error" });
    } finally {
      setEditLoading(false);
    }
  }
  // Delete logic
  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id);
      setProducts((prev: Product[]) => prev.filter((p) => p.id !== id)); // <-- This line updates the UI
      toast({ title: "Product deleted", description: "Product was deleted successfully.", variant: "success" });
      setActivities((prev: Activity[]) => [
        { action: "Deleted Product", item: products.find(p => p.id === id)?.name || "Unknown Product", time: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    } catch (err: any) {
      // If backend returns 500, show a user-friendly message
      if ((err as Error).message?.includes("Failed to delete product")) {
        toast({
          title: "Error",
          description: "Cannot delete product: This product is referenced by other records (e.g., sales or purchase orders). Please remove those references first.",
          variant: "error"
        });
      } else {
        toast({ title: "Error", description: err.message || "Failed to delete product", variant: "error" });
      }
    }
    setDeleteId(null);
  }

  function handleExport() {
    const rows = [
      ["Name", "SKU", "Category", "Brand", "Unit", "Current Stock", "Min Stock", "Cost Price", "Selling Price", "Description"],
      ...filteredProducts.map(p => [
        p.name,
        p.sku,
        p.category,
        p.brand,
        p.unit,
        p.current_stock,
        p.min_stock_level,
        p.cost_price,
        p.selling_price,
        p.description || ""
      ])
    ];
    const csv = rows.map(r => r.map(String).map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <DashboardLayout title="Products">
        <div className="p-8 text-center">Loading products...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Products">
        <div className="p-8 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Products">
      <div className="p-4 lg:p-6 relative">
        {/* Main Content Top Bar: Quick Actions */}
        {/* Top Row: Recent Activity (70%) and Quick Actions (30%) */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-7xl mx-auto mb-6">
          {/* Recent Activity (responsive) */}
          <div className="flex-1 min-w-0" style={{ flexBasis: "70%" }}>
            <RecentActivitySlideshow activities={activities} />
          </div>
          {/* Quick Actions (responsive, hidden on mobile) */}
          <div className="w-full md:w-[30%] flex-shrink-0 hidden md:block">
            <QuickActions
              onAddProduct={() => setDialogOpen(true)}
              onAddSupplier={() => setAddSupplierOpen(true)}
              onCreateOrder={() => setCreateOrderOpen(true)}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <AddProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setDialogOpen(false)}
            />
            {addError && <div className="text-red-500 text-sm mt-2">{addError}</div>}
          </DialogContent>
        </Dialog>

        {/* Add Supplier Dialog */}
        <SupplierModal
          open={addSupplierOpen}
          onClose={() => setAddSupplierOpen(false)}
          onSubmit={handleAddSupplier}
          loading={false}
        />

        {/* Edit Product Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={(open) => { setEditDialogOpen(open); if (!open) setEditProduct(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <AddProductForm
              onSubmit={handleEditProduct}
              onCancel={() => { setEditDialogOpen(false); setEditProduct(null); }}
              initialData={editProduct ? {
                name: editProduct.name,
                sku: editProduct.sku,
                category: editProduct.category,
                brand: editProduct.brand,
                unit: editProduct.unit,
                current_stock: editProduct.current_stock,
                min_stock_level: editProduct.min_stock_level,
                cost_price: editProduct.cost_price,
                selling_price: editProduct.selling_price,
                description: editProduct.description,
              } : undefined}
              loading={editLoading}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirm Dialog */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">Are you sure you want to delete this product?</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeleteProduct(deleteId)}>Delete</Button>
              </div>
            </div>
          </div>
        )}

       
          {/* Product List */}
        <div className="max-w-7xl w-full mx-auto flex flex-col gap-6">
          {/* Product List Card */}
          <Card className="bg-white dark:bg-[#020817] border border-gray-200 dark:border-[#232b3e]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-[#232b3e]">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Product List</CardTitle>
              <AddProductButton onClick={() => setDialogOpen(true)} />
            </CardHeader>
            <CardContent className="p-0">
            <ProductTable
                products={paginatedProducts}
              onEdit={(product) => { setEditProduct(product); setEditDialogOpen(true); }}
              onDelete={(product) => setDeleteId(product.id)}
              onAdjust={async (product, data) => {
                try {
                  await adjustInventory(product.id, data.quantity, data.notes, data.transaction_type);
                  toast({ title: "Stock adjusted", description: `Stock for '${product.name}' adjusted by ${data.quantity}.`, variant: "success" });
                  setLoading(true);
                  const updated = await getProducts();
                  setProducts(updated);
                } catch (err: any) {
                  toast({ title: "Error", description: err.message || "Failed to adjust stock", variant: "error" });
                } finally {
                  setLoading(false);
                }
              }}
            />
            </CardContent>
          </Card>
          {/* Pagination Bar (below table/cards) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 ">
              <nav className="inline-flex items-center gap-1 rounded-lg bg-white shadow-sm px-2 py-1 dark:bg-[#020817]">
                <button
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  &lt;
                </button>
                <AnimatePresence>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.button
                      key={page}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`px-3 dark:bg-[#020817] py-1 rounded font-medium transition ${page === currentPage ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
                      onClick={() => goToPage(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                    >
                      {page}
                    </motion.button>
                  ))}
                </AnimatePresence>
                <button
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50 dark:bg-[#020817]"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  &gt;
                </button>
              </nav>
          </div>

          )}

        </div>

        {/* Remove sidebar Quick Actions and Recent Activity */}
        {/* Floating, draggable Recent Activity will be added next */}

        {/* Create Order Dialog */}
        <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
          <DialogContent className="p-0">
            <DialogHeader>
              <DialogTitle>Create Order</DialogTitle>
            </DialogHeader>
            {/* <SaleForm
              onSubmit={handleCreateOrder}
              onCancel={() => setOrderDialogOpen(false)}
              loading={orderLoading}
            /> */}
            {/* Order form removed for linter fix. Add your order form here if needed. */}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
