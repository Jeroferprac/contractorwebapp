"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCards } from "./components/SalesMetrixCard"
import { ProfessionalAreaChart } from "./components/SalesCharts"
import { SalesReportPieChart } from "./components/SalesReportChart"
import { SalesOrderTable } from "./components/SalesOrderTable"
import { SalesSearchBar } from "./components/SalesSearchBar"
import { PlaceOrderButton } from "./components/PlaceOrderButton"
import QuickActions from "../components/QuickActions"
import { RecentActivity } from "../products/components/RecentActivity"
import {
  Dialog as UIDialog,
  DialogContent as UIDialogContent,
  DialogHeader as UIDialogHeader,
  DialogTitle as UIDialogTitle,
} from "@/components/ui/dialog"
import { ProfessionalHeader } from "./components/SalesHeader"
import { AddProductForm } from "../products/components/AddProductForm"
import { SaleForm, type SaleFormData } from "./components/SaleForm"
import { SupplierModal, type SupplierFormData } from "../suppliers/components/SupplierModal"
import { Button } from "@/components/ui/button"
import { createProduct, getSales, createSale, updateSale, createSupplier } from "@/lib/inventory"
import { useToast } from "@/components/ui/use-toast"
import { parseISO, format, isValid } from "date-fns"
import { useSession } from "next-auth/react";
import { useUserProfileStore } from "@/store/userProfileStore";

// Activity type for recent activity tracking
type Activity = {
  action: string
  count: number
  product: string
  name: string
  surname: string
  avatar: string
  time: string
}

export default function SalesPage() {
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addSaleOpen, setAddSaleOpen] = useState(false)
  const [editSaleOpen, setEditSaleOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<any | null>(null)
  const [rawSales, setRawSales] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartLoading, setChartLoading] = useState(true)
  const [chartError, setChartError] = useState<string | null>(null)
  const [addSupplierOpen, setAddSupplierOpen] = useState(false)
  const [addSupplierLoading, setAddSupplierLoading] = useState(false)
  const [viewSaleOpen, setViewSaleOpen] = useState(false)
  const [viewedSale, setViewedSale] = useState<any | null>(null)

  // Scroll animations
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 300], [0, -20])

  const { toast } = useToast()

  const { data: session } = useSession();
  const userProfile = useUserProfileStore((state) => state.userProfile);
  const fetchUserProfile = useUserProfileStore((state) => state.fetchUserProfile);

  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile();
    }
  }, [userProfile, fetchUserProfile]);

  // Extract username and role
  const username = userProfile?.name || session?.user?.name || session?.user?.email || "User";
  const role = userProfile?.role || "user";
  const displayName = `${username} (${role.charAt(0).toUpperCase() + role.slice(1)})`;

  // Chart data processing
  const chartData = useMemo(() => {
    if (!rawSales || !Array.isArray(rawSales)) return []

    const salesByDay: Record<string, { sales: number; revenue: number }> = {}

    for (const sale of rawSales) {
      const dateStr = sale.created_at || sale.sale_date
      if (!dateStr) continue

      const parsedDate = parseISO(dateStr)
      if (!isValid(parsedDate)) continue

      const day = format(parsedDate, "MMM dd")

      if (!salesByDay[day]) {
        salesByDay[day] = { sales: 0, revenue: 0 }
      }

      salesByDay[day].sales += 1
      salesByDay[day].revenue += Number.parseFloat(sale.total_amount || "0")
    }

    return Object.entries(salesByDay)
      .map(([date, data]) => ({
        name: date,
        sales: data.sales,
        orders: data.sales,
        revenue: data.revenue / 1000, // Convert to thousands for chart
      }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(-7) // Last 7 days
  }, [rawSales])

  // Chart loading state management
  useEffect(() => {
    setChartLoading(true)
    setChartError(null)
    setTimeout(() => {
      setChartLoading(false)
      if (!chartData.length) setChartError("No sales data for chart")
    }, 100)
  }, [chartData])

  // Load sales data
  useEffect(() => {
    setLoading(true)
    getSales()
      .then((data) => {
        setRawSales(data)
        setError(null)
      })
      .catch(() => setError("Failed to load sales"))
      .finally(() => setLoading(false))
  }, [])

  // Export to CSV
  function handleExport() {
    const rows = [
      ["Order Code", "Customer Name", "Sale Date", "Status", "Total Amount", "# of Items"],
      ...rawSales.map((s) => [
        s.id.slice(0, 8).toUpperCase(),
        s.customer_name,
        s.sale_date,
        s.status,
        s.total_amount,
        s.items?.length || 0,
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
    a.download = "sales_export.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleAddProduct(form: any) {
    try {
      await createProduct(form)
      setDialogOpen(false)
      toast({
        title: "Product added",
        description: `Product '${form.name}' was added successfully.`,
        variant: "success",
      })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add product", variant: "error" })
    }
  }

  async function handleAddSale(form: SaleFormData) {
    try {
      await createSale({
        ...form,
        total_amount: form.total_amount,
        items: form.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
      })
      setAddSaleOpen(false)
      toast({
        title: "Sale added",
        description: `Sale for '${form.customer_name}' was added successfully.`,
        variant: "success",
      })

      // Refresh sales data
      refreshSalesData()
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add sale", variant: "error" })
    }
  }

  async function handleEditSale(form: SaleFormData) {
    if (!selectedSale) return
    try {
      await updateSale(selectedSale.id, {
        ...form,
        total_amount: form.total_amount,
        items: form.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
      })
      setEditSaleOpen(false)
      setSelectedSale(null)
      toast({
        title: "Sale updated",
        description: `Sale for '${form.customer_name}' was updated successfully.`,
        variant: "success",
      })
      refreshSalesData()
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update sale", variant: "error" })
    }
  }

  function refreshSalesData() {
    setLoading(true)
    getSales()
      .then((data) => {
        setRawSales(data)
      })
      .finally(() => setLoading(false))
  }

  function openEditSale(saleId: string) {
    const sale = rawSales.find((s) => s.id === saleId)
    if (!sale) return
    setSelectedSale({
      id: sale.id,
      customer_name: sale.customer_name,
      sale_date: sale.sale_date,
      status: sale.status,
      notes: sale.notes,
      items: sale.items.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      })),
      total_amount: sale.total_amount,
    })
    setEditSaleOpen(true)
  }

  function openViewSale(saleId: string) {
    const sale = rawSales.find((s) => s.id === saleId)
    if (!sale) return
    setViewedSale(sale)
    setViewSaleOpen(true)
  }

  function handleAddSupplier() {
    setAddSupplierOpen(true)
  }

  async function handleSupplierSubmit(form: SupplierFormData) {
    setAddSupplierLoading(true)
    try {
      await createSupplier(form)
      setAddSupplierOpen(false)
      toast({
        title: "Supplier added",
        description: `Supplier '${form.name}' was added successfully.`,
        variant: "success",
      })
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" })
    } finally {
      setAddSupplierLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Sales Orders">
        <div className="min-h-screen bg-white dark:bg-[#0b1437]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading sales dashboard...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Sales Orders">
        <div className="min-h-screen bg-white dark:bg-[#0b1437]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()} className="bg-purple-600 hover:bg-purple-700">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Sales Orders">
      <div className="min-h-screen bg-white dark:bg-[#0b1437] p-4">
        <motion.div style={{ y: contentY }} className="space-y-8">
          {/* Professional Header Section */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl p-6 shadow-lg"
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {displayName}
              </h1>
              <p className="text-gray-700">Let's check your store today</p>
            </div>

            {/* Top bar: Search and Place Order */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <SalesSearchBar value={search} onChange={setSearch} />
              <PlaceOrderButton onClick={() => setAddSaleOpen(true)} />
            </div>
          </motion.div>

          {/* Metric Cards */}
          <MetricCards salesData={rawSales} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {chartLoading ? (
                <div className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl p-8 shadow-lg">
                  <div className="text-center text-gray-700">Loading sales summary...</div>
                </div>
              ) : chartError ? (
                <div className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl p-8 shadow-lg">
                  <div className="text-center text-red-500">{chartError}</div>
                </div>
              ) : (
                <ProfessionalAreaChart chartData={chartData} />
              )}
            </div>
            <div>
              <SalesReportPieChart />
            </div>
          </div>
          <div className="w-full">
            <SalesOrderTable sales={rawSales} onEdit={openEditSale} onView={openViewSale} />
          </div>

          {/* All Dialogs */}
          <UIDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <UIDialogContent className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl">
              <UIDialogHeader>
                <UIDialogTitle className="text-gray-900">Add Product</UIDialogTitle>
              </UIDialogHeader>
              <AddProductForm onSubmit={handleAddProduct} onCancel={() => setDialogOpen(false)} />
            </UIDialogContent>
          </UIDialog>

          <UIDialog open={addSaleOpen} onOpenChange={setAddSaleOpen}>
            <UIDialogContent className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl">
              <UIDialogHeader>
                <UIDialogTitle className="text-gray-900">Place Order</UIDialogTitle>
              </UIDialogHeader>
              <SaleForm onSubmit={handleAddSale} onCancel={() => setAddSaleOpen(false)} />
            </UIDialogContent>
          </UIDialog>

          <UIDialog open={editSaleOpen} onOpenChange={setEditSaleOpen}>
            <UIDialogContent className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl">
              <UIDialogHeader>
                <UIDialogTitle className="text-gray-900">Edit Sale</UIDialogTitle>
              </UIDialogHeader>
              <SaleForm initialData={selectedSale} onSubmit={handleEditSale} onCancel={() => setEditSaleOpen(false)} />
            </UIDialogContent>
          </UIDialog>

          <UIDialog open={viewSaleOpen} onOpenChange={setViewSaleOpen}>
            <UIDialogContent className="bg-white dark:bg-[#020817] border border-white/20 dark:border-white/10 rounded-xl">
              <UIDialogHeader>
                <UIDialogTitle className="text-gray-900">Sale Details</UIDialogTitle>
              </UIDialogHeader>
              {viewedSale && (
                <div className="space-y-2">
                  <div>
                    <b>Order Code:</b> {viewedSale.id.slice(0, 8).toUpperCase()}
                  </div>
                  <div>
                    <b>Customer Name:</b> {viewedSale.customer_name}
                  </div>
                  <div>
                    <b>Sale Date:</b> {viewedSale.sale_date}
                  </div>
                  <div>
                    <b>Status:</b> {viewedSale.status}
                  </div>
                  <div>
                    <b>Notes:</b> {viewedSale.notes}
                  </div>
                  <div>
                    <b>Total Amount:</b> ${Number.parseFloat(viewedSale.total_amount).toLocaleString()}
                  </div>
                  <div>
                    <b>Items:</b>
                    <ul className="list-disc ml-6">
                      {viewedSale.items.map((item: any, idx: number) => (
                        <li key={idx}>
                          Product: {item.product_id}, Qty: {item.quantity}, Unit Price: {item.unit_price}, Line Total:{" "}
                          {item.line_total}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </UIDialogContent>
          </UIDialog>

          <SupplierModal
            open={addSupplierOpen}
            onClose={() => setAddSupplierOpen(false)}
            onSubmit={handleSupplierSubmit}
            loading={addSupplierLoading}
          />
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
