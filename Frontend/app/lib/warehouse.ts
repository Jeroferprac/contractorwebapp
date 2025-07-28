import { BASE_URL, fetchWithAuth } from "./api";
import type {
  Warehouse,
  WarehouseStock,
  WarehouseTransfer,
  TransferStatusOption,
} from "@/types/warehouse";

const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

// --- Warehouse APIs ---
export const getWarehouses = (): Promise<Warehouse[]> =>
  fetchWithAuth(`${API_BASE}/warehouses`);

export const getWarehouse = (id: string): Promise<Warehouse> =>
  fetchWithAuth(`${API_BASE}/warehouses/${id}`);

export const createWarehouse = (data: Partial<Warehouse>): Promise<Warehouse> =>
  fetchWithAuth(`${API_BASE}/warehouses`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWarehouse = (id: string, data: Partial<Warehouse>): Promise<Warehouse> =>
  fetchWithAuth(`${API_BASE}/warehouses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// --- Warehouse Stocks APIs ---
export const getWarehouseStocks = (): Promise<WarehouseStock[]> =>
  fetchWithAuth(`${API_BASE}/warehouse-stocks`);

export const getWarehouseStock = (stockId: string): Promise<WarehouseStock> =>
  fetchWithAuth(`${API_BASE}/warehouse-stocks/${stockId}`);

export const createWarehouseStock = (data: Partial<WarehouseStock>): Promise<WarehouseStock> =>
  fetchWithAuth(`${API_BASE}/warehouse-stocks`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateWarehouseStock = (stockId: string, data: Partial<WarehouseStock>): Promise<WarehouseStock> =>
  fetchWithAuth(`${API_BASE}/warehouse-stocks/${stockId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteWarehouseStock = (stockId: string): Promise<{ success: boolean }> =>
  fetchWithAuth(`${API_BASE}/warehouse-stocks/${stockId}`, {
    method: "DELETE",
  });

// --- Warehouse Transfer APIs ---
export const getWarehouseTransfers = (): Promise<WarehouseTransfer[]> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfers`);

export const getTransfers = (): Promise<WarehouseTransfer[]> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfers`);

export const getTransfer = (id: string): Promise<WarehouseTransfer> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfers/${id}`);

export const createTransfer = (data: Partial<WarehouseTransfer>): Promise<WarehouseTransfer> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfer`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const completeTransfer = (id: string): Promise<WarehouseTransfer> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfers/${id}/complete`, {
    method: "POST",
  });

export const getTransferStatusOptions = (): Promise<TransferStatusOption[]> =>
  fetchWithAuth(`${API_BASE}/warehouses/transfer-status-options`);
