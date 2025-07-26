export interface Customer {
  id: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tax_id?: string;
  payment_terms?: number;
  credit_limit?: number;
  price_list_id?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface CustomerSales {
  id: string;
  date: string;
  amount: number;
  description?: string;
}

export interface CustomerPayment {
  id: string;
  date: string;
  amount: number;
  description?: string;
}

export const STATE_OPTIONS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Other"
];

export const COUNTRY_OPTIONS = [
  "India", "United States", "United Kingdom", "Australia", "Canada", "Singapore", "UAE", "Germany", "France", "Other"
]; 