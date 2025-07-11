"use client";
import { useState } from "react";
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface AddProductFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AddProductForm({ onSubmit, onCancel }: AddProductFormProps) {
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    brand: "",
    unit: "",
    current_stock: "",
    min_stock_level: "",
    cost_price: "",
    selling_price: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.sku.trim()) newErrors.sku = "SKU is required.";
    if (!form.selling_price.trim()) newErrors.selling_price = "Selling price is required.";
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      const { [e.target.name]: removed, ...rest } = errors;
      setErrors(rest);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = Object.keys(validate()).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto px-2 sm:px-8 overflow-y-auto max-h-[70vh]"
    >
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="sku">
          SKU <span className="text-red-500">*</span>
        </label>
        <Input
          id="sku"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          required
        />
        {errors.sku && <div className="text-red-500 text-sm mt-1">{errors.sku}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="category">
          Category
        </label>
        <Input
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="brand">
          Brand
        </label>
        <Input
          id="brand"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="unit">
          Unit
        </label>
        <Input
          id="unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="current_stock">
          Current Stock
        </label>
        <Input
          id="current_stock"
          name="current_stock"
          value={form.current_stock}
          onChange={handleChange}
          placeholder="Current Stock"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="min_stock_level">
          Min Stock Level
        </label>
        <Input
          id="min_stock_level"
          name="min_stock_level"
          value={form.min_stock_level}
          onChange={handleChange}
          placeholder="Min Stock Level"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="cost_price">
          Cost Price
        </label>
        <Input
          id="cost_price"
          name="cost_price"
          value={form.cost_price}
          onChange={handleChange}
          placeholder="Cost Price"
        />
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="selling_price">
          Selling Price <span className="text-red-500">*</span>
        </label>
        <Input
          id="selling_price"
          name="selling_price"
          value={form.selling_price}
          onChange={handleChange}
          placeholder="Selling Price"
          required
        />
        {errors.selling_price && <div className="text-red-500 text-sm mt-1">{errors.selling_price}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="description">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" disabled={submitting || isInvalid} className="w-full sm:w-auto">
          {submitting ? "Adding..." : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
