
import { useState, useEffect } from "react";
import { getSuppliers, createProductSupplier, updateProductSupplier } from "@/lib/inventory";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Supplier {
  id: string;
  name: string;
}

interface SupplierPriceFormData {
  supplier_id: string;
  supplier_price: string;
  lead_time_days: string;
  min_order_qty: string;
  is_preferred: boolean;
  notes: string;
  id?: string;
}

interface SupplierPriceFormProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  initialData?: SupplierPriceFormData;
  onSaved: () => void;
}

export default function SupplierPriceForm({
  open,
  onClose,
  productId,
  initialData,
  onSaved,
}: SupplierPriceFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState<SupplierPriceFormData>(
    initialData || {
      supplier_id: "",
      supplier_price: "",
      lead_time_days: "",
      min_order_qty: "",
      is_preferred: false,
      notes: "",
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" && "checked" in e.target ? (e.target as HTMLInputElement).checked : undefined;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked ?? false : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData && initialData.id) {
        await updateProductSupplier(initialData.id, { ...form, product_id: productId });
      } else {
        await createProductSupplier({ ...form, product_id: productId });
      }
      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{initialData ? "Edit Supplier Price" : "Add Supplier Price"}</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="supplier_id" value={form.supplier_id} onChange={handleChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <Input name="supplier_price" value={form.supplier_price} onChange={handleChange} placeholder="Price" required />
          <Input name="lead_time_days" value={form.lead_time_days} onChange={handleChange} placeholder="Lead Time (days)" type="number" />
          <Input name="min_order_qty" value={form.min_order_qty} onChange={handleChange} placeholder="Min Order Qty" />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="is_preferred" checked={form.is_preferred} onChange={handleChange} />
            Preferred Supplier
          </label>
          <Input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
