'use client';

import { useState, useEffect } from "react";
import { purchaseOrderApi, PurchaseOrder, CreatePurchaseOrderData, UpdatePurchaseOrderData } from "@/lib/inventory";
import { PurchaseOrderTable } from "./components/PurchaseOrderTable";
import { PurchaseOrderSearchBar } from "./components/PurchaseOrderSearchBar";
import { AddPurchaseOrderButton } from "./components/AddPurchaseOrderButton";
import { PurchaseOrderForm } from "@/components/forms/purchase-order-form";
import QuickActions from "../components/QuickActions";
import { RecentActivity } from "./components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    purchaseOrderApi.listPurchaseOrders()
      .then((orders) => {
        setPurchaseOrders(orders);
      })
      .catch((error) => {
        console.error('Error loading purchase orders:', error);
        setError("Failed to load purchase orders");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPurchaseOrders = purchaseOrders.filter((po) =>
    (po.po_number?.toLowerCase().includes(search.toLowerCase()) || false) ||
    (po.supplier?.name?.toLowerCase().includes(search.toLowerCase()) || false)
  );

  const recentActivities = [
    { action: "Created", item: "PO-001", time: "2h ago" },
    { action: "Approved", item: "PO-002", time: "1d ago" },
  ];

  // Delete logic
  async function handleDeletePurchaseOrder(id: string) {
    try {
      await purchaseOrderApi.deletePurchaseOrder(id);
      
      setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
      
      toast({ 
        title: "Success", 
        description: "Purchase order deleted successfully", 
        variant: "default" 
      });
    } catch (err: unknown) {
      console.error('Error deleting purchase order:', err);
      const errorMessage = err instanceof Error ? err.message : "Failed to delete purchase order";
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
    setDeleteId(null);
  }

  // Edit logic
  const handleEditPurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    console.log('Editing purchase order:', purchaseOrder);
    setEditingOrder(purchaseOrder);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
  };

  // Form submission logic for create
  const handleSubmitForm = async (data: CreatePurchaseOrderData) => {
    setFormLoading(true);
    try {
      const newPurchaseOrder = await purchaseOrderApi.createPurchaseOrder(data);
      
      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });
      
      // Add the new purchase order to the existing list instead of refetching
      setPurchaseOrders((prev) => [newPurchaseOrder, ...prev]);
      setShowForm(false);
      
      // Also refresh the list to ensure we have the latest data
      try {
        const updatedOrders = await purchaseOrderApi.listPurchaseOrders();
        setPurchaseOrders(updatedOrders);
      } catch {
        // If refresh fails, we still have the new order in the list
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create purchase order',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Form submission logic for edit
  const handleSubmitEditForm = async (data: UpdatePurchaseOrderData) => {
    if (!editingOrder) return;
    
    setFormLoading(true);
    try {
      const updatedPurchaseOrder = await purchaseOrderApi.updatePurchaseOrder(editingOrder.id, data);
      
      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
      });
      
      // Update the purchase order in the list
      setPurchaseOrders((prev) => 
        prev.map((po) => po.id === editingOrder.id ? updatedPurchaseOrder : po)
      );
      setEditingOrder(null);
      
      // Also refresh the list to ensure we have the latest data
      try {
        const updatedOrders = await purchaseOrderApi.listPurchaseOrders();
        setPurchaseOrders(updatedOrders);
      } catch {
        // If refresh fails, we still have the updated order in the list
      }
    } catch (error) {
      console.error('Error updating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update purchase order',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
  };

  // Determine if we're in edit mode
  const isEditing = editingOrder !== null;

  if (loading) {
    return (
      <DashboardLayout title="Purchase Orders">
        <div className="p-8 text-center">Loading purchase orders...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Purchase Orders">
        <div className="p-8 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Purchase Orders">
      <div className="p-4 lg:p-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {showForm || isEditing ? (
            // Form Header
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={isEditing ? handleCancelEdit : handleCancelForm}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to List
                </Button>
                <div>
                  <h2 className="text-2xl font-bold">
                    {isEditing ? 'Edit Purchase Order' : 'Create New Purchase Order'}
                  </h2>
                  <p className="text-muted-foreground">
                    {isEditing 
                      ? 'Update the purchase order details below' 
                      : 'Fill in the details below to create a new purchase order'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // List Header
            <>
              <PurchaseOrderSearchBar value={search} onChange={setSearch} />
              <AddPurchaseOrderButton onClick={() => setShowForm(true)} />
            </>
          )}
        </div>

        {/* Main Content */}
        {showForm || isEditing ? (
          // Form Content
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isEditing ? 'Edit Purchase Order' : 'Purchase Order Details'}
                  </CardTitle>
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
            {/* Sidebar: Quick Actions & Recent Activity */}
            <div className="xl:col-span-1 space-y-6">
              <QuickActions />
              <RecentActivity activities={recentActivities} />
            </div>
          </div>
        ) : (
          // List Content
          <>
            {/* Delete Confirm Dialog */}
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

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Purchase Order List */}
              <div className="xl:col-span-3">
                <PurchaseOrderTable
                  purchaseOrders={filteredPurchaseOrders}
                  onEdit={handleEditPurchaseOrder}
                  onDelete={(purchaseOrder) => {
                    setDeleteId(purchaseOrder.id);
                  }}
                />
              </div>
              {/* Sidebar: Quick Actions & Recent Activity */}
              <div className="xl:col-span-1 space-y-6">
                <QuickActions />
                <RecentActivity activities={recentActivities} />
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 