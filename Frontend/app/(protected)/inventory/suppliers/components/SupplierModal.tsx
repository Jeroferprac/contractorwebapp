"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SupplierFormData {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  payment_terms?: number;
}

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupplierFormData) => void;
  initialData?: SupplierFormData | null;
  loading?: boolean;
}

export function SupplierModal({ open, onClose, onSubmit, initialData, loading }: SupplierModalProps) {
  const [form, setForm] = useState<SupplierFormData>({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    payment_terms: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) setForm(initialData);
    else setForm({ name: "", contact_person: "", email: "", phone: "", address: "", payment_terms: undefined });
    setError(null);
  }, [initialData, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "payment_terms" ? Number(value) : value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.contact_person || !form.email || !form.phone) {
      setError("All fields except address/payment terms are required.");
      return;
    }
    setError(null);
    onSubmit(form);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Supplier Name" required disabled={loading} />
          <Input name="contact_person" value={form.contact_person} onChange={handleChange} placeholder="Contact Person" required disabled={loading} />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required disabled={loading} />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required disabled={loading} />
          <Input name="address" value={form.address || ""} onChange={handleChange} placeholder="Address (optional)" disabled={loading} />
          <Input name="payment_terms" value={form.payment_terms ?? ""} onChange={handleChange} placeholder="Payment Terms (optional)" type="number" min={0} disabled={loading} />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600" disabled={loading}>
              {loading ? "Saving..." : initialData ? "Save Changes" : "Add Supplier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 