import { BASE_URL } from './api';
import type {
  Product,
  Supplier,
  ProductSupplier,
  Sale,
  PurchaseOrder,
  CreateProductData,
  UpdateProductData,
  CreateSupplierData,
  UpdateSupplierData,
  CreateProductSupplierData,
  UpdateProductSupplierData,
  CreateSaleData,
  UpdateSaleData,
  CreatePurchaseOrderData,
  UpdatePurchaseOrderData,
} from "@/types/inventory";

const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

async function fetchWithError(url: string, options: RequestInit = {}) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

// --- Product APIs ---
export const getProducts = () => fetchWithError(`${API_BASE}/products`);
export const getLowStockProducts = () => fetchWithError(`${API_BASE}/products/low-stock`);
export const getProduct = (id: string) => fetchWithError(`${API_BASE}/products/${id}`);

export const createProduct = (data: any) =>
  fetchWithError(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateProduct = (id: string, data: any) =>
  fetchWithError(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteProduct = (id: string) =>
  fetchWithError(`${API_BASE}/products/${id}`, { method: 'DELETE' });

// --- Supplier APIs ---
export const getSuppliers = () => fetchWithError(`${API_BASE}/suppliers`);
export const getSupplier = (id: string) => fetchWithError(`${API_BASE}/suppliers/${id}`);

export const createSupplier = (data: any) =>
  fetchWithError(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateSupplier = (id: string, data: any) =>
  fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });


export const deleteSupplier = async (id: string) => {
  return fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: "DELETE",

  });
};


// --- ProductSupplier APIs ---
export const getProductSuppliers = () => fetchWithError(`${API_BASE}/product-suppliers`);

export const createProductSupplier = (data: any) =>
  fetchWithError(`${API_BASE}/product-suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateProductSupplier = (id: string, data: any) =>
  fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteProductSupplier = (id: string) =>
  fetchWithError(`${API_BASE}/product-suppliers/${id}`, { method: 'DELETE' });

// --- Sales APIs ---
export const getSales = () => fetchWithError(`${API_BASE}/sales`);
export const getSale = (id: string) => fetchWithError(`${API_BASE}/sales/${id}`);
export const createSale = (data: any) =>
  fetchWithError(`${API_BASE}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateSale = (id: string, data: any) =>
  fetchWithError(`${API_BASE}/sales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const getSalesSummary = () => fetchWithError(`${API_BASE}/sales/summary`);
export const getSalesMonthlySummary = () => fetchWithError(`${API_BASE}/sales/summary/monthly`);
export const getSalesSummaryByCustomer = () => fetchWithError(`${API_BASE}/sales/summary/by-customer`);
export const getSalesSummaryByProduct = () => fetchWithError(`${API_BASE}/sales/summary/by-product`);
export const getSalesDetailsByPeriod = (start: string, end: string) =>
  fetchWithError(`${API_BASE}/sales/details/by-period?start_date=${start}&end_date=${end}`);

// --- Inventory & Transactions ---
export const getInventorySummary = () => fetchWithError(`${API_BASE}/reports`);
export const getInventoryTransactions = () => fetchWithError(`${API_BASE}/transactions`);

export const adjustInventory = (
  product_id: string,
  quantity: number,
  notes: string,
  transaction_type: 'inbound' | 'outbound'
) =>
  fetchWithError(`${API_BASE}/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id, quantity, notes, transaction_type }),
  });

// --- Purchase Summary ---
export const getPurchaseSummaryBySupplier = () => fetchWithError(`${API_BASE}/purchase/summary/by-supplier`);
export const getPurchaseSummaryByProduct = () => fetchWithError(`${API_BASE}/purchase/summary/by-product`);

// --- Purchase Orders APIs ---
export const getPurchaseOrders = () => fetchWithError(`${API_BASE}/purchase-orders`);
export const getPurchaseOrder = (id: string) => fetchWithError(`${API_BASE}/purchase-orders/${id}`);
export const createPurchaseOrder = (data: any) =>
  fetchWithError(`${API_BASE}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
export const updatePurchaseOrder = (id: string, data: any) =>
  fetchWithError(`${API_BASE}/purchase-orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });


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

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  received_qty: number;
  created_at: string;
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

export interface CreatePurchaseOrderData {
  supplier_id: string;
  po_number?: string;
  order_date?: string;
  total_amount: number;
  status?: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    received_qty?: number;
  }[];
}

export type UpdatePurchaseOrderData = Partial<CreatePurchaseOrderData>;
