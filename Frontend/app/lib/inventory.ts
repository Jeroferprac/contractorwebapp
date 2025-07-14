import { BASE_URL } from './api';

const API_BASE = `${BASE_URL}/api/v1/inventory`;

// Debug logging
console.log('API_BASE URL:', API_BASE);

// Health check function
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// --- Types (re-exported for use in other files) ---
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

export interface CreateProductData {
  name: string;
  sku: string;
  category?: string;
  brand?: string;
  unit?: string;
  current_stock?: number;
  min_stock_level?: number;
  cost_price?: number;
  selling_price?: number;
  description?: string;
}

export type UpdateProductData = Partial<CreateProductData>;

export interface CreateSupplierData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  payment_terms?: number;
}

export type UpdateSupplierData = Partial<CreateSupplierData>;

export interface CreateProductSupplierData {
  product_id: string;
  supplier_id: string;
  supplier_price?: number;
  lead_time_days?: number;
  min_order_qty?: number;
  is_preferred?: boolean;
}

export interface UpdateProductSupplierData {
  supplier_price?: number;
  lead_time_days?: number;
  min_order_qty?: number;
  is_preferred?: boolean;
}

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

export interface UpdatePurchaseOrderData {
  supplier_id?: string;
  po_number?: string;
  order_date?: string;
  status?: string;
}

// Sample data for when backend is not available
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Sample Product 1',
    sku: 'SP001',
    category: 'Electronics',
    brand: 'Sample Brand',
    unit: 'pcs',
    current_stock: 50,
    min_stock_level: 10,
    cost_price: 25.00,
    selling_price: 35.00,
    description: 'Sample product description',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sample Product 2',
    sku: 'SP002',
    category: 'Tools',
    brand: 'Sample Brand',
    unit: 'pcs',
    current_stock: 30,
    min_stock_level: 5,
    cost_price: 15.00,
    selling_price: 25.00,
    description: 'Another sample product',
    created_at: new Date().toISOString(),
  },
];

const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Sample Supplier 1',
    contact_person: 'John Doe',
    email: 'john@supplier1.com',
    phone: '+1234567890',
    address: '123 Supplier St, City, State',
    payment_terms: 30,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sample Supplier 2',
    contact_person: 'Jane Smith',
    email: 'jane@supplier2.com',
    phone: '+0987654321',
    address: '456 Vendor Ave, City, State',
    payment_terms: 45,
    created_at: new Date().toISOString(),
  },
];

const samplePurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplier_id: '1',
    po_number: 'PO-001',
    order_date: new Date().toISOString(),
    total_amount: 1750.00,
    status: 'pending',
    created_at: new Date().toISOString(),
    supplier: sampleSuppliers[0],
    items: [
      {
        id: '1',
        po_id: '1',
        product_id: '1',
        quantity: 50,
        unit_price: 25.00,
        line_total: 1250.00,
        received_qty: 0,
        created_at: new Date().toISOString(),
        product: sampleProducts[0],
      },
      {
        id: '2',
        po_id: '1',
        product_id: '2',
        quantity: 20,
        unit_price: 25.00,
        line_total: 500.00,
        received_qty: 0,
        created_at: new Date().toISOString(),
        product: sampleProducts[1],
      },
    ],
  },
];

// Improved fetch function with fallback to sample data
async function fetchWithError(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      
      // If it's a 404 error, throw a specific error for backend not available
      if (res.status === 404) {
        throw new Error('BACKEND_NOT_AVAILABLE');
      }
      
      throw new Error(`API Error ${res.status}: ${errorText || 'Unknown error'}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    // If it's our specific backend not available error, throw it
    if (error instanceof Error && error.message === 'BACKEND_NOT_AVAILABLE') {
      throw error;
    }
    
    // For any other network error, assume backend is not available
    throw new Error('BACKEND_NOT_AVAILABLE');
  }
}

// Product APIs with fallback
export const getProducts = async (): Promise<Product[]> => {
  try {
    return await fetchWithError(`${API_BASE}/products`);
  } catch {
    console.log('Using sample products data');
    return sampleProducts;
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  try {
    return await fetchWithError(`${API_BASE}/products/${id}`);
  } catch {
    const product = sampleProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  }
};

export const createProduct = async (data: CreateProductData): Promise<Product> => {
  try {
    return await fetchWithError(`${API_BASE}/products`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    // Create a mock product for demo purposes
    const newProduct: Product = {
      id: Date.now().toString(),
      ...data,
      current_stock: data.current_stock || 0,
      min_stock_level: data.min_stock_level || 0,
      created_at: new Date().toISOString(),
    };
    console.log('Created mock product:', newProduct);
    return newProduct;
  }
};

export const updateProduct = async (id: string, data: UpdateProductData): Promise<Product> => {
  try {
    return await fetchWithError(`${API_BASE}/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    const product = sampleProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return { ...product, ...data };
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await fetchWithError(`${API_BASE}/products/${id}`, {
      method: "DELETE",
    });
  } catch {
    console.log('Mock delete product:', id);
    // In a real app, you might want to remove from local state
  }
};

// Supplier APIs with fallback
export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    return await fetchWithError(`${API_BASE}/suppliers`);
  } catch {
    console.log('Using sample suppliers data');
    return sampleSuppliers;
  }
};

export const getSupplier = async (id: string): Promise<Supplier> => {
  try {
    return await fetchWithError(`${API_BASE}/suppliers/${id}`);
  } catch {
    const supplier = sampleSuppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  }
};

export const createSupplier = async (data: CreateSupplierData): Promise<Supplier> => {
  try {
    return await fetchWithError(`${API_BASE}/suppliers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    console.log('Created mock supplier:', newSupplier);
    return newSupplier;
  }
};

export const updateSupplier = async (id: string, data: UpdateSupplierData): Promise<Supplier> => {
  try {
    return await fetchWithError(`${API_BASE}/suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    const supplier = sampleSuppliers.find(s => s.id === id);
    if (!supplier) throw new Error('Supplier not found');
    return { ...supplier, ...data };
  }
};

export const deleteSupplier = async (id: string): Promise<void> => {
  try {
    await fetchWithError(`${API_BASE}/suppliers/${id}`, {
      method: "DELETE",
    });
  } catch {
    console.log('Mock delete supplier:', id);
  }
};

// Product Supplier APIs with fallback
export const getProductSuppliers = async (): Promise<ProductSupplier[]> => {
  try {
    return await fetchWithError(`${API_BASE}/product-suppliers`);
  } catch {
    console.log('Using sample product suppliers data');
    return [];
  }
};

export const getProductSupplier = async (id: string): Promise<ProductSupplier> => {
  try {
    return await fetchWithError(`${API_BASE}/product-suppliers/${id}`);
  } catch {
    throw new Error('Product supplier not found');
  }
};

export const createProductSupplier = async (data: CreateProductSupplierData): Promise<ProductSupplier> => {
  try {
    return await fetchWithError(`${API_BASE}/product-suppliers`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const newProductSupplier: ProductSupplier = {
      id: Date.now().toString(),
      ...data,
      created_at: new Date().toISOString(),
    };
    console.log('Created mock product supplier:', newProductSupplier);
    return newProductSupplier;
  }
};

export const updateProductSupplier = async (id: string, data: UpdateProductSupplierData): Promise<ProductSupplier> => {
  try {
    return await fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Product supplier not found');
  }
};

export const deleteProductSupplier = async (id: string): Promise<void> => {
  try {
    await fetchWithError(`${API_BASE}/product-suppliers/${id}`, {
      method: "DELETE",
    });
  } catch {
    console.log('Mock delete product supplier:', id);
  }
};

// Sales APIs with fallback
export const getSales = async (): Promise<Sale[]> => {
  try {
    return await fetchWithError(`${API_BASE}/sales`);
  } catch {
    console.log('Using sample sales data');
    return [];
  }
};

export const getSale = async (id: string): Promise<Sale> => {
  try {
    return await fetchWithError(`${API_BASE}/sales/${id}`);
  } catch {
    throw new Error('Sale not found');
  }
};

export const createSale = async (data: CreateSaleData): Promise<Sale> => {
  try {
    return await fetchWithError(`${API_BASE}/sales`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const newSale: Sale = {
      id: Date.now().toString(),
      customer_name: data.customer_name,
      sale_date: data.sale_date || new Date().toISOString(),
      total_amount: data.total_amount,
      status: data.status || 'completed',
      notes: data.notes,
      created_at: new Date().toISOString(),
      items: data.items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        sale_id: Date.now().toString(),
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        created_at: new Date().toISOString(),
      })),
    };
    console.log('Created mock sale:', newSale);
    return newSale;
  }
};

export const updateSale = async (id: string, data: UpdateSaleData): Promise<Sale> => {
  try {
    return await fetchWithError(`${API_BASE}/sales/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    throw new Error('Sale not found');
  }
};

export const getSalesSummary = async (): Promise<{ total_sales: number; total_revenue: number; latest_sale: string | null }> => {
  try {
    return await fetchWithError(`${API_BASE}/sales/summary`);
  } catch {
    return {
      total_sales: 0,
      total_revenue: 0,
      latest_sale: null,
    };
  }
};

// Purchase Order APIs with fallback
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    return await fetchWithError(`${API_BASE}/purchase-orders`);
  } catch {
    console.log('Using sample purchase orders data');
    return samplePurchaseOrders;
  }
};

export const getPurchaseOrder = async (id: string): Promise<PurchaseOrder> => {
  try {
    return await fetchWithError(`${API_BASE}/purchase-orders/${id}`);
  } catch {
    const purchaseOrder = samplePurchaseOrders.find(po => po.id === id);
    if (!purchaseOrder) throw new Error('Purchase order not found');
    return purchaseOrder;
  }
};

export const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
  try {
    return await fetchWithError(`${API_BASE}/purchase-orders`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch {
    const newPurchaseOrder: PurchaseOrder = {
      id: Date.now().toString(),
      supplier_id: data.supplier_id,
      po_number: data.po_number || `PO-${Date.now()}`,
      order_date: data.order_date || new Date().toISOString(),
      total_amount: data.total_amount,
      status: data.status || 'pending',
      created_at: new Date().toISOString(),
      supplier: sampleSuppliers.find(s => s.id === data.supplier_id),
      items: data.items.map((item, index) => ({
        id: `${Date.now()}-${index}`,
        po_id: Date.now().toString(),
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        received_qty: item.received_qty || 0,
        created_at: new Date().toISOString(),
      })),
    };
    console.log('Created mock purchase order:', newPurchaseOrder);
    
    // Add the new purchase order to the sample data so it appears in the list
    samplePurchaseOrders.unshift(newPurchaseOrder);
    
    return newPurchaseOrder;
  }
};

export const updatePurchaseOrder = async (id: string, data: UpdatePurchaseOrderData): Promise<PurchaseOrder> => {
  try {
    return await fetchWithError(`${API_BASE}/purchase-orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  } catch {
    const purchaseOrderIndex = samplePurchaseOrders.findIndex(po => po.id === id);
    if (purchaseOrderIndex === -1) throw new Error('Purchase order not found');
    
    // Update the purchase order in the sample data
    const updatedPurchaseOrder = { 
      ...samplePurchaseOrders[purchaseOrderIndex], 
      ...data 
    };
    samplePurchaseOrders[purchaseOrderIndex] = updatedPurchaseOrder;
    
    console.log('Updated mock purchase order:', updatedPurchaseOrder);
    return updatedPurchaseOrder;
  }
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  try {
    await fetchWithError(`${API_BASE}/purchase-orders/${id}`, {
      method: "DELETE",
    });
  } catch {
    console.log('Mock delete purchase order:', id);
    // Remove the purchase order from sample data
    const index = samplePurchaseOrders.findIndex(po => po.id === id);
    if (index !== -1) {
      samplePurchaseOrders.splice(index, 1);
    }
  }
};

// Legacy purchase order API object for backward compatibility
export const purchaseOrderApi = {
  listPurchaseOrders: getPurchaseOrders,
  getPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
};

