export interface Quotation {
  id: string;
  project_title: string;
  description: string;
  estimated_budget_min: number;
  estimated_budget_max: number;
  deadline: string;
  // ...add other fields as needed
}

export async function fetchQuotations(token: string): Promise<Quotation[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quotes`,
    {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error fetching quotations:", errorText);
    throw new Error("Forbidden: You might not be logged in or lack permissions.");
  }

  const result = await res.json();
  return Array.isArray(result.items) ? result.items : [];
}

export async function submitQuotation(form: FormData, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quote`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: form,
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error submitting quotation:", errorText);
    throw new Error("Failed to submit quotation");
  }
  return res.json();
}
