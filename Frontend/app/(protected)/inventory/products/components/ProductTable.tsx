"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import SupplierPricingComparison from "../../suppliers/components/SupplierPricingComparison";
import "react-swipeable-list/dist/styles.css";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  current_stock: string;
  min_stock_level: string;
  cost_price: string;
  selling_price: string;
  description: string;
  created_at: string;
}

interface ProductTableProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onAdjust?: (product: Product, data: { quantity: number; notes: string; transaction_type: 'inbound' | 'outbound' }) => void;
  headerRight?: React.ReactNode;
}

export function ProductTable({ products, onEdit, onDelete, onAdjust, headerRight }: ProductTableProps) {
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNotes, setAdjustNotes] = useState("");
  const [adjustType, setAdjustType] = useState<'inbound' | 'outbound'>('inbound');
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [compareProductId, setCompareProductId] = useState<string | null>(null);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [openActionsRow, setOpenActionsRow] = useState<string | null>(null);
  const actionsMenuRef = useRef<HTMLDivElement | null>(null);
  // Remove hoveredActionRow state

  // Click outside to close actions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        actionsMenuRef.current &&
        !actionsMenuRef.current.contains(event.target as Node)
      ) {
        setOpenActionsRow(null);
      }
    }
    if (openActionsRow) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openActionsRow]);

  function openAdjustModal(product: Product) {
    setAdjustProduct(product);
    setAdjustQty(0);
    setAdjustNotes("");
    setAdjustType('inbound');
  }

  function handleAdjust() {
    if (!adjustProduct) return;
    setAdjustLoading(true);
    onAdjust && onAdjust(adjustProduct, { quantity: adjustQty, notes: adjustNotes, transaction_type: adjustType });
    setAdjustLoading(false);
    setAdjustProduct(null);
  }

  const formatCurrency = (value: string | number) =>
    Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 });

  // Add state for expanded card
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <>
      {/* If you want a header, render it in the parent (page.tsx) */}
      {/* {headerRight && <div className="flex gap-2 items-center w-full md:w-auto justify-end">{headerRight}</div>} */}
      <DataTable
        columns={columns({
          onEdit: onEdit ?? (() => {}),
          onDelete: onDelete ?? (() => {}),
          onAdjust: openAdjustModal,
          setCompareProductId: setCompareProductId,
        })}
        data={products}
        handlers={{
          onEdit: onEdit ?? (() => {}),
          onDelete: onDelete ?? (() => {}),
          onAdjust: openAdjustModal,
          setCompareProductId: setCompareProductId,
        }}
      />
      {/* Adjustment Modal */}
      <Dialog open={!!adjustProduct} onOpenChange={() => setAdjustProduct(null)}>
        <DialogContent className="sm:max-w-md w-full max-w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
          </DialogHeader>
          {adjustProduct && (
            <div className="space-y-4">
              <div className="text-sm text-gray-700">Product: <span className="font-medium">{adjustProduct.name}</span> (SKU: {adjustProduct.sku})</div>
              <div>
                <label className="block text-xs font-medium mb-1">Adjustment Quantity</label>
                <Input
                  type="number"
                  value={adjustQty}
                  onChange={e => setAdjustQty(Number(e.target.value))}
                  className="w-full"
                  placeholder="Enter quantity (e.g. -5 or 10)"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Transaction Type</label>
                <select
                  className="border rounded-md px-3 h-10 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={adjustType}
                  onChange={e => setAdjustType(e.target.value as 'inbound' | 'outbound')}
                >
                  <option value="inbound">Inbound (Add Stock)</option>
                  <option value="outbound">Outbound (Remove Stock)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Reason/Notes</label>
                <Input
                  type="text"
                  value={adjustNotes}
                  onChange={e => setAdjustNotes(e.target.value)}
                  className="w-full"
                  placeholder="Reason for adjustment"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <Button variant="outline" onClick={() => setAdjustProduct(null)} className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleAdjust} disabled={adjustLoading || adjustQty === 0} className="w-full sm:w-auto">
                  {adjustLoading ? <span className="spinner-class" /> : "Adjust"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Supplier Pricing Comparison Modal */}
      <Dialog open={!!compareProductId} onOpenChange={() => setCompareProductId(null)}>
        <DialogContent className="max-w-lg w-full">
          <DialogTitle>Supplier Pricing Comparison</DialogTitle>
          {compareProductId && (
            <SupplierPricingComparison productId={compareProductId} onClose={() => setCompareProductId(null)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
