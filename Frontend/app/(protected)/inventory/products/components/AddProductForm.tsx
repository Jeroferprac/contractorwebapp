"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getCategories, createProduct } from "@/lib/inventory";
import type { CreateProductData } from "@/types/inventory";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface AddProductFormProps {
  onCancel: () => void;
  initialData?: Partial<CreateProductData>;
  loading?: boolean;
}

export function AddProductForm({ onCancel, initialData, loading }: Omit<AddProductFormProps, 'onSubmit'>) {
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    sku: initialData?.sku ?? "",
    barcode: initialData?.barcode ?? "",
    category: initialData?.category ?? "",
    brand: initialData?.brand ?? "",
    unit: initialData?.unit ?? "",
    current_stock: initialData?.current_stock !== undefined ? String(initialData.current_stock) : "",
    min_stock_level: initialData?.min_stock_level !== undefined ? String(initialData.min_stock_level) : "",
    reorder_point: initialData?.reorder_point !== undefined ? String(initialData.reorder_point) : "",
    max_stock_level: initialData?.max_stock_level !== undefined ? String(initialData.max_stock_level) : "",
    cost_price: initialData?.cost_price !== undefined ? String(initialData.cost_price) : "",
    selling_price: initialData?.selling_price !== undefined ? String(initialData.selling_price) : "",
    description: initialData?.description ?? "",
    weight: initialData?.weight ?? "",
    dimensions: initialData?.dimensions ?? "",
    is_active: initialData?.is_active ?? true,
    track_serial: initialData?.track_serial ?? false,
    track_batch: initialData?.track_batch ?? false,
    is_composite: initialData?.is_composite ?? false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);
  const [categories, setCategories] = useState<{ category: string; count?: number }[]>([]);

  useEffect(() => {
    getCategories().then((data) => {
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data?.categories) {
        setCategories(data.categories);
      }
    });
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        sku: initialData.sku ?? "",
        barcode: initialData.barcode ?? "",
        category: initialData.category ?? "",
        brand: initialData.brand ?? "",
        unit: initialData.unit ?? "",
        current_stock: initialData.current_stock !== undefined ? String(initialData.current_stock) : "",
        min_stock_level: initialData.min_stock_level !== undefined ? String(initialData.min_stock_level) : "",
        reorder_point: initialData.reorder_point !== undefined ? String(initialData.reorder_point) : "",
        max_stock_level: initialData.max_stock_level !== undefined ? String(initialData.max_stock_level) : "",
        cost_price: initialData.cost_price !== undefined ? String(initialData.cost_price) : "",
        selling_price: initialData.selling_price !== undefined ? String(initialData.selling_price) : "",
        description: initialData.description ?? "",
        weight: initialData.weight ?? "",
        dimensions: initialData.dimensions ?? "",
        is_active: initialData.is_active ?? true,
        track_serial: initialData.track_serial ?? false,
        track_batch: initialData.track_batch ?? false,
        is_composite: initialData.is_composite ?? false,
      });
    }
  }, [initialData]);

  function validate(currentForm = form) {
    const newErrors: { [key: string]: string } = {};
    if (!currentForm.name.trim()) newErrors.name = "Name is required.";
    if (!currentForm.sku.trim()) newErrors.sku = "SKU is required.";
    if (!String(currentForm.selling_price).trim()) newErrors.selling_price = "Selling price is required.";
    if (currentForm.selling_price && isNaN(Number(currentForm.selling_price))) newErrors.selling_price = "Selling price must be a number.";
    if (currentForm.current_stock && isNaN(Number(currentForm.current_stock))) newErrors.current_stock = "Current stock must be a number.";
    if (currentForm.min_stock_level && isNaN(Number(currentForm.min_stock_level))) newErrors.min_stock_level = "Min stock level must be a number.";
    if (currentForm.reorder_point && isNaN(Number(currentForm.reorder_point))) newErrors.reorder_point = "Reorder point must be a number.";
    if (currentForm.max_stock_level && isNaN(Number(currentForm.max_stock_level))) newErrors.max_stock_level = "Max stock level must be a number.";
    if (currentForm.cost_price && isNaN(Number(currentForm.cost_price))) newErrors.cost_price = "Cost price must be a number.";
    return newErrors;
  }

  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  const handleCheckbox = (name: string, checked: boolean) => {
    setForm({ ...form, [name]: checked });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    setApiSuccess(false);
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorField = document.getElementById(firstErrorKey);
      if (errorField) (errorField as HTMLInputElement).focus();
      return;
    }
    setSubmitting(true);
    try {
      const payload: CreateProductData = {
        name: form.name,
        sku: form.sku,
        barcode: form.barcode || undefined,
        category: form.category || undefined,
        brand: form.brand || undefined,
        unit: form.unit || undefined,
        current_stock: form.current_stock !== "" ? Number(form.current_stock) : 0,
        min_stock_level: form.min_stock_level !== "" ? Number(form.min_stock_level) : 0,
        reorder_point: form.reorder_point !== "" ? Number(form.reorder_point) : 0,
        max_stock_level: form.max_stock_level !== "" ? Number(form.max_stock_level) : 0,
        cost_price: form.cost_price !== "" ? Number(form.cost_price) : 0,
        selling_price: form.selling_price !== "" ? Number(form.selling_price) : 0,
        description: form.description || undefined,
        weight: form.weight || undefined,
        dimensions: form.dimensions || undefined,
        is_active: form.is_active,
        track_serial: form.track_serial,
        track_batch: form.track_batch,
        is_composite: form.is_composite,
      };
      await createProduct(payload);
      setApiSuccess(true);
      if (typeof onCancel === "function") onCancel();
    } catch {
      setApiError("Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  }

  const isInvalid = Object.keys(errors).length > 0;

  return (

    <div className="max-h-[70vh] overflow-y-auto">
      <form onSubmit={handleSubmit} id="product-form" className="space-y-8">
        {/* Section: Basic Info */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Basic Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="text-sm h-8 px-2"
              />
              {errors.name && <div className="text-destructive text-xs mt-1">{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="sku" className="block font-medium mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <Input
                id="sku"
                name="sku"
                value={form.sku}
                onChange={handleChange}
                placeholder="SKU"
                required
                className="text-sm h-8 px-2"
              />
              {errors.sku && <div className="text-destructive text-xs mt-1">{errors.sku}</div>}
            </div>
            <div>
              <label htmlFor="barcode" className="block font-medium mb-1">Barcode</label>
              <Input
                id="barcode"
                name="barcode"
                value={form.barcode}
                onChange={handleChange}
                placeholder="Barcode"
                className="text-sm h-8 px-2"
              />
            </div>
            <div>
              <label htmlFor="category" className="block font-medium mb-1">Category</label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger className="text-sm h-8 px-2">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((catObj) => (
                    <SelectItem key={catObj.category} value={catObj.category}>
                      {catObj.category}
                      {typeof catObj.count === "number" ? ` (${catObj.count})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="brand" className="block font-medium mb-1">Brand</label>
              <Input
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Brand"
                className="text-sm h-8 px-2"
              />
            </div>
            <div>
              <label htmlFor="unit" className="block font-medium mb-1">Unit</label>
              <Input
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="Unit"
                className="text-sm h-8 px-2"
              />
            </div>
          </div>
        </div>

        {/* Section: Stock & Pricing */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Stock & Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Stock */}
            <div>
              <label htmlFor="current_stock" className="block font-medium mb-1">Current Stock</label>
              <Input
                id="current_stock"
                name="current_stock"
                type="number"
                value={form.current_stock}
                onChange={handleChange}
                placeholder="Current Stock"
                className="text-sm h-8 px-2"
              />
              {errors.current_stock && <div className="text-destructive text-xs mt-1">{errors.current_stock}</div>}
            </div>
            {/* Min Stock Level */}
            <div>
              <label htmlFor="min_stock_level" className="block font-medium mb-1">Min Stock Level</label>
              <Input
                id="min_stock_level"
                name="min_stock_level"
                type="number"
                value={form.min_stock_level}
                onChange={handleChange}
                placeholder="Min Stock Level"
                className="text-sm h-8 px-2"
              />
              {errors.min_stock_level && <div className="text-destructive text-xs mt-1">{errors.min_stock_level}</div>}
            </div>
            {/* Reorder Point */}
            <div>
              <label htmlFor="reorder_point" className="block font-medium mb-1">Reorder Point</label>
              <Input
                id="reorder_point"
                name="reorder_point"
                type="number"
                value={form.reorder_point}
                onChange={handleChange}
                placeholder="Reorder Point"
                className="text-sm h-8 px-2"
              />
              {errors.reorder_point && <div className="text-destructive text-xs mt-1">{errors.reorder_point}</div>}
            </div>
            {/* Max Stock Level */}
            <div>
              <label htmlFor="max_stock_level" className="block font-medium mb-1">Max Stock Level</label>
              <Input
                id="max_stock_level"
                name="max_stock_level"
                type="number"
                value={form.max_stock_level}
                onChange={handleChange}
                placeholder="Max Stock Level"
                className="text-sm h-8 px-2"
              />
              {errors.max_stock_level && <div className="text-destructive text-xs mt-1">{errors.max_stock_level}</div>}
            </div>
            {/* Cost Price */}
            <div>
              <label htmlFor="cost_price" className="block font-medium mb-1">Cost Price</label>
              <Input
                id="cost_price"
                name="cost_price"
                type="number"
                value={form.cost_price}
                onChange={handleChange}
                placeholder="Cost Price"
                className="text-sm h-8 px-2"
              />
              {errors.cost_price && <div className="text-destructive text-xs mt-1">{errors.cost_price}</div>}
            </div>
            {/* Selling Price */}
            <div>
              <label htmlFor="selling_price" className="block font-medium mb-1">
                Selling Price <span className="text-red-500">*</span>
              </label>
              <Input
                id="selling_price"
                name="selling_price"
                type="number"
                value={form.selling_price}
                onChange={handleChange}
                placeholder="Selling Price"
                required
                className="text-sm h-8 px-2"
              />
              {errors.selling_price && <div className="text-destructive text-xs mt-1">{errors.selling_price}</div>}
            </div>
            {/* Weight */}
            <div>
              <label htmlFor="weight" className="block font-medium mb-1">Weight</label>
              <Input
                id="weight"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="Weight"
                className="text-sm h-8 px-2"
              />
            </div>
            {/* Dimensions */}
            <div>
              <label htmlFor="dimensions" className="block font-medium mb-1">Dimensions</label>
              <Input
                id="dimensions"
                name="dimensions"
                value={form.dimensions}
                onChange={handleChange}
                placeholder="Dimensions"
                className="text-sm h-8 px-2"
              />
            </div>
          </div>
        </div>

        {/* Section: Options */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Options</h2>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={form.is_active}
                onCheckedChange={(checked) => handleCheckbox("is_active", !!checked)}
              />
              <label htmlFor="is_active" className="font-medium text-sm">Active</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="track_serial"
                checked={form.track_serial}
                onCheckedChange={(checked) => handleCheckbox("track_serial", !!checked)}
              />
              <label htmlFor="track_serial" className="font-medium text-sm">Track Serial</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="track_batch"
                checked={form.track_batch}
                onCheckedChange={(checked) => handleCheckbox("track_batch", !!checked)}
              />
              <label htmlFor="track_batch" className="font-medium text-sm">Track Batch</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_composite"
                checked={form.is_composite}
                onCheckedChange={(checked) => handleCheckbox("is_composite", !!checked)}
              />
              <label htmlFor="is_composite" className="font-medium text-sm">Is Composite</label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">Description</label>
          <Textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="text-sm min-h-[32px]"
          />
        </div>

        {/* Errors/Success */}
        {apiError && <div className="text-destructive text-sm mt-2">{apiError}</div>}
        {apiSuccess && <div className="text-green-600 text-sm mt-2">Product added successfully!</div>}

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-2 border-t bg-white dark:bg-background">
          <Button
            type="button"
            variant="outline"
            className="text-sm h-8 px-3"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="product-form"
            className="text-sm h-8 px-3"
            disabled={submitting || isInvalid || loading}
          >
            {loading ? "Saving..." : submitting ? "Adding..." : initialData ? "Save Changes" : "Add Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
