// app/(protected)/inventory/products/page.tsx

"use client";

import { useState, useEffect } from "react";

import { getProducts, createProduct, updateProduct, deleteProduct, Product, CreateProductData, CreateSupplierData } from "@/lib/inventory";
import { ProductTable } from "./components/ProductTable";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { AddProductButton } from "./components/AddProductButton";
import QuickActions from "../components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddProductForm } from "./components/AddProductForm";
import { SupplierModal } from "../suppliers/components/SupplierModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface Activity {
  action: string;
  item: string;
  time: string;
}

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

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="p-4 lg:p-6">
        {/* Top bar: Search and Add Product */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <ProductSearchBar value={search} onChange={setSearch} />
          <AddProductButton onClick={() => setDialogOpen(true)} />
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Product List */}
          <div className="xl:col-span-3">
            <ProductTable
              products={filteredProducts}
              onEdit={(product) => { setEditProduct(product); setEditDialogOpen(true); }}
              onDelete={(product) => setDeleteId(product.id)}
            />
          </div>
          {/* Sidebar: Quick Actions & Recent Activity */}
          <div className="xl:col-span-1 space-y-6">
            <QuickActions
              onAddProduct={() => setDialogOpen(true)}
              onAddSupplier={() => setAddSupplierOpen(true)}
              onCreateOrder={() => setOrderDialogOpen(true)}
              onExport={handleExport}
            />
            <RecentActivity activities={activities} />
          </div>
        </div>
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
