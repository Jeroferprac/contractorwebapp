"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CreateProductData } from "@/lib/inventory";

interface AddProductFormProps {
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
  initialData?: CreateProductData;
  loading?: boolean;
}

export function AddProductForm({ onSubmit, onCancel, initialData, loading }: AddProductFormProps) {
  const [form, setForm] = useState(
    initialData || {
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
    }
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  function validate(currentForm = form) {
    const newErrors: { [key: string]: string } = {};
    if (!currentForm.name.trim()) newErrors.name = "Name is required.";
    if (!currentForm.sku.trim()) newErrors.sku = "SKU is required.";
    if (!String(currentForm.selling_price).trim()) newErrors.selling_price = "Selling price is required.";
    if (currentForm.selling_price && isNaN(Number(currentForm.selling_price))) newErrors.selling_price = "Selling price must be a number.";
    if (currentForm.current_stock && isNaN(Number(currentForm.current_stock))) newErrors.current_stock = "Current stock must be a number.";
    if (currentForm.min_stock_level && isNaN(Number(currentForm.min_stock_level))) newErrors.min_stock_level = "Min stock level must be a number.";
    if (currentForm.cost_price && isNaN(Number(currentForm.cost_price))) newErrors.cost_price = "Cost price must be a number.";
    return newErrors;
  }

  // Real-time validation
  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line
  }, [form]);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Focus the first error field
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorField = document.getElementById(firstErrorKey);
      if (errorField) (errorField as HTMLInputElement).focus();
      return;
    }
    setSubmitting(true);
    try {
      // Convert numeric fields to numbers before submitting
      const payload: CreateProductData = {
        ...form,
        current_stock: form.current_stock ? Number(form.current_stock) : undefined,
        min_stock_level: form.min_stock_level ? Number(form.min_stock_level) : undefined,
        cost_price: form.cost_price ? Number(form.cost_price) : undefined,
        selling_price: form.selling_price ? Number(form.selling_price) : undefined,
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 w-full max-w-2xl mx-auto px-2 sm:px-8 overflow-y-auto max-h-[70vh]"
    >
      <div>
        <label className="block font-medium mb-1" htmlFor="name">
          Name <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-2">(Product name, e.g. &quot;Macbook Pro&quot;)</span>
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
          <span className="text-xs text-gray-400 ml-2">(Unique product code, e.g. &quot;MBP-2023-16&quot;)</span>
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
          <span className="text-xs text-gray-400 ml-2">(e.g. &quot;Bricks&quot;)</span>
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
          <span className="text-xs text-gray-400 ml-2">(e.g. &quot;Ultratech&quot;)</span>
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
          <span className="text-xs text-gray-400 ml-2">(e.g. &quot;pcs&quot;, &quot;kg&quot;, &quot;box&quot;)</span>
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
          <span className="text-xs text-gray-400 ml-2">(How many in stock now)</span>
        </label>
        <Input
          id="current_stock"
          name="current_stock"
          type="number"
          value={form.current_stock}
          onChange={handleChange}
          placeholder="Current Stock"
        />
        {errors.current_stock && <div className="text-red-500 text-sm mt-1">{errors.current_stock}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="min_stock_level">
          Min Stock Level
          <span className="text-xs text-gray-400 ml-2">(Alert if stock falls below this)</span>
        </label>
        <Input
          id="min_stock_level"
          name="min_stock_level"
          type="number"
          value={form.min_stock_level}
          onChange={handleChange}
          placeholder="Min Stock Level"
        />
        {errors.min_stock_level && <div className="text-red-500 text-sm mt-1">{errors.min_stock_level}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="cost_price">
          Cost Price
          <span className="text-xs text-gray-400 ml-2">(What you pay per unit)</span>
        </label>
        <Input
          id="cost_price"
          name="cost_price"
          type="number"
          value={form.cost_price}
          onChange={handleChange}
          placeholder="Cost Price"
        />
        {errors.cost_price && <div className="text-red-500 text-sm mt-1">{errors.cost_price}</div>}
      </div>
      <div>
        <label className="block font-medium mb-1" htmlFor="selling_price">
          Selling Price <span className="text-red-500">*</span>
          <span className="text-xs text-gray-400 ml-2">(What you sell per unit)</span>
        </label>
        <Input
          id="selling_price"
          name="selling_price"
          type="number"
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
          <span className="text-xs text-gray-400 ml-2">(Optional details)</span>
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
        <Button type="submit" disabled={submitting || isInvalid || loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : submitting ? "Adding..." : initialData ? "Save Changes" : "Add Product"}
        </Button>
      </div>
      {/* addError && <div className="text-red-500 text-sm mt-2">{addError}</div> */}
    </form>
  );
}
