'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { PurchaseOrder } from '@/types/inventory';
import type { PurchaseOrderItem } from '@/types/inventory';
import { getPurchaseOrder } from '@/lib/inventory';

export default function PurchaseOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    if (id) {
      getPurchaseOrder(id as string).then(setOrder);
    }
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Purchase Order Details</h1>
      <div><strong>PO Number:</strong> {order.po_number}</div>
      <div><strong>Supplier:</strong> {order.supplier?.name || order.supplier_id}</div>
      <div><strong>Date:</strong> {order.order_date}</div>
      <div><strong>Status:</strong> {order.status}</div>
      <div><strong>Total Amount:</strong> {order.total_amount}</div>
      <h2 className="text-xl font-semibold mt-6 mb-2">Items</h2>
      <ul>
        {order.items.map((item: PurchaseOrderItem) => (
          <li key={item.id}>
            Product: {item.product_id}, Quantity: {item.quantity}, Unit Price: {item.unit_price}, Line Total: {item.line_total}
          </li>
        ))}
      </ul>
    </div>
  );
}
