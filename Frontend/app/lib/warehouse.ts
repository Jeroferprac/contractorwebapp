import { BASE_URL } from "./api";
import type {
  Warehouse,
  WarehouseStock,
  WarehouseTransfer,
  TransferStatusOption,
} from "@/types/warehouse";

const API_BASE = `${BASE_URL}/api/v1/inventory/inventory`;

// --- Warehouse APIs ---
export const getWarehouses = (): Promise<Warehouse[]> =>
  fetch(`${API_BASE}/warehouses`).then(res => res.json());

export const getWarehouse = (id: string): Promise<Warehouse> =>
  fetch(`${API_BASE}/warehouses/${id}`).then(res => res.json());

export const createWarehouse = (data: Partial<Warehouse>): Promise<Warehouse> =>
  fetch(`${API_BASE}/warehouses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const updateWarehouse = (id: string, data: Partial<Warehouse>): Promise<Warehouse> =>
  fetch(`${API_BASE}/warehouses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

// --- Warehouse Stocks APIs ---
export const getWarehouseStocks = (): Promise<WarehouseStock[]> =>
  fetch(`${API_BASE}/warehouse-stocks`).then(res => res.json());

export const getWarehouseStock = (stockId: string): Promise<WarehouseStock> =>
  fetch(`${API_BASE}/warehouse-stocks/${stockId}`).then(res => res.json());

export const createWarehouseStock = (data: Partial<WarehouseStock>): Promise<WarehouseStock> =>
  fetch(`${API_BASE}/warehouse-stocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const updateWarehouseStock = (stockId: string, data: Partial<WarehouseStock>): Promise<WarehouseStock> =>
  fetch(`${API_BASE}/warehouse-stocks/${stockId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const deleteWarehouseStock = (stockId: string): Promise<{ success: boolean }> =>
  fetch(`${API_BASE}/warehouse-stocks/${stockId}`, {
    method: "DELETE",
  }).then(res => res.json());

// --- Warehouse Transfer APIs ---
export const getTransfers = (): Promise<WarehouseTransfer[]> =>
  fetch(`${API_BASE}/warehouses/transfers`).then(res => res.json());

export const createTransfer = (data: Partial<WarehouseTransfer>): Promise<WarehouseTransfer> =>
  fetch(`${API_BASE}/warehouses/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const completeTransfer = (id: string): Promise<WarehouseTransfer> =>
  fetch(`${API_BASE}/warehouses/transfers/${id}/complete`, {
    method: "POST",
  }).then(res => res.json());

export const getTransferStatusOptions = (): Promise<TransferStatusOption[]> =>
  fetch(`${API_BASE}/warehouses/transfer-status-options`).then(res => res.json());
