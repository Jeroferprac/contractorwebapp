"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PurchaseOrder } from "@/lib/inventory";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[]
  supplierMap: Record<string, string>;
  onEdit?: (purchaseOrder: PurchaseOrder) => void;
  onDelete?: (purchaseOrder: PurchaseOrder) => void;
}

export function PurchaseOrderTable({ purchaseOrders, supplierMap, onEdit, onDelete }: PurchaseOrderTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3 px-4 text-left">PO Number</th>
                <th className="py-3 px-4 text-left">Supplier</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium">{order.po_number || 'N/A'}</td>
                  <td className="py-3 px-4">{order.supplier?.name || supplierMap[(order.supplier_id ?? "")] || "Unknown Supplier"}</td>
                  <td className="py-3 px-4">{new Date(order.order_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-right font-medium">
                    {formatCurrency(order.total_amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit && onEdit(order)}>Edit</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {purchaseOrders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <span className="text-lg font-bold">PO</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{order.po_number || 'N/A'}</div>
                  <div className="text-sm text-gray-500">
                    {order.supplier?.name || supplierMap[(order.supplier_id ?? "")] || "Unknown Supplier"}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium">{formatCurrency(order.total_amount)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit && onEdit(order)}>Edit</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 