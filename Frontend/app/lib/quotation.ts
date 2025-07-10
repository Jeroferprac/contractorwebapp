// app/lib/quotation.ts
import { axiosInstance } from "@/lib/api";

export interface QuotationPayload {
  project_title: string;
  description: string;
  estimated_budget_min: string;
  estimated_budget_max: string;
  deadline: string;
  attachment?: File | null;
}

export async function submitQuotation(payload: QuotationPayload) {
  const formData = new FormData();
  formData.append("project_title", payload.project_title);
  formData.append("description", payload.description);
  formData.append("estimated_budget_min", payload.estimated_budget_min);
  formData.append("estimated_budget_max", payload.estimated_budget_max);
  formData.append("deadline", payload.deadline);

  if (payload.attachment) {
    formData.append("attachments", payload.attachment);
  }

  const response = await axiosInstance.post("/api/v1/quotation/quote", formData);
  return response.data;
}
