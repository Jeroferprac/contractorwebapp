import { BASE_URL } from './api';

const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

async function fetchWithError(url: string) {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return res.json();
}

export const getProducts = () => fetchWithError(`${API_BASE}/products`);
// export const getLowStockProducts = () => fetchWithError(`${API_BASE}/products/low-stock`);
export const getSuppliers = () => fetchWithError(`${API_BASE}/suppliers`);

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
  return res.json();
};

// Add more as needed...

