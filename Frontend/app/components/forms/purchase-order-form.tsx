'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';
import {
  CreatePurchaseOrderData,
  UpdatePurchaseOrderData,
  PurchaseOrder,
  getSuppliers,
  getProducts,
} from '@/lib/inventory';
import { useToast } from '@/components/ui/use-toast';

// 1. Update PurchaseOrderFormProps to be generic and mode-specific
type PurchaseOrderFormMode = 'create' | 'edit';

type PurchaseOrderFormOnSubmit<M extends PurchaseOrderFormMode> =
  M extends 'create'
    ? (data: CreatePurchaseOrderData) => Promise<void>
    : (data: UpdatePurchaseOrderData) => Promise<void>;

interface PurchaseOrderFormProps<M extends PurchaseOrderFormMode = 'create'> {
  mode: M;
  initialData?: PurchaseOrder;
  onSubmit: PurchaseOrderFormOnSubmit<M>;
  onCancel: () => void;
  loading?: boolean;
}

// 2. Define a type for status
const PURCHASE_ORDER_STATUSES = ['pending', 'approved', 'delivered', 'cancelled'] as const;
type PurchaseOrderStatus = typeof PURCHASE_ORDER_STATUSES[number];

interface PurchaseOrderItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  selling_price?: number;
}

export function PurchaseOrderForm<M extends PurchaseOrderFormMode = 'create'>({
  mode,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}: PurchaseOrderFormProps<M>) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState(
    initialData?.supplier_id || ''
  );
  const [orderNumber, setOrderNumber] = useState(
    initialData?.po_number || ''
  );
  const [orderDate, setOrderDate] = useState(
    initialData?.order_date || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<PurchaseOrderStatus>(
    (initialData?.status as PurchaseOrderStatus) || 'pending'
  );

  const [items, setItems] = useState<PurchaseOrderItem[]>(
    initialData?.items?.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.quantity * item.unit_price,
    })) || []
  );

  const { toast } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const [suppliersData, productsData] = await Promise.all([
          getSuppliers(),
          getProducts(),
        ]);
        setSuppliers(suppliersData);
        setProducts(productsData);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { product_id: '', quantity: 1, unit_price: 0, line_total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: string | number
  ) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price') {
      updatedItems[index].line_total =
        updatedItems[index].quantity * updatedItems[index].unit_price;
    }

    setItems(updatedItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.line_total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSupplierId || !orderNumber || items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (mode === 'create') {
      const createData: CreatePurchaseOrderData = {
        supplier_id: selectedSupplierId,
        po_number: orderNumber,
        order_date: orderDate,
        status,
        total_amount: totalAmount,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
      };
      await (onSubmit as (data: CreatePurchaseOrderData) => Promise<void>)(createData);
    } else {
      const updateData: UpdatePurchaseOrderData = {
        supplier_id: selectedSupplierId,
        po_number: orderNumber,
        order_date: orderDate,
        status,
      };
      await (onSubmit as (data: UpdatePurchaseOrderData) => Promise<void>)(updateData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Order Fields --- */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="orderNumber">Order Number *</Label>
          <Input
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter PO number"
          />
        </div>
        <div>
          <Label>Supplier *</Label>
          <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Order Date</Label>
          <Input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
          />
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={(v: string) => setStatus(v as PurchaseOrderStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PURCHASE_ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Items Section --- */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            Add Item
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center border border-dashed rounded-md py-6 text-muted-foreground">
            No items added yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Line Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={item.product_id}
                      onValueChange={(value) => {
                        updateItem(index, 'product_id', value);
                        const product = products.find((p) => p.id === value);
                        if (product?.selling_price) {
                          updateItem(index, 'unit_price', product.selling_price);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      min={1}
                      onChange={(e) =>
                        updateItem(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) =>
                        updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${item.line_total.toFixed(2)}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* --- Total + Actions --- */}
      <div className="flex justify-between items-center bg-muted p-4 rounded-lg">
        <span className="font-medium">Total:</span>
        <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
        </Button>
      </div>
    </form>
  );
}
