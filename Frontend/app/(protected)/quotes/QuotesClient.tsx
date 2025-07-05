"use client";

import { useEffect, useState } from "react";
import type { Session } from "next-auth";

interface Quotation {
  id: string;
  project_title: string;
  description: string;
  estimated_budget_min: number;
  estimated_budget_max: number;
  deadline: string | null;
}

interface QuotesClientProps {
  session: Session | null;
}

export default function QuotesClient({ session }: QuotesClientProps) {
  const [quotes, setQuotes] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.backendAccessToken) {
      console.warn("⚠️ No backend access token, skipping fetch.");
      setQuotes([]);
      return;
    }

    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quotes`;
        console.log("✅ Fetching quotes from:", url);

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${session.backendAccessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Quotes API response:", data);

        if (Array.isArray(data)) {
          setQuotes(data);
        } else if (Array.isArray(data.quotes)) {
          setQuotes(data.quotes);
        } else {
          setQuotes([]);
          setError("Quotes data format invalid");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          console.error("❌ Error fetching quotes:", err.message);
        } else {
          setError("Unknown error");
          console.error("❌ Unknown error fetching quotes");
        }
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [session]);

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-xl font-semibold">Quotes</h3>

      {loading ? (
        <p>Loading quotes...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : quotes.length === 0 ? (
        <p className="text-gray-500">No quotes found.</p>
      ) : (
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">Project Title</th>
              <th className="p-2">Description</th>
              <th className="p-2">Budget</th>
              <th className="p-2">Deadline</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => (
              <tr key={quote.id} className="border-b">
                <td className="p-2">{quote.project_title}</td>
                <td className="p-2">{quote.description}</td>
                <td className="p-2">
                  {quote.estimated_budget_min} - {quote.estimated_budget_max}
                </td>
                <td className="p-2">{quote.deadline ? new Date(quote.deadline).toLocaleDateString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
