import { API } from "./api";

export interface QuotationData {
  projectTitle: string;
  description: string;
  budgetMin?: string;
  budgetMax?: string;
  deadline: string;
  file?: File | null;
}

export interface Quote {
  id: string;
  contractor: string;
  amount: string;
  status: "Pending" | "Approved" | "Rejected";
}

export const submitQuotation = async (data: QuotationData, token: string) => {
  const formData = new FormData();
  formData.append("project_title", data.projectTitle);
  if (data.budgetMin) formData.append("estimated_budget_min", data.budgetMin);
  if (data.budgetMax) formData.append("estimated_budget_max", data.budgetMax);
  formData.append("description", data.description);
  formData.append("deadline", data.deadline);
  if (data.file) {
    formData.append("file", data.file);
  }

  const response = await fetch(API.QUOTE, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to submit quotation");
  }

  return await response.json();
};

export const fetchQuotations = async (token: string): Promise<Quote[]> => {
  const response = await fetch(API.QUOTES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  console.log("API response for quotations:", result);

  if (!response.ok) {
    throw new Error(result?.detail || result?.message || "Failed to fetch quotations");
  }

  // 🔥 FIX: Return correct structure
  return result.quotes || result; // handles both { quotes: [] } and [] responses
};
