'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPurchaseOrder } from "@/lib/inventory";
import type { CreatePurchaseOrderData } from "@/types/inventory";
import { PurchaseOrderForm } from '@/components/forms/purchase-order-form';
import { useToast } from '@/components/ui/use-toast';

export default function CreatePurchaseOrderPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (data: CreatePurchaseOrderData) => {
    setLoading(true);
    try {
      await createPurchaseOrder(data);
      toast({
        title: 'Success',
        description: 'Purchase order created successfully',
      });
      router.push('/inventory/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: 'Error',
        description: 'Failed to create purchase order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/inventory/purchase-orders');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Purchase Order</h1>
            <p className="text-muted-foreground">
              Create a new purchase order for your inventory
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PurchaseOrderForm<'create'>
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
