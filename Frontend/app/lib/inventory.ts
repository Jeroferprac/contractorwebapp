import { BASE_URL } from './api';
import type {
  CreateProductData,
  CreateSupplierData,
  CreateSaleData,
  CreatePurchaseOrderData,
  Product,
  ProductFormData,
} from "@/types/inventory";

// Correct API base
const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

// --- Product APIs ---
export const getProducts = () => fetch(`${API_BASE}/products`).then(res => res.json());
export const createProduct = (data: CreateProductData) =>
  fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getLowStockProducts = () => fetch(`${API_BASE}/products/low-stock`).then(res => res.json());
export const getProductByBarcode = (barcode: string) =>
  fetch(`${API_BASE}/products/barcode/${barcode}`).then(res => res.json());
export const bulkUpdateProducts = (data: Record<string, unknown>) =>
  fetch(`${API_BASE}/products/bulk-update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getCategories = () => fetch(`${API_BASE}/products/categories`).then(res => res.json());
export const getProductStock = (id: string) =>
  fetch(`${API_BASE}/products/${id}/stock`).then(res => res.json());
export const getProduct = (id: string) => fetch(`${API_BASE}/products/${id}`).then(res => res.json());
export const updateProduct = (id: string, data: CreateProductData) =>
  fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const deleteProduct = (id: string) =>
  fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' }).then(res => res.json());

// --- Supplier APIs ---
export const getSuppliers = () => fetch(`${API_BASE}/suppliers`).then(res => res.json());
export const createSupplier = (data: CreateSupplierData) =>
  fetch(`${API_BASE}/suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getSupplier = (id: string) => fetch(`${API_BASE}/suppliers/${id}`).then(res => res.json());
export const updateSupplier = (id: string, data: CreateSupplierData) =>
  fetch(`${API_BASE}/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const deleteSupplier = (id: string) =>
  fetch(`${API_BASE}/suppliers/${id}`, { method: 'DELETE' }).then(res => res.json());

// --- Product Supplier APIs ---
export const getProductSuppliers = () => fetch(`${API_BASE}/product-suppliers`).then(res => res.json());
export const createProductSupplier = (data: Record<string, unknown>) =>
  fetch(`${API_BASE}/product-suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getProductSupplier = (id: string) =>
  fetch(`${API_BASE}/product-suppliers/${id}`).then(res => res.json());
export const updateProductSupplier = (id: string, data: Record<string, unknown>) =>
  fetch(`${API_BASE}/product-suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const deleteProductSupplier = (id: string) =>
  fetch(`${API_BASE}/product-suppliers/${id}`, { method: 'DELETE' }).then(res => res.json());

// --- Sales APIs ---
export const getSales = () => fetch(`${API_BASE}/sales`).then(res => res.json());
export const createSale = (data: CreateSaleData) =>
  fetch(`${API_BASE}/sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getSale = (id: string) => fetch(`${API_BASE}/sales/${id}`).then(res => res.json());
export const updateSale = (id: string, data: CreateSaleData) =>
  fetch(`${API_BASE}/sales/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getSalesSummary = () => fetch(`${API_BASE}/sales/summary`).then(res => res.json());
export const getSalesMonthlySummary = () => fetch(`${API_BASE}/sales/summary/monthly`).then(res => res.json());
export const getSalesSummaryByCustomer = () => fetch(`${API_BASE}/sales/summary/by-customer`).then(res => res.json());
export const getSalesSummaryByProduct = () => fetch(`${API_BASE}/sales/summary/by-product`).then(res => res.json());
export const getSalesDetailsByPeriod = (params: Record<string, unknown>) => {
  const query = new URLSearchParams(params as Record<string, string>).toString();
  return fetch(`${API_BASE}/sales/details/by-period?${query}`).then(res => res.json());
};

// --- Purchase Orders APIs ---
export const getPurchaseOrders = () => fetch(`${API_BASE}/purchase-orders`).then(res => res.json());
export const createPurchaseOrder = (data: CreatePurchaseOrderData) =>
  fetch(`${API_BASE}/purchase-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getPurchaseOrder = (id: string) => fetch(`${API_BASE}/purchase-orders/${id}`).then(res => res.json());
export const updatePurchaseOrder = (id: string, data: CreatePurchaseOrderData) =>
  fetch(`${API_BASE}/purchase-orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());
export const getPurchaseSummaryBySupplier = () => fetch(`${API_BASE}/purchase/summary/by-supplier`).then(res => res.json());
export const getPurchaseSummaryByProduct = () => fetch(`${API_BASE}/purchase/summary/by-product`).then(res => res.json());

// --- Inventory & Transactions ---
export const getInventorySummary = () => fetch(`${API_BASE}/reports`).then(res => res.json());
export const getInventoryTransactions = () => fetch(`${API_BASE}/transactions`).then(res => res.json());
export const getCurrentStockLevels = () => fetch(`${API_BASE}/`).then(res => res.json());
export const adjustInventory = (
  product_id: string,
  quantity: number,
  notes: string,
  transaction_type: 'inbound' | 'outbound'
) =>
  fetch(`${API_BASE}/adjust`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id, quantity, notes, transaction_type }),
  });

