'use client';
import { useEffect, useState } from "react";
import { getProductSuppliers, getSuppliers, deleteProductSupplier } from "@/lib/inventory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SupplierPriceForm from "./SupplierPriceForm";
import { Button } from "@/components/ui/button";

type Supplier = {
  id: string;
  name: string;
};

type ProductSupplier = {
  id: string;
  product_id: string;
  supplier_id: string;
  supplier_price: number | string;
  notes?: string;
};

interface SupplierPricingComparisonProps {
  productId: string;
  onClose?: () => void;
}

export default function SupplierPricingComparison({ productId, onClose }: SupplierPricingComparisonProps) {
  const [data, setData] = useState<ProductSupplier[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editData, setEditData] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function refreshData() {
    setLoading(true);
    Promise.all([getProductSuppliers(), getSuppliers()])
      .then(([productSuppliers, allSuppliers]) => {
        setSuppliers(allSuppliers);
        setData((productSuppliers as ProductSupplier[]).filter((ps) => ps.product_id === productId));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line
  }, [productId]);

  function getSupplierName(supplierId: string) {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : supplierId;
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this supplier price?")) return;
    setDeletingId(id);
    try {
      await deleteProductSupplier(id);
      refreshData();
    } catch (e) {
      alert("Failed to delete supplier price");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) return <div className="p-4">Loading supplier prices...</div>;
  if (!data.length) return (
    <div className="p-4">
      <Button className="mb-4" onClick={() => { setEditData(null); setFormOpen(true); }}>
        Add Supplier Price
      </Button>
      No supplier pricing data for this product.
      <SupplierPriceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        productId={productId}
        initialData={editData}
        onSaved={refreshData}
      />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supplier Pricing Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="mb-4" onClick={() => { setEditData(null); setFormOpen(true); }}>
          Add Supplier Price
        </Button>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left p-2">Supplier</th>
              <th className="text-left p-2">Price</th>
              <th className="text-left p-2">Other Info</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((ps) => (
              <tr key={ps.id}>
                <td className="p-2">{getSupplierName(ps.supplier_id)}</td>
                <td className="p-2">₹{ps.supplier_price}</td>
                <td className="p-2">{ps.notes || "-"}</td>
                <td className="p-2">
                  <Button size="sm" variant="outline" className="mr-2" onClick={() => { setEditData(ps); setFormOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(ps.id)} disabled={deletingId === ps.id}>
                    {deletingId === ps.id ? "Deleting..." : "Delete"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <SupplierPriceForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          productId={productId}
          initialData={editData}
          onSaved={refreshData}
        />
        {onClose && (
          <button className="mt-4 px-4 py-2 bg-gray-200 rounded" onClick={onClose}>
            Close
          </button>
        )}
      </CardContent>
    </Card>
  );
}
