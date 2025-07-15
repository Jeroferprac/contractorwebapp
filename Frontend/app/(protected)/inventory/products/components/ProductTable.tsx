"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // If you have a classnames util, otherwise remove
import SupplierPricingComparison from "../../suppliers/components/SupplierPricingComparison";

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
  products: Product[]
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onAdjust?: (product: Product, data: { quantity: number; notes: string; transaction_type: 'inbound' | 'outbound' }) => void;
}

export function ProductTable({ products, onEdit, onDelete, onAdjust }: ProductTableProps) {
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustNotes, setAdjustNotes] = useState("");
  const [adjustType, setAdjustType] = useState<'inbound' | 'outbound'>('inbound');
  const [adjustLoading, setAdjustLoading] = useState(false);
  const [compareProductId, setCompareProductId] = useState<string | null>(null);

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

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Product List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">SKU</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Brand</th>
                <th className="py-3 px-4 text-left">Unit</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4 text-right">Min Stock</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4">{p.sku}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">{p.brand}</td>
                  <td className="py-3 px-4">{p.unit}</td>
                  <td className="py-3 px-4 text-right">{p.current_stock}</td>
                  <td className="py-3 px-4 text-right">{p.min_stock_level}</td>
                  <td className="py-3 px-4 text-right">{p.cost_price}</td>
                  <td className="py-3 px-4 text-right">{p.selling_price}</td>
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit && onEdit(p)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete && onDelete(p)}>Delete</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAdjustModal(p)}>Adjust</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setCompareProductId(p.id)}>Compare Prices</DropdownMenuItem>
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
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-3">
                {/* No image field, so use a placeholder */}
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-lg">{product.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.sku} • {product.category}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium">{product.selling_price}</span>
                    <Badge variant="secondary">Stock: {product.current_stock}</Badge>
                  </div>
                </div>
                {/* Actions dropdown for mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit && onEdit(product)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete && onDelete(product)}>Delete</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openAdjustModal(product)}>Adjust</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCompareProductId(product.id)}>Compare Prices</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>

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
      </CardContent>
    </Card>
  )
}
