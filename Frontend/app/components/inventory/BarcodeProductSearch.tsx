'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProductByBarcode } from '@/lib/hooks/useProductByBarcode';
import type { Product } from '@/types/inventory';

export default function BarcodeProductSearch() {
  const [barcode, setBarcode] = useState('');
  const { product, loading, error, fetchProduct } = useProductByBarcode();

  const handleBarcodeSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode) fetchProduct(barcode);
  };

  return (
    <Card className="mb-6 p-4">
      <form onSubmit={handleBarcodeSearch} className="flex gap-2 items-end">
        <Input
          placeholder="Enter barcode"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          className="w-64"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {product && <ProductDetails product={product} />}
    </Card>
  );
}

// Helper component to display product details
function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="mt-4 space-y-1">
      <div className="font-semibold">Product Found:</div>
      <div><b>Name:</b> {product.name}</div>
      <div><b>SKU:</b> {product.sku}</div>
      <div><b>Barcode:</b> {product.barcode}</div>
      <div><b>Category:</b> {product.category}</div>
      <div><b>Brand:</b> {product.brand}</div>
      <div><b>Unit:</b> {product.unit}</div>
      <div><b>Current Stock:</b> {product.current_stock}</div>
      <div><b>Min Stock Level:</b> {product.min_stock_level}</div>
      <div><b>Reorder Point:</b> {product.reorder_point}</div>
      <div><b>Max Stock Level:</b> {product.max_stock_level}</div>
      <div><b>Cost Price:</b> {product.cost_price}</div>
      <div><b>Selling Price:</b> {product.selling_price}</div>
      <div><b>Description:</b> {product.description}</div>
      <div><b>Weight:</b> {product.weight}</div>
      <div><b>Dimensions:</b> {product.dimensions}</div>
      <div><b>Active:</b> {product.is_active ? 'Yes' : 'No'}</div>
      <div><b>Track Serial:</b> {product.track_serial ? 'Yes' : 'No'}</div>
      <div><b>Track Batch:</b> {product.track_batch ? 'Yes' : 'No'}</div>
      <div><b>Composite:</b> {product.is_composite ? 'Yes' : 'No'}</div>
      <div><b>Created At:</b> {product.created_at}</div>
      <div><b>Updated At:</b> {product.updated_at}</div>
    </div>
  );
} 