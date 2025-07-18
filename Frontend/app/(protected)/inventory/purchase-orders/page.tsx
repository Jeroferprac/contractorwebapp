'use client';

import { useState, useEffect, useMemo } from "react";
import type { PurchaseOrder, CreatePurchaseOrderData, UpdatePurchaseOrderData, Supplier } from "@/types/inventory";
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, getSuppliers } from "@/lib/inventory";
import { PurchaseOrderTable } from "./components/PurchaseOrderTable";
import { PurchaseOrderSearchBar } from "./components/PurchaseOrderSearchBar";
import { AddPurchaseOrderButton } from "./components/AddPurchaseOrderButton";
import { PurchaseOrderForm } from "@/components/forms/purchase-order-form";
import QuickActions from "../components/QuickActions";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { RecentActivity } from "../products/components/RecentActivity";

interface Activity {
  action: string;
  item: string;
  time: string;
}

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const { toast } = useToast();

  const [activities, setActivities] = useState<Activity[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('purchase_orders_activities');
      if (stored) {
        try {
          return (JSON.parse(stored) as Activity[]).map((a) => ({
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
      localStorage.setItem('purchase_orders_activities', JSON.stringify(activities));
    }
  }, [activities]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
  }, []);

  const supplierMap = useMemo(() => {
    const map: Record<string, string> = {};
    suppliers.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [suppliers]);

  useEffect(() => {
    getPurchaseOrders()
      .then((orders: PurchaseOrder[]) => {
        setPurchaseOrders(orders);
      })
      .catch((err: unknown) => {
        console.error(err);
        setError("Failed to load purchase orders");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPurchaseOrders = purchaseOrders.filter((po) =>
    (po.po_number?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (po.supplier?.name?.toLowerCase().includes(search.toLowerCase()) || false)
  );

  const handleDeletePurchaseOrder = async (id: string) => {
    try {
      // No DELETE API – simulate delete
      setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
      toast({ title: "Success", description: "Purchase order deleted." });
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      toast({
        title: "Error",
        description: "Failed to delete purchase order",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleEditPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    setEditingOrder(purchaseOrder);
  };

  const handleCancelEdit = () => setEditingOrder(null);
  const handleCancelForm = () => setShowForm(false);

  const handleSubmitForm = async (data: CreatePurchaseOrderData) => {
    setFormLoading(true);
    try {
      const newPO = await createPurchaseOrder(data);
      toast({ title: 'Success', description: 'Created successfully' });
      setPurchaseOrders((prev) => [newPO, ...prev]);
      setShowForm(false);
      setActivities((prev) => [
        {
          action: 'Created Purchase Order',
          item: `${newPO.po_number} - ${supplierMap[newPO.supplier_id ?? ""]}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Creation failed', variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmitEditForm = async (data: UpdatePurchaseOrderData) => {
    if (!editingOrder) return;
    setFormLoading(true);
    try {
      const updated = await updatePurchaseOrder(editingOrder.id, data);
      toast({ title: 'Success', description: 'Updated successfully' });
      setPurchaseOrders((prev) =>
        prev.map((po) => (po.id === editingOrder.id ? updated : po))
      );
      setEditingOrder(null);
      setActivities((prev) => [
        {
          action: 'Updated Purchase Order',
          item: `${updated.po_number} - ${supplierMap[updated.supplier_id ?? ""]}`,
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  // ✅ CSV Export
  const handleExport = () => {
    if (!purchaseOrders || purchaseOrders.length === 0) {
      toast({ title: "No Data", description: "Nothing to export." });
      return;
    }

    const headers = ["PO Number", "Supplier", "Order Date", "Total Amount", "Status"];

    const rows = purchaseOrders.map((po) => [
      po.po_number ?? "",
      po.supplier?.name ?? "Unknown",
      new Date(po.order_date).toLocaleDateString(),
      `$${Number(po.total_amount || 0).toFixed(2)}`,
      po.status ?? "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "purchase_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isEditing = editingOrder !== null;

  if (loading) {
    return <DashboardLayout title="Purchase Orders"><div className="p-8">Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout title="Purchase Orders"><div className="p-8 text-red-500">{error}</div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Purchase Orders">
      <div className="p-4 lg:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {showForm || isEditing ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" onClick={isEditing ? handleCancelEdit : handleCancelForm}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEditing ? 'Update the details' : 'Fill in details to create a purchase order'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <PurchaseOrderSearchBar value={search} onChange={setSearch} />
              <AddPurchaseOrderButton onClick={() => setShowForm(true)} />
            </>
          )}
        </div>

        {showForm || isEditing ? (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{isEditing ? 'Edit Purchase Order' : 'Purchase Order Details'}</CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <PurchaseOrderForm<'edit'>
                      mode="edit"
                      initialData={editingOrder!}
                      onSubmit={handleSubmitEditForm}
                      onCancel={handleCancelEdit}
                      loading={formLoading}
                    />
                  ) : (
                    <PurchaseOrderForm<'create'>
                      mode="create"
                      onSubmit={handleSubmitForm}
                      onCancel={handleCancelForm}
                      loading={formLoading}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-1 space-y-6">
              <QuickActions
                onAddProduct={() => {}}
                onAddSupplier={() => {}}
                onCreateOrder={() => setShowForm(true)}
                onExport={handleExport}
              />
              <RecentActivity activities={activities} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <PurchaseOrderTable
                purchaseOrders={filteredPurchaseOrders}
                supplierMap={supplierMap}
                onEdit={handleEditPurchaseOrder}
                onDelete={(purchaseOrder) => setDeleteId(purchaseOrder.id)}
              />
            </div>
            <div className="xl:col-span-1 space-y-6">
              <QuickActions
                onAddProduct={() => {}}
                onAddSupplier={() => {}}
                onCreateOrder={() => setShowForm(true)}
                onExport={handleExport}
              />
              <RecentActivity activities={activities} />
            </div>
          </div>
        )}

        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="mb-4">Are you sure you want to delete this purchase order?</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => handleDeletePurchaseOrder(deleteId)}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
