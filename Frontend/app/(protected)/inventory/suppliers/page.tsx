"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getSuppliers, createSupplier, createProduct, updateSupplier, deleteSupplier } from "@/lib/inventory";
import { SuppliersSearchBar } from "./components/SupplierSearch";
import { EditSupplierButton } from "./components/EditSupplier";
import { SuppliersTable, Supplier } from "./components/SuppliersTable";
import { TopSuppliersChart } from "./components/TopSuppliersChart";
import QuickActions from "../components/QuickActions";
import { SupplierModal, SupplierFormData } from "./components/SupplierModal";
import { AddProductForm } from "../products/components/AddProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast, useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { SaleForm, SaleFormData } from "../sales/components/SaleForm";
import { createSale } from "@/lib/inventory";
import { getSalesDetailsByPeriod } from "@/lib/inventory";
import { RecentActivity } from "../products/components/RecentActivity";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [createOrderOpen, setCreateOrderOpen] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const { toast } = useToast();
    const [activities, setActivities] = useState(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('suppliers_activities');
        if (stored) {
          try {
            return JSON.parse(stored).map((a) => ({
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
        localStorage.setItem('suppliers_activities', JSON.stringify(activities));
      }
    }, [activities]);

    useEffect(() => {
        getSuppliers()
            .then((data) => setSuppliers(data))
            .catch(() => setError("Failed to load suppliers"))
            .finally(() => setLoading(false));
    }, []);

    const filteredSuppliers = suppliers.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase()) ||
        s.phone?.toLowerCase().includes(search.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(search.toLowerCase())
    );

    // Add Supplier
    const handleAddSupplier = async (data: SupplierFormData) => {
        setModalLoading(true);
        try {
            const newSupplier = await createSupplier(data);
            setSuppliers((prev) => [newSupplier, ...prev]);
            toast({ title: "Supplier added", description: `${data.name} was added successfully.`, variant: "success" });
            setModalOpen(false);
            setActivities(prev => [
              { action: "Added Supplier", item: data.name, time: new Date().toLocaleTimeString() },
              ...prev,
            ]);
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" });
        } finally {
            setModalLoading(false);
        }
    };

    // Add Product
    const handleAddProduct = async (form: any) => {
        try {
            await createProduct(form);
            setAddProductOpen(false);
            toast({ title: "Product added", description: `Product '${form.name}' was added successfully.`, variant: "success" });
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to add product", variant: "error" });
        }
    };

    // Edit Supplier
    const handleEditSupplier = async (data: SupplierFormData) => {
        if (!editSupplier) return;
        setModalLoading(true);
        try {
            const updated = await updateSupplier(editSupplier.id!, data);
            setSuppliers((prev) => prev.map((s) => (s.id === editSupplier.id ? updated : s)));
            toast({ title: "Supplier updated", description: `${data.name} was updated successfully.`, variant: "success" });
            setEditSupplier(null);
            setModalOpen(false);
            setActivities(prev => [
              { action: "Updated Supplier", item: data.name, time: new Date().toLocaleTimeString() },
              ...prev,
            ]);
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to update supplier", variant: "error" });
        } finally {
            setModalLoading(false);
        }
    };

    // Delete Supplier
    const handleDeleteSupplier = async (id: string) => {
        try {
            await deleteSupplier(id);
            setSuppliers((prev) => prev.filter((s) => s.id !== id));
            toast({ title: "Supplier deleted", description: `Supplier was deleted successfully.`, variant: "success" });
            setDeleteId(null);
            setActivities(prev => [
              { action: "Deleted Supplier", item: id, time: new Date().toLocaleTimeString() },
              ...prev,
            ]);
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to delete supplier", variant: "error" });
        }
    };

    // Export to CSV for suppliers
    function handleExport() {
      const rows = [
        ["Name", "Contact Person", "Email", "Phone", "Address", "Payment Terms"],
        ...filteredSuppliers.map(s => [
          s.name,
          s.contact_person,
          s.email,
          s.phone,
          s.address || "",
          s.payment_terms ?? ""
        ])
      ];
      const csv = rows.map(r => r.map(String).map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "suppliers_export.csv";
      a.click();
      URL.revokeObjectURL(url);
    }

    async function handleCreateOrder(form: SaleFormData) {
      setOrderLoading(true);
      try {
        await createSale(form);
        setCreateOrderOpen(false);
        toast({ title: "Order placed", description: `Order for '${form.customer_name}' was created successfully.`, variant: "success" });
      } catch (err: any) {
        toast({ title: "Error", description: err.message || "Failed to create order", variant: "error" });
      } finally {
        setOrderLoading(false);
      }
    }

    return (
        <DashboardLayout title="Suppliers">
            <div className="p-4 lg:p-6">
                {/* Top bar: Search and Add Supplier */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <SuppliersSearchBar value={search} onChange={setSearch} />
                    <Button className="bg-blue-500 text-white" onClick={() => { setEditSupplier(null); setModalOpen(true); }}>Add Supplier</Button>
                </div>
                {loading ? (
                    <div className="p-8 text-center">Loading suppliers...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Main Content - Suppliers Table and Chart */}
                        <div className="xl:col-span-2 space-y-6">
                            <SuppliersTable
                                suppliersData={filteredSuppliers}
                                onEdit={(supplier) => { setEditSupplier(supplier); setModalOpen(true); }}
                                onDelete={(supplier) => setDeleteId(supplier.id!)}
                            />
                        </div>
                        {/* Right Sidebar - Top Suppliers Chart and Quick Actions */}
                        <div className="xl:col-span-1 space-y-6">
                            <QuickActions
                                onAddProduct={() => setAddProductOpen(true)}
                                onAddSupplier={() => { setEditSupplier(null); setModalOpen(true); }}
                                onCreateOrder={() => setCreateOrderOpen(true)}
                                onExport={handleExport}
                            />
                            <TopSuppliersChart />
                            <RecentActivity activities={activities} />
                        </div>
                    </div>
                )}
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
                  open={modalOpen}
                  onClose={() => { setModalOpen(false); setEditSupplier(null); }}
                  onSubmit={editSupplier ? handleEditSupplier : handleAddSupplier}
                  initialData={editSupplier ? {
                    name: editSupplier.name,
                    contact_person: editSupplier.contact_person,
                    email: editSupplier.email,
                    phone: editSupplier.phone,
                    address: editSupplier.address,
                    payment_terms: editSupplier.payment_terms,
                  } : undefined}
                  loading={modalLoading}
                />
                {/* Create Order Dialog */}
                <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
                  <DialogContent className="p-0">
                    <DialogHeader>
                      <DialogTitle>Create Order</DialogTitle>
                    </DialogHeader>
                    <SaleForm
                      onSubmit={handleCreateOrder}
                      onCancel={() => setCreateOrderOpen(false)}
                      loading={orderLoading}
                    />
                  </DialogContent>
                </Dialog>
                {/* Delete Confirm Dialog */}
                {deleteId && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
                        <div className="bg-white rounded-lg p-6 shadow-lg">
                            <div className="mb-4">Are you sure you want to delete this supplier?</div>
                            <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDeleteSupplier(deleteId)}>Delete</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
