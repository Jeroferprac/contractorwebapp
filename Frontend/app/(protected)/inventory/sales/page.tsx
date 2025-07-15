"use client";

import { useState, useEffect } from "react";
import SalesOrdersTable, { SalesOrder } from "./components/SalesOrdersTable";
import SalesReportChart, { ChartDatum } from "./components/SalesReportChart";
import QuickActions from "../components/QuickActions";
import { RecentActivity, Activity } from "../products/components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { SalesSearchBar } from "./components/SalesSearchBar";
import { PlaceOrderButton } from "./components/PlaceOrderButton";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogHeader as UIDialogHeader, DialogTitle as UIDialogTitle } from "@/components/ui/dialog";
import { AddProductForm } from "../products/components/AddProductForm";
import { createProduct, getSales, getSalesSummary, createSale, updateSale, getSale } from "@/lib/inventory";
import { useToast } from "@/components/ui/use-toast";
import { SaleForm, SaleFormData } from "./components/SaleForm";
import { parseISO, format, isValid } from 'date-fns';
import { useMemo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SupplierModal, SupplierFormData } from "../suppliers/components/SupplierModal";
import { createSupplier } from "@/lib/inventory";

const activities: Activity[] = [
  { action: "Ordered", item: "MacBook Pro", time: "2 min ago" },
  { action: "Shipped", item: "iPhone 14", time: "5 min ago" },
  { action: "Delivered", item: "iPad Pro", time: "10 min ago" },
  { action: "Returned", item: "Apple Watch", time: "15 min ago" },
];

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // For Add Product
  const [addSaleOpen, setAddSaleOpen] = useState(false);
  const [editSaleOpen, setEditSaleOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [sales, setSales] = useState<SalesOrder[]>([]);
  const [rawSales, setRawSales] = useState<any[]>([]); // For edit/view
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Chart loading state
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterCustomer, setFilterCustomer] = useState<string>("");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");
  const [filteredSales, setFilteredSales] = useState<SalesOrder[]>([]);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [addSupplierLoading, setAddSupplierLoading] = useState(false);
  const [addSupplierError, setAddSupplierError] = useState<string | null>(null);

  // Professional: Memoized, robust chart data grouping by day
  const chartData: ChartDatum[] = useMemo(() => {
    if (!rawSales || !Array.isArray(rawSales)) return [];
    const salesByDay: Record<string, { sales: number; revenue: number }> = {};
    for (const sale of rawSales) {
      // Use created_at, fallback to sale_date if needed
      let dateStr = sale.created_at || sale.sale_date;
      if (!dateStr) continue;
      let parsedDate = parseISO(dateStr);
      if (!isValid(parsedDate)) continue;
      const day = format(parsedDate, 'yyyy-MM-dd');
      if (!salesByDay[day]) {
        salesByDay[day] = { sales: 0, revenue: 0 };
      }
      salesByDay[day].sales += 1;
      salesByDay[day].revenue += parseFloat(sale.total_amount || '0');
    }
    return Object.entries(salesByDay)
      .map(([date, data]) => ({
        name: date,
        sales: data.sales,
        orders: data.sales, // for chart's 'orders' line
        revenue: data.revenue,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [rawSales]);

  // Chart loading state management
  useEffect(() => {
    setChartLoading(true);
    setChartError(null);
    // Simulate async for consistency, or set to false immediately
    setTimeout(() => {
      setChartLoading(false);
      if (!chartData.length) setChartError('No sales data for chart');
    }, 100);
  }, [chartData]);

  // Apply filters
  useEffect(() => {
    let filtered = sales;
    if (filterStatus) {
      filtered = filtered.filter(s => s.status.toLowerCase() === filterStatus.toLowerCase());
    }
    if (filterCustomer) {
      filtered = filtered.filter(s => s.customerName.toLowerCase().includes(filterCustomer.toLowerCase()));
    }
    if (filterDateFrom) {
      filtered = filtered.filter(s => s.saleDate >= filterDateFrom);
    }
    if (filterDateTo) {
      filtered = filtered.filter(s => s.saleDate <= filterDateTo);
    }
    setFilteredSales(filtered);
  }, [sales, filterStatus, filterCustomer, filterDateFrom, filterDateTo]);

  // Export to CSV
  function handleExport() {
    const rows = [
      ["Order Code", "Customer Name", "Sale Date", "Status", "Total Amount", "# of Items"],
      ...filteredSales.map(s => [s.orderCode, s.customerName, s.saleDate, s.status, s.totalAmount, s.numItems])
    ];
    const csv = rows.map(r => r.map(String).map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const { toast } = useToast();
  const [viewSaleOpen, setViewSaleOpen] = useState(false);
  const [viewedSale, setViewedSale] = useState<any | null>(null);

  useEffect(() => {
    setLoading(true);
    getSales()
      .then((data) => {
        setRawSales(data);
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              orderCode: item.id.slice(0, 8).toUpperCase(),
              customerName: item.customer_name,
              saleDate: item.sale_date,
              status: item.status,
              totalAmount: `₹${parseFloat(item.total_amount).toLocaleString()}`,
              numItems: item.items?.length || 0,
            }))
          : [];
        setSales(mapped);
        setError(null);
      })
      .catch(() => setError("Failed to load sales"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAddProduct(form: any) {
    try {
      await createProduct(form);
      setDialogOpen(false);
      toast({ title: "Product added", description: `Product '${form.name}' was added successfully.`, variant: "success" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add product", variant: "error" });
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
      });
      setAddSaleOpen(false);
      toast({ title: "Sale added", description: `Sale for '${form.customer_name}' was added successfully.`, variant: "success" });
      // Refresh sales
      setLoading(true);
      getSales()
        .then((data) => {
          setRawSales(data);
          const mapped = Array.isArray(data)
            ? data.map((item: any) => ({
                id: item.id,
                orderCode: item.id.slice(0, 8).toUpperCase(),
                customerName: item.customer_name,
                saleDate: item.sale_date,
                status: item.status,
                totalAmount: `₹${parseFloat(item.total_amount).toLocaleString()}`,
                numItems: item.items?.length || 0,
              }))
            : [];
          setSales(mapped);
        })
        .finally(() => setLoading(false));
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to add sale", variant: "error" });
    }
  }

  async function handleEditSale(form: SaleFormData) {
    if (!selectedSale) return;
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
      });
      setEditSaleOpen(false);
      setSelectedSale(null);
      toast({ title: "Sale updated", description: `Sale for '${form.customer_name}' was updated successfully.`, variant: "success" });
      // Refresh sales
      setLoading(true);
      getSales()
        .then((data) => {
          setRawSales(data);
          const mapped = Array.isArray(data)
            ? data.map((item: any) => ({
                id: item.id,
                orderCode: item.id.slice(0, 8).toUpperCase(),
                customerName: item.customer_name,
                saleDate: item.sale_date,
                status: item.status,
                totalAmount: `₹${parseFloat(item.total_amount).toLocaleString()}`,
                numItems: item.items?.length || 0,
              }))
            : [];
          setSales(mapped);
        })
        .finally(() => setLoading(false));
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to update sale", variant: "error" });
    }
  }

  function openEditSale(saleId: string) {
    const sale = rawSales.find((s) => s.id === saleId);
    if (!sale) return;
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
    });
    setEditSaleOpen(true);
  }

  function openViewSale(saleId: string) {
    const sale = rawSales.find((s) => s.id === saleId);
    if (!sale) return;
    setViewedSale(sale);
    setViewSaleOpen(true);
  }

  function handleAddSupplier() {
    setAddSupplierOpen(true);
  }

  async function handleSupplierSubmit(form: SupplierFormData) {
    setAddSupplierLoading(true);
    setAddSupplierError(null);
    try {
      await createSupplier(form);
      setAddSupplierOpen(false);
      toast({ title: "Supplier added", description: `Supplier '${form.name}' was added successfully.`, variant: "success" });
    } catch (err: any) {
      setAddSupplierError(err.message || "Failed to add supplier");
      toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" });
    } finally {
      setAddSupplierLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Sales Orders">
        <div className="p-8 text-center">Loading sales...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Sales Orders">
        <div className="p-8 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Sales Orders">
      <div className="p-4 lg:p-6">
        {/* Top bar: Search and Place Order */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SalesSearchBar value={search} onChange={setSearch} />
          <PlaceOrderButton onClick={() => setAddSaleOpen(true)} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - Sales Orders and Chart */}
          <div className="xl:col-span-2 space-y-6">
            <SalesOrdersTable
              salesData={filteredSales.filter(sale =>
                sale.orderCode.toLowerCase().includes(search.toLowerCase()) ||
                sale.customerName.toLowerCase().includes(search.toLowerCase()) ||
                sale.status.toLowerCase().includes(search.toLowerCase())
              )}
              onEdit={openEditSale}
              onView={openViewSale}
              onFilter={() => setFilterOpen(true)}
              onExport={handleExport}
            />
            {chartLoading ? (
              <div className="p-8 text-center">Loading sales summary...</div>
            ) : chartError ? (
              <div className="p-8 text-center text-red-500">{chartError}</div>
            ) : (
            <SalesReportChart chartData={chartData} />
            )}
          </div>
          {/* Right Sidebar - Quick Actions and Recent Activity */}
          <div className="xl:col-span-1 space-y-6">
          <QuickActions
              onAddProduct={() => setDialogOpen(true)}
              onAddSupplier={handleAddSupplier}
              onCreateOrder={() => setAddSaleOpen(true)}
              onExport={handleExport}
            />
            <RecentActivity activities={activities} />
          </div>
        </div>
        {/* Add Product Dialog */}
        <UIDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <UIDialogContent>
            <UIDialogHeader>
              <UIDialogTitle>Add Product</UIDialogTitle>
            </UIDialogHeader>
            <AddProductForm
              onSubmit={handleAddProduct}
              onCancel={() => setDialogOpen(false)}
            />
          </UIDialogContent>
        </UIDialog>
        {/* Add Sale Dialog (Place Order) */}
        <UIDialog open={addSaleOpen} onOpenChange={setAddSaleOpen}>
          <UIDialogContent>
            <UIDialogHeader>
              <UIDialogTitle>Place Order</UIDialogTitle>
            </UIDialogHeader>
            <SaleForm
              onSubmit={handleAddSale}
              onCancel={() => setAddSaleOpen(false)}
            />
          </UIDialogContent>
        </UIDialog>
        {/* Edit Sale Dialog */}
        <UIDialog open={editSaleOpen} onOpenChange={setEditSaleOpen}>
          <UIDialogContent>
            <UIDialogHeader>
              <UIDialogTitle>Edit Sale</UIDialogTitle>
            </UIDialogHeader>
            <SaleForm
              initialData={selectedSale}
              onSubmit={handleEditSale}
              onCancel={() => setEditSaleOpen(false)}
            />
          </UIDialogContent>
        </UIDialog>
        {/* View Sale Dialog */}
        <UIDialog open={viewSaleOpen} onOpenChange={setViewSaleOpen}>
          <UIDialogContent>
            <UIDialogHeader>
              <UIDialogTitle>Sale Details</UIDialogTitle>
            </UIDialogHeader>
            {viewedSale && (
              <div className="space-y-2">
                <div><b>Order Code:</b> {viewedSale.id.slice(0,8).toUpperCase()}</div>
                <div><b>Customer Name:</b> {viewedSale.customer_name}</div>
                <div><b>Sale Date:</b> {viewedSale.sale_date}</div>
                <div><b>Status:</b> {viewedSale.status}</div>
                <div><b>Notes:</b> {viewedSale.notes}</div>
                <div><b>Total Amount:</b> ₹{parseFloat(viewedSale.total_amount).toLocaleString()}</div>
                <div>
                  <b>Items:</b>
                  <ul className="list-disc ml-6">
                    {viewedSale.items.map((item: any, idx: number) => (
                      <li key={idx}>
                        Product: {item.product_id}, Qty: {item.quantity}, Unit Price: {item.unit_price}, Line Total: {item.line_total}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </UIDialogContent>
        </UIDialog>
        {/* Filter Modal */}
        <UIDialog open={filterOpen} onOpenChange={setFilterOpen}>
          <UIDialogContent>
            <UIDialogHeader>
              <UIDialogTitle>Filter Sales</UIDialogTitle>
            </UIDialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Input value={filterStatus} onChange={e => setFilterStatus(e.target.value)} placeholder="e.g. completed, in progress" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Customer Name</label>
                <Input value={filterCustomer} onChange={e => setFilterCustomer(e.target.value)} placeholder="Customer Name" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date From</label>
                  <Input type="date" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Date To</label>
                  <Input type="date" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => {
                  setFilterStatus("");
                  setFilterCustomer("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}>Clear</Button>
                <Button onClick={() => setFilterOpen(false)}>Apply</Button>
              </div>
            </div>
          </UIDialogContent>
        </UIDialog>
        {/* Add Supplier Dialog */}
        <SupplierModal
          open={addSupplierOpen}
          onClose={() => setAddSupplierOpen(false)}
          onSubmit={handleSupplierSubmit}
          loading={addSupplierLoading}
        />
      </div>
    </DashboardLayout>
  );
}
