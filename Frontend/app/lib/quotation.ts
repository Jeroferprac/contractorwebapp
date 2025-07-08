export interface Attachment {
  filename: string;
  content_type: string;
  base64: string;
}

export interface QuotationPayload {
  projectTitle: string;
  description: string;
  estimated_budget_min: number;
  estimated_budget_max: number;
  deadline: string;
  attachments: Attachment[];
}

export const submitQuotation = async (payload: QuotationPayload, token: string) => {
  const formData = new FormData();

  formData.append("project_title", payload.projectTitle);
  formData.append("description", payload.description);
  formData.append("estimated_budget_min", String(payload.estimated_budget_min));
  formData.append("estimated_budget_max", String(payload.estimated_budget_max));
  formData.append("deadline", payload.deadline);

  payload.attachments.forEach((att) => {
    const blob = base64ToBlob(att.base64, att.content_type);
    formData.append("attachments", new File([blob], att.filename, { type: att.content_type }));
  });

  const res = await fetch("http://localhost:8000/api/v1/quotation/quote", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to submit quotation: ${errorText}`);
  }

  return res.json();
};

const base64ToBlob = (base64: string, contentType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  return new Blob([new Uint8Array(byteArrays)], { type: contentType });
};
