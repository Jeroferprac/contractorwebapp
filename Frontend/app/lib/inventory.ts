import { BASE_URL } from './api';

const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

// --- Types ---
export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string;
  brand?: string;
  unit?: string;
  current_stock: number;
  min_stock_level: number;
  cost_price?: number;
  selling_price?: number;
  description?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: number;
  created_at: string;
}

export interface ProductSupplier {
  id: string;
  product_id: string;
  supplier_id: string;
  supplier_price?: number;
  lead_time_days?: number;
  min_order_qty?: number;
  is_preferred?: boolean;
  created_at: string;
  product?: Product;
  supplier?: Supplier;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
  product?: Product;
}

export interface Sale {
  id: string;
  customer_name?: string;
  sale_date: string;
  total_amount: number;
  status: string;
  notes?: string;
  created_at: string;
  items: SaleItem[];
}

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  received_qty: number;
  created_at: string;
  product?: Product;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  po_number?: string;
  order_date: string;
  total_amount: number;
  status: string;
  created_at: string;
  supplier?: Supplier;
  items: PurchaseOrderItem[];
}

// --- Create/Update Types ---
export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'current_stock'> & {
  current_stock?: number;
  min_stock_level?: number; // <-- made optional to fix type error
};
export type UpdateProductData = Partial<CreateProductData>;

export type CreateSupplierData = Omit<Supplier, 'id' | 'created_at'>;
export type UpdateSupplierData = Partial<CreateSupplierData>; // <-- fixed no-empty-object-type

export type CreateProductSupplierData = Omit<ProductSupplier, 'id' | 'created_at' | 'product' | 'supplier'>;
export type UpdateProductSupplierData = Partial<CreateProductSupplierData>;

export interface CreateSaleData {
  customer_name?: string;
  sale_date?: string;
  total_amount: number;
  status?: string;
  notes?: string;
  items: CreateSaleItemData[];
}
export interface CreateSaleItemData {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}
export type UpdateSaleData = Partial<CreateSaleData>;

export interface CreatePurchaseOrderData {
  supplier_id: string;
  po_number?: string;
  order_date?: string;
  total_amount: number;
  status?: string;
  items: CreatePurchaseOrderItemData[];
}
export interface CreatePurchaseOrderItemData {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  received_qty?: number;
}
export type UpdatePurchaseOrderData = Partial<CreatePurchaseOrderData>;

// --- Helper for fetch with error handling ---
async function fetchWithError(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

// --- Product APIs ---
export const getProducts = async (): Promise<Product[]> =>
  fetchWithError(`${API_BASE}/products`);

export const getProduct = async (id: string): Promise<Product> =>
  fetchWithError(`${API_BASE}/products/${id}`);

export const createProduct = async (data: CreateProductData): Promise<Product> =>
  fetchWithError(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> =>
  fetchWithError(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteProduct = async (id: string): Promise<void> =>
  fetchWithError(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });

export const getLowStockProducts = async (): Promise<Product[]> =>
  fetchWithError(`${API_BASE}/products/low-stock`);

// --- Supplier APIs ---
export const getSuppliers = async (): Promise<Supplier[]> =>
  fetchWithError(`${API_BASE}/suppliers`);

export const getSupplier = async (id: string): Promise<Supplier> =>
  fetchWithError(`${API_BASE}/suppliers/${id}`);

export const createSupplier = async (data: CreateSupplierData): Promise<Supplier> =>
  fetchWithError(`${API_BASE}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateSupplier = async (id: string, data: UpdateSupplierData): Promise<Supplier> =>
  fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteSupplier = async (id: string): Promise<void> =>
  fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: "DELETE",
  });

// --- ProductSupplier APIs ---
export const getProductSuppliers = async (): Promise<ProductSupplier[]> =>
  fetchWithError(`${API_BASE}/product-suppliers`);

export const getProductSupplier = async (id: string): Promise<ProductSupplier> =>
  fetchWithError(`${API_BASE}/product-suppliers/${id}`);

export const createProductSupplier = async (data: CreateProductSupplierData): Promise<ProductSupplier> =>
  fetchWithError(`${API_BASE}/product-suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateProductSupplier = async (id: string, data: UpdateProductSupplierData): Promise<ProductSupplier> =>
  fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const deleteProductSupplier = async (id: string): Promise<void> =>
  fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
    method: "DELETE",
  });

// --- Sales APIs ---
export const getSales = async (): Promise<Sale[]> =>
  fetchWithError(`${API_BASE}/sales`);

export const getSale = async (id: string): Promise<Sale> =>
  fetchWithError(`${API_BASE}/sales/${id}`);

export const createSale = async (data: CreateSaleData): Promise<Sale> =>
  fetchWithError(`${API_BASE}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updateSale = async (id: string, data: UpdateSaleData): Promise<Sale> =>
  fetchWithError(`${API_BASE}/sales/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const getSalesSummary = async (): Promise<{ total_sales: number; total_revenue: number; latest_sale: string | null }> =>
  fetchWithError(`${API_BASE}/sales/summary`);

// --- Purchase Orders APIs ---
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> =>
  fetchWithError(`${API_BASE}/purchase-orders`);

export const getPurchaseOrder = async (id: string): Promise<PurchaseOrder> =>
  fetchWithError(`${API_BASE}/purchase-orders/${id}`);

export const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> =>
  fetchWithError(`${API_BASE}/purchase-orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

export const updatePurchaseOrder = async (id: string, data: UpdatePurchaseOrderData): Promise<PurchaseOrder> =>
  fetchWithError(`${API_BASE}/purchase-orders/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

// No DELETE for purchase orders as per your API

