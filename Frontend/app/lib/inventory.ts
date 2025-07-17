import { BASE_URL } from './api';

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

export const createProduct = async (data: any) => {
  return fetchWithError(`${API_BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateProduct = async (id: string, data: any) => {
  return fetchWithError(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteProduct = async (id: string) => {
  return fetchWithError(`${API_BASE}/products/${id}`, {
    method: "DELETE",
  });
};

// --- Supplier APIs ---
export const getSuppliers = () => fetchWithError(`${API_BASE}/suppliers`);
export const getSupplier = (id: string) => fetchWithError(`${API_BASE}/suppliers/${id}`);

export const createSupplier = async (data: any) => {
  return fetchWithError(`${API_BASE}/suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateSupplier = async (id: string, data: any) => {
  return fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteSupplier = async (id: string) => {
  return fetchWithError(`${API_BASE}/suppliers/${id}`, {
    method: "DELETE",

  });
};

// --- ProductSupplier APIs ---
export const getProductSuppliers = () => fetchWithError(`${API_BASE}/product-suppliers`);
export const createProductSupplier = async (data: any) => {
  return fetchWithError(`${API_BASE}/product-suppliers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateProductSupplier = async (id: string, data: any) => {
  return fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteProductSupplier = async (id: string) => {
  return fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
    method: "DELETE",
  });
};

// --- Inventory & Transactions ---
export const getInventorySummary = () => fetchWithError(`${API_BASE}/reports`);
export const getInventoryTransactions = () => fetchWithError(`${API_BASE}/transactions`);

export const adjustInventory = async (
  product_id: string,
  quantity: number,
  notes: string,
  transaction_type: 'inbound' | 'outbound'
) => {
  return fetchWithError(`${API_BASE}/adjust`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id, quantity, notes, transaction_type }),
  });
};

// --- Sales APIs ---
export const getSales = () => fetchWithError(`${API_BASE}/sales`);
export const getSale = (id: string) => fetchWithError(`${API_BASE}/sales/${id}`);

export const createSale = async (data: any) => {
  return fetchWithError(`${API_BASE}/sales`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateSale = async (id: string, data: any) => {
  return fetchWithError(`${API_BASE}/sales/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const getSalesSummary = () => fetchWithError(`${API_BASE}/sales/summary`);
export const getSalesMonthlySummary = () => fetchWithError(`${API_BASE}/sales/summary/monthly`);
export const getSalesSummaryByCustomer = () => fetchWithError(`${API_BASE}/sales/summary/by-customer`);
export const getSalesSummaryByProduct = () => fetchWithError(`${API_BASE}/sales/summary/by-product`);
export const getSalesDetailsByPeriod = (startDate: string, endDate: string) =>
  fetchWithError(`${API_BASE}/sales/details/by-period?start_date=${startDate}&end_date=${endDate}`);

// --- Purchase Summary ---
export const getPurchaseSummaryBySupplier = () => fetchWithError(`${API_BASE}/purchase/summary/by-supplier`);
export const getPurchaseSummaryByProduct = () => fetchWithError(`${API_BASE}/purchase/summary/by-product`);
