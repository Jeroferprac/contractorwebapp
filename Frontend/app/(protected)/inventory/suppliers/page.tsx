"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getSuppliers } from "@/lib/inventory";
import { SuppliersSearchBar } from "./components/SupplierSearch";
import { EditSupplierButton } from "./components/EditSupplier";
import { SuppliersTable, Supplier } from "./components/SuppliersTable";
import { TopSuppliersChart } from "./components/TopSuppliersChart";
import QuickActions from "../components/QuickActions";
import { SupplierModal, SupplierFormData } from "./components/SupplierModal";
import { createSupplier, updateSupplier, deleteSupplier, getSupplier } from "@/lib/inventory";
import { toast, useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

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
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to add supplier", variant: "error" });
        } finally {
            setModalLoading(false);
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
        } catch (err: any) {
            toast({ title: "Error", description: err.message || "Failed to delete supplier", variant: "error" });
        }
        setDeleteId(null);
    };

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
                            <QuickActions />
                            <TopSuppliersChart />
                        </div>
                    </div>
                )}
                {/* Add/Edit Modal */}
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
                    } : null}
                    loading={modalLoading}
                />
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
