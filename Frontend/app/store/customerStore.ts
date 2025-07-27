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

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  sales: [],
  payments: [],
  loading: false,
  error: null,
  fetchCustomers: async () => {
    set({ loading: true, error: null });
    try {
      console.log('CustomerStore: Fetching customers...');
      const customers = await getCustomers();
      console.log('CustomerStore: Customers fetched successfully:', customers);
      set({ customers });
    } catch (error: any) {
      console.error('CustomerStore: Error fetching customers:', error);
      set({ error: error.message || 'Failed to fetch customers' });
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
      set({ error: error.message || 'Failed to fetch customer' });
    } finally {
      set({ loading: false });
    }
  },
  createCustomer: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log('CustomerStore: Creating customer with data:', data);
      await apiCreateCustomer(data);
      console.log('CustomerStore: Customer created successfully');
      // Refresh the customer list
      await get().fetchCustomers();
    } catch (error: any) {
      console.error('CustomerStore: Error creating customer:', error);
      set({ error: error.message || 'Failed to create customer' });
    } finally {
      set({ loading: false });
    }
  },
  updateCustomer: async (id, data) => {
    set({ loading: true, error: null });
    try {
      console.log('CustomerStore: Updating customer with ID:', id, 'data:', data);
      await apiUpdateCustomer(id, data);
      console.log('CustomerStore: Customer updated successfully');
      // Refresh the customer list
      await get().fetchCustomers();
    } catch (error: any) {
      console.error('CustomerStore: Error updating customer:', error);
      set({ error: error.message || 'Failed to update customer' });
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
      set({ error: error.message || 'Failed to fetch customer sales' });
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
      set({ error: error.message || 'Failed to fetch customer payments' });
    } finally {
      set({ loading: false });
    }
  },
})); 