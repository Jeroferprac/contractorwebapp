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

// Add more as needed...

