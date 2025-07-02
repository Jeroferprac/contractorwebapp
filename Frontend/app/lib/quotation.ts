import { API } from "./api";

export interface QuotationData {
  projectTitle: string;
  description: string;
  budgetMin?: string;
  budgetMax?: string;
  deadline: string;
  file?: File | null;
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
