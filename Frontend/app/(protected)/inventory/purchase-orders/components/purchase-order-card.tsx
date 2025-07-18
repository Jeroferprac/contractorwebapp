'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import { PurchaseOrder } from '@/lib/inventory';

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export function PurchaseOrderCard({ 
  purchaseOrder, 
  onView, 
  onEdit, 
  
}: PurchaseOrderCardProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      approved: { variant: 'default', label: 'Approved' },
      delivered: { variant: 'default', label: 'Delivered' },
      cancelled: { variant: 'destructive', label: 'Cancelled' },
    };

    const config = statusConfig[status] || { variant: 'secondary', label: status };
    
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{purchaseOrder.po_number}</CardTitle>
          {getStatusBadge(purchaseOrder.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Supplier</span>
            <span className="font-medium">{purchaseOrder.supplier?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(purchaseOrder.created_at)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="font-semibold">{formatCurrency(purchaseOrder.total_amount || 0)}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2 border-t">
          <Button variant="ghost" size="sm" onClick={() => onView(purchaseOrder.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(purchaseOrder.id)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 