"use client";

import { useState } from "react";
import { createSupplier } from "@/lib/inventory";
import { SupplierCreate } from "@/types/inventory";

export function SupplierModal({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<SupplierCreate>({ name: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createSupplier(form);
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Supplier Name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create"}
      </button>
    </form>
  );
} 