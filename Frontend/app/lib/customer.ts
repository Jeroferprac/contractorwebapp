import { Customer, CustomerSales, CustomerPayment } from "@/types/customer";
import { apiClient } from "./api";

// Helper function to sanitize customer data
function sanitizeCustomerData(data: Partial<Customer>): Partial<Customer> {
  const sanitized = { ...data };
  
  // Convert empty strings to undefined for optional fields
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key as keyof Customer];
    if (value === '') {
      sanitized[key as keyof Customer] = undefined;
    }
  });
  
  // Ensure credit_limit is a number or undefined
  if (sanitized.credit_limit !== undefined) {
    sanitized.credit_limit = Number(sanitized.credit_limit) || 0;
  }
  
  // Ensure payment_terms is a number
  if (sanitized.payment_terms !== undefined) {
    sanitized.payment_terms = Number(sanitized.payment_terms) || 30;
  }
  
  // Ensure is_active is a boolean
  if (sanitized.is_active !== undefined) {
    sanitized.is_active = Boolean(sanitized.is_active);
  }
  
  return sanitized;
}

export async function getCustomers(): Promise<Customer[]> {
  console.log('Customer API: Fetching customers from /api/customers');
  return apiClient.get<Customer[]>("/api/customers");
}

export async function getCustomer(id: string): Promise<Customer> {
  console.log('Customer API: Fetching customer with ID:', id);
  return apiClient.get<Customer>(`/api/customers/${id}`);
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  console.log('Customer API: Creating customer with data:', data);
  const sanitizedData = sanitizeCustomerData(data);
  console.log('Customer API: Sanitized data:', sanitizedData);
  return apiClient.post<Customer>("/api/customers", sanitizedData);
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  console.log('Customer API: Updating customer with ID:', id, 'data:', data);
  const sanitizedData = sanitizeCustomerData(data);
  console.log('Customer API: Sanitized data:', sanitizedData);
  return apiClient.put<Customer>(`/api/customers/${id}`, sanitizedData);
}

export async function getCustomerSales(id: string): Promise<CustomerSales[]> {
  console.log('Customer API: Fetching sales for customer ID:', id);
  return apiClient.get<CustomerSales[]>(`/api/customers/${id}/sales`);
}

export async function getCustomerPayments(id: string): Promise<CustomerPayment[]> {
  console.log('Customer API: Fetching payments for customer ID:', id);
  return apiClient.get<CustomerPayment[]>(`/api/customers/${id}/payments`);
} 