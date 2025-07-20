export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category?: string;
  brand?: string;
  unit?: string;
  current_stock: number;
  min_stock_level: number;
  reorder_point?: number;
  max_stock_level?: number;
  cost_price?: number;
  selling_price?: number;
  description?: string;
  weight?: string;
  dimensions?: string;
  is_active?: boolean;
  track_serial?: boolean;
  track_batch?: boolean;
  is_composite?: boolean;
  created_at: string;
  updated_at?: string;
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
export type CreateProductData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;
export type UpdateProductData = Partial<CreateProductData>;

export type CreateSupplierData = Omit<Supplier, 'id' | 'created_at'>;
export type UpdateSupplierData = Partial<CreateSupplierData>;

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