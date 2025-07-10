export async function fetchQuotations(): Promise<[]> {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quotes`, {
    method: "GET",
    credentials: "include", // ✅ Required for session auth
    headers: {
      Accept: "application/json",
    },
  });

  if (!data.ok) {
    const errorText = await data.text();
    console.error("❌ Error fetching quotations:", errorText);
    throw new Error("Forbidden: You might not be logged in or lack permissions.");
  }

  const result = await data.json();
  return Array.isArray(result.items) ? result.items : [];
}
