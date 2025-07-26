import { create } from "zustand";
import type { Customer, CustomerSales, CustomerPayment } from "@/types/customer";
import {
  getCustomers,
  getCustomer,
  createCustomer as apiCreateCustomer,
  updateCustomer as apiUpdateCustomer,
  getCustomerSales,
  getCustomerPayments,
} from "@/lib/customer";

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  sales: CustomerSales[];
  payments: CustomerPayment[];
  loading: boolean;
  error: string | null;
  fetchCustomers: () => Promise<void>;
  fetchCustomer: (id: string) => Promise<void>;
  createCustomer: (data: Partial<Customer>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  fetchCustomerSales: (id: string) => Promise<void>;
  fetchCustomerPayments: (id: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  customers: [],
  selectedCustomer: null,
  sales: [],
  payments: [],
  loading: false,
  error: null,
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      const customers = await getCustomers();
      set({ customers });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchCustomer: async (id) => {
    set({ loading: true, error: null });
    try {
      const selectedCustomer = await getCustomer(id);
      set({ selectedCustomer });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  createCustomer: async (data) => {
    set({ loading: true, error: null });
    try {
      await apiCreateCustomer(data);
      await (useCustomerStore.getState().fetchCustomers());
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  updateCustomer: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await apiUpdateCustomer(id, data);
      await (useCustomerStore.getState().fetchCustomers());
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchCustomerSales: async (id) => {
    set({ loading: true, error: null });
    try {
      const sales = await getCustomerSales(id);
      set({ sales });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
  fetchCustomerPayments: async (id) => {
    set({ loading: true, error: null });
    try {
      const payments = await getCustomerPayments(id);
      set({ payments });
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },
})); 