'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { purchaseOrderApi, PurchaseOrder, UpdatePurchaseOrderData, PurchaseOrderItem } from '@/lib/inventory';
import { PurchaseOrderForm } from '@/components/forms/purchase-order-form';
import { useToast } from '@/components/ui/use-toast';

interface PurchaseOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function PurchaseOrderDetailPage({ params }: PurchaseOrderDetailPageProps) {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const loadPurchaseOrder = useCallback(async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderApi.getPurchaseOrder(params.id);
      setPurchaseOrder(data);
    } catch (error) {
      console.error('Error loading purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to load purchase order',
        variant: 'destructive',
      });
      router.push('/inventory/purchase-orders');
    } finally {
      setLoading(false);
    }
  }, [params.id, toast, router]);

  useEffect(() => {
    loadPurchaseOrder();
  }, [loadPurchaseOrder]);

  const handleUpdate = async (data: UpdatePurchaseOrderData) => {
    setUpdateLoading(true);
    try {
      await purchaseOrderApi.updatePurchaseOrder(params.id, data);
      toast({
        title: 'Success',
        description: 'Purchase order updated successfully',
      });
      setEditing(false);
      loadPurchaseOrder();
    } catch (error) {
      console.error('Error updating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update purchase order',
        variant: 'destructive',
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this purchase order?')) return;
    
    try {
      await purchaseOrderApi.deletePurchaseOrder(params.id);
      toast({
        title: 'Success',
        description: 'Purchase order deleted successfully',
      });
      router.push('/inventory/purchase-orders');
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete purchase order',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      approved: { variant: 'default' as const, label: 'Approved' },
      delivered: { variant: 'default' as const, label: 'Delivered' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, label: status };
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading purchase order...</p>
        </div>
      </div>
    );
  }

  if (!purchaseOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Purchase order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/inventory/purchase-orders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchase Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/inventory/purchase-orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Purchase Order #{purchaseOrder.po_number || 'N/A'}</h1>
            <p className="text-muted-foreground">
              {purchaseOrder.supplier?.name || 'N/A'} • {formatDate(purchaseOrder.created_at)}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit className="h-4 w-4 mr-2" />
            {editing ? 'Cancel Edit' : 'Edit'}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {editing ? (
        /* Edit Form */
        <Card>
          <CardHeader>
            <CardTitle>Edit Purchase Order</CardTitle>
          </CardHeader>
          <CardContent>
            <PurchaseOrderForm
              mode="edit"
              initialData={purchaseOrder}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
              loading={updateLoading}
            />
          </CardContent>
        </Card>
      ) : (
        /* View Details */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">PO Number</p>
                  <p className="text-lg font-semibold">{purchaseOrder.po_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(purchaseOrder.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Supplier</p>
                  <p className="text-lg">{purchaseOrder.supplier?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-lg font-semibold">{formatCurrency(purchaseOrder.total_amount || 0)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Order Date</p>
                  <p className="text-lg">{formatDate(purchaseOrder.order_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created</p>
                  <p className="text-lg">{formatDate(purchaseOrder.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                <div className="space-y-4">
                  {purchaseOrder.items.map((item: PurchaseOrderItem, index: number) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.product?.sku || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.quantity} × ${item.unit_price.toFixed(2)}</p>
                        <p className="text-lg font-semibold">{formatCurrency(item.line_total)}</p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-2xl font-bold">{formatCurrency(purchaseOrder.total_amount || 0)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No items found</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
