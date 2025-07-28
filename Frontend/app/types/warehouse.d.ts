export interface Warehouse {
  id: string;
  name: string;
  code?: string;
  address: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface WarehouseStock {
  id: string;
  warehouse_id: string;
  product_id: string;
  bin_location?: string;
  quantity: string | number;
  reserved_quantity?: string | number;
  available_quantity?: string | number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WarehouseTransferItem {
  product_id: string;
  quantity: string;
  id: string;
  received_quantity: string;
  created_at: string;
}

export interface WarehouseTransfer {
  id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  product_id?: string;
  quantity?: number;
  status: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  requested_by?: string;
  transfer_number?: string;
  transfer_date?: string;
  notes?: string;
  created_by?: string;
  items?: WarehouseTransferItem[];
}

export interface TransferStatusOption {
  value: string;
  label: string;
}

// UI-specific type for warehouse card and directory (extends backend Warehouse)
export interface WarehouseCardWarehouse extends Warehouse {
  totalBins: number; // calculated or 0 if not available
  stockCount: number; // calculated or 0 if not available
  status: "active" | "inactive"; // derived from is_active
  region: string; // optional, default "N/A"
  manager: string; // from contact_person or "N/A"
  utilization: number; // calculated or 0 if not available
  lastUpdated: string; // from updated_at or created_at
}

// Bin type for BinAccordion and bin-related UI
export interface Bin {
  id: string;
  name: string;
  type: "raw" | "finished" | "staging" | "returns";
  capacity: number;
  currentStock: number;
  zone: string;
  lastUpdated: string;
  qrCode: string;
}
