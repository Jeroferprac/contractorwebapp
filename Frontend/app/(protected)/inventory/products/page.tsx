// app/(protected)/inventory/products/page.tsx

"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct } from "@/lib/inventory";
import { ProductTable, Product } from "./components/ProductTable";
import { ProductSearchBar } from "./components/ProductSearchBar";
import { AddProductButton } from "./components/AddProductButton";
import QuickActions from "../components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddProductForm } from "./components/AddProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
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
      await createProduct(form);
      setDialogOpen(false);
      setLoading(true);
      const updated = await getProducts();
      setProducts(updated);
      toast({ title: "Product added", description: `Product '${form.name}' was added successfully.` });
    } catch (err: any) {
      setAddError(err.message || "Failed to add product");
      toast({ title: "Error", description: err.message || "Failed to add product" });
    } finally {
      setAdding(false);
    }
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

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Product List */}
          <div className="xl:col-span-3">
            <ProductTable products={filteredProducts} />
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
