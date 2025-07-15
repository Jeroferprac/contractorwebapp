import { BASE_URL } from './api';
const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

async function fetchWithError(url: string) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export const getProducts = () => fetchWithError(`${API_BASE}/products`);
export const getLowStockProducts = () => fetchWithError(`${API_BASE}/products/low-stock`);
export const getSuppliers = () => fetchWithError(`${API_BASE}/suppliers`);
export const getProductSuppliers = () =>
  fetchWithError(`${API_BASE}/product-suppliers`);

export const createProduct = async (data: any) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
};

export const createSupplier = async (data: any) => {
  const res = await fetch(`${API_BASE}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add supplier");
  return res.json();
};

export const updateSupplier = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update supplier");
  return res.json();
};

export const deleteSupplier = async (id: string) => {
  const res = await fetch(`${API_BASE}/suppliers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete supplier");
  return res.json();
};

export const getSupplier = (id: string) => fetchWithError(`${API_BASE}/suppliers/${id}`);

export const updateProduct = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id: string) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  // Only parse JSON if there is content
  if (res.status !== 204) {
    return res.json();
  }
  return;
};

// --- SALES API LOGIC ---

// List Sales
export const getSales = () => fetchWithError(`${API_BASE}/sales`);

// Create Sale
export const createSale = async (data: any) => {
  const res = await fetch(`${API_BASE}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create sale");
  return res.json();
};

// Sales Summary
export const getSalesSummary = () => fetchWithError(`${API_BASE}/sales/summary`);

// Get Sale by ID
export const getSale = (id: string) => fetchWithError(`${API_BASE}/sales/${id}`);

// Update Sale by ID
export const updateSale = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/sales/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update sale");
  return res.json();
};

export const getInventoryTransactions = () =>
  fetchWithError(`${API_BASE}/transactions`);

export const adjustInventory = async (product_id: string, quantity: number, notes: string, transaction_type: 'inbound' | 'outbound') => {
  const res = await fetch(`${API_BASE}/adjust`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, quantity, notes, transaction_type }),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to adjust inventory");
  return res.json();
};

export const createProductSupplier = async (data: any) => {
  const res = await fetch(`${API_BASE}/product-suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to add product supplier");
  return res.json();
};

export const updateProductSupplier = async (id: string, data: any) => {
  const res = await fetch(`${API_BASE}/product-suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update product supplier");
  return res.json();
};

export const deleteProductSupplier = async (id: string) => {
  const res = await fetch(`${API_BASE}/product-suppliers/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete product supplier");
  return res.json();
};

export const getInventorySummary = () =>
  fetchWithError(`${API_BASE}/reports`);


