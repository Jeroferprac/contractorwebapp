import { Customer, CustomerSales, CustomerPayment } from "@/types/customer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/api/v1/customers/`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function getCustomer(id: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}/api/v1/customers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch customer");
  return res.json();
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/api/v1/customers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
  const res = await fetch(`${API_BASE}/api/v1/customers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

export async function getCustomerSales(id: string): Promise<CustomerSales[]> {
  const res = await fetch(`${API_BASE}/api/v1/customers/${id}/sales`);
  if (!res.ok) throw new Error("Failed to fetch customer sales");
  return res.json();
}

export async function getCustomerPayments(id: string): Promise<CustomerPayment[]> {
  const res = await fetch(`${API_BASE}/api/v1/customers/${id}/payments`);
  if (!res.ok) throw new Error("Failed to fetch customer payments");
  return res.json();
} 