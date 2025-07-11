// app/(protected)/inventory/products/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/inventory";
import { ProductTable, Product } from "./components/ProductTable";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { AddProductButton } from "./components/AddProductButton";
import QuickActions from "../components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddProductForm } from "./components/AddProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const recentActivities = [
    { action: "Added", item: "Macbook Pro", time: "2h ago" },
    { action: "Sold", item: "iPhone 14", time: "1d ago" },
  ];

  async function handleAddProduct(form: any) {
    setAdding(true);
    setAddError(null);
    try {
      const newProduct = await createProduct(form);
      setDialogOpen(false);
      // Optimistically add the new product to the top of the list
      setProducts(prev => [newProduct, ...prev]);
      toast({ title: "Product added", description: `Product '${form.name}' was added successfully.`, variant: "success" });
    } catch (err: any) {
      setAddError(err.message || "Failed to add product");
      toast({ title: "Error", description: err.message || "Failed to add product", variant: "error" });
    } finally {
      setAdding(false);
    }
  }

  // Edit logic
  async function handleEditProduct(form: any) {
    if (!editProduct) return;
    setEditLoading(true);
    try {
      const updated = await updateProduct(editProduct.id, form);
      setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? updated : p)));
      toast({ title: "Product updated", description: `Product '${form.name}' was updated successfully.`, variant: "success" });
      setEditProduct(null);
      setEditDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update product", variant: "error" });
    } finally {
      setEditLoading(false);
    }
  }
  // Delete logic
  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Product deleted", description: "Product was deleted successfully.", variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to delete product", variant: "error" });
    }
    setDeleteId(null);
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
            <QuickActions />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
