import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export interface PriceList {
  id: string;
  name: string;
  description?: string;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CreatePriceListData {
  name: string;
  description?: string;
  currency: string;
  is_active: boolean;
}

export interface UpdatePriceListData {
  name?: string;
  description?: string;
  currency?: string;
  is_active?: boolean;
}

// Fetch all price lists
export async function getPriceLists(): Promise<PriceList[]> {
  const session = await getSession();
  const token = session?.user?.backendToken;
  
  if (!token) {
    throw new Error("No authentication token");
  }

  console.log('🔍 Fetching price lists from:', `${BASE_URL}/api/v1/price-lists`);
  console.log(' Token:', token);

  const response = await fetch(`${BASE_URL}/api/v1/price-lists`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log(' Response status:', response.status);
  console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('❌ API Error:', errorData);
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Price lists data:', data);
  
  // Handle different response formats
  if (Array.isArray(data)) {
    return data;
  } else if (data.items && Array.isArray(data.items)) {
    return data.items;
  } else if (data.data && Array.isArray(data.data)) {
    return data.data;
  } else {
    console.warn('⚠️ Unexpected response format:', data);
    return [];
  }
}

// Create a new price list
export async function createPriceList(priceListData: CreatePriceListData): Promise<PriceList> {
  const session = await getSession();
  const token = session?.user?.backendToken;
  
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${BASE_URL}/api/v1/price-lists`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priceListData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Update a price list
export async function updatePriceList(id: string, priceListData: UpdatePriceListData): Promise<PriceList> {
  const session = await getSession();
  const token = session?.user?.backendToken;
  
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${BASE_URL}/api/v1/price-lists/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priceListData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Delete a price list
export async function deletePriceList(id: string): Promise<void> {
  const session = await getSession();
  const token = session?.user?.backendToken;
  
  if (!token) {
    throw new Error("No authentication token");
  }

  const response = await fetch(`${BASE_URL}/api/v1/price-lists/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
} 