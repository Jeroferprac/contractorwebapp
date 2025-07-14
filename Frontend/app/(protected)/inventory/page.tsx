"use client";

import {DashboardLayout} from "@/components/layout/dashboard-layout";
import SummaryCards from "./components/SummaryCards";
import StockReportChart from "./components/StockReportChart";
import SalesOrderTable from "./components/SalesOrderTable";
import FastMovingItems from "./components/FastMovingItems";
import QuickActions from "./components/QuickActions";
import { useSession } from "next-auth/react"
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddProductForm } from "./products/components/AddProductForm";
import { SupplierModal } from "./suppliers/components/SupplierModal";
import { createProduct, createSupplier } from "@/lib/inventory";
import { useToast } from "@/components/ui/use-toast";
import { SaleForm, SaleFormData } from "./sales/components/SaleForm";
import { createSale } from "@/lib/inventory";

export default function InventoryDashboard() {
    const { data: session } = useSession();
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [addSupplierOpen, setAddSupplierOpen] = useState(false);
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderDialogOpen, setOrderDialogOpen] = useState(false);
    const { toast } = useToast();

    async function handleAddProduct(form: any) {
      try {
        await createProduct(form);
        setAddProductOpen(false);
        toast({ title: "Product added", description: `Product '${form.name}' was added successfully.`, variant: "success" });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to add product", variant: "error" });
      }
    }

    async function handleAddSupplier(form: any) {
      try {
        await createSupplier(form);
        setAddSupplierOpen(false);
        toast({ title: "Supplier added", description: `Supplier '${form.name}' was added successfully.`, variant: "success" });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" });
      }
    }

    async function handleCreateOrder(form: SaleFormData) {
      setOrderLoading(true);
      try {
        await createSale(form);
        setOrderDialogOpen(false);
        toast({ title: "Order placed", description: `Order for '${form.customer_name}' was created successfully.`, variant: "success" });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to create order", variant: "error" });
      } finally {
        setOrderLoading(false);
      }
    }

    function handleExport() {
      // Example: Export summary cards as CSV (customize as needed)
      // You may want to export sales/orders if available
      const rows = [
        ["Metric", "Value"],
        ["Total Products", "-"],
        ["Low Stock", "-"],
        ["Total Suppliers", "-"],
      ];
      const csv = rows.map(r => r.map(String).map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory_export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }
    
  return (
    <DashboardLayout session={session} title="Inventory Dashboard">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <SummaryCards />
          <StockReportChart />
          <SalesOrderTable />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <QuickActions
            onAddProduct={() => setAddProductOpen(true)}
            onAddSupplier={() => setAddSupplierOpen(true)}
            onCreateOrder={() => setOrderDialogOpen(true)}
            onExport={handleExport}
          />
          <FastMovingItems />
        </div>
      </div>
      {/* Add Product Dialog */}
      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <AddProductForm
            onSubmit={handleAddProduct}
            onCancel={() => setAddProductOpen(false)}
          />
        </DialogContent>
      </Dialog>
      {/* Add Supplier Dialog */}
      <SupplierModal
        open={addSupplierOpen}
        onClose={() => setAddSupplierOpen(false)}
        onSubmit={handleAddSupplier}
        loading={false}
      />
      {/* Create Order Dialog */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="p-0">
          <DialogHeader>
            <DialogTitle>Create Order</DialogTitle>
          </DialogHeader>
          <SaleForm
            onSubmit={handleCreateOrder}
            onCancel={() => setOrderDialogOpen(false)}
            loading={orderLoading}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
