"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import SummaryCards from "./components/SummaryCards"
import StockReportChart from "./components/StockReportChart"
import FastMovingItems from "./components/FastMovingItems"
import QuickActions from "./components/QuickActions"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddProductForm } from "./products/components/AddProductForm"
import { SaleForm, type SaleFormData } from "./sales/components/SaleForm"
import { createProduct, createSale } from "@/lib/inventory"
import { useToast } from "@/components/ui/use-toast"

export default function InventoryDashboard() {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [addProductOpen, setAddProductOpen] = useState(false)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)

  async function handleAddProduct(form: ProductFormData) {
    try {
      await createProduct(form)
      setAddProductOpen(false)
      toast({
        title: "Product added",
        description: `Product '${form.name}' was added successfully.`,
        variant: "success",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add product",
        variant: "error",
      })
    }
  }

  async function handleCreateOrder(form: SaleFormData) {
    setOrderLoading(true)
    try {
      await createSale(form)
      setOrderDialogOpen(false)
      toast({
        title: "Order placed",
        description: `Order for '${form.customer_name}' was created successfully.`,
        variant: "success",
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create order",
        variant: "error",
      })
    } finally {
      setOrderLoading(false)
    }
  }

  function handleExport() {
    const rows = [
      ["Metric", "Value"],
      ["Total Products", "-"],
      ["Low Stock", "-"],
      ["Total Suppliers", "-"],
    ]

    const csv = rows
      .map((r) =>
        r
          .map(String)
          .map((x) => `"${x.replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "inventory_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout session={session} title="Inventory Dashboard">
      <div className="flex flex-col xl:grid xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 flex flex-col space-y-6 w-full">
          <SummaryCards className="mb-6 w-full" />
          <div className="mt-6 xl:mt-40 w-full">
            <StockReportChart />
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col space-y-6 w-full">
          <QuickActions
            onAddProduct={() => setAddProductOpen(true)}
            onCreateOrder={() => setOrderDialogOpen(true)}
            onExport={handleExport}
          />
          <FastMovingItems />
        </div>
      </div>

      <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
        <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-100">Add Product</DialogTitle>
          </DialogHeader>
          <AddProductForm onSubmit={handleAddProduct} onCancel={() => setAddProductOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-slate-900 dark:text-slate-100">Create Order</DialogTitle>
          </DialogHeader>
          <SaleForm onSubmit={handleCreateOrder} onCancel={() => setOrderDialogOpen(false)} loading={orderLoading} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
