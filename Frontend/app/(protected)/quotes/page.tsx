"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

interface Quotation {
  id: string;
  project_title: string;
  description: string;
  estimated_budget_min: number;
  estimated_budget_max: number;
  deadline: string;
  attachments: { filename: string; content_type: string; base64: string }[];
}

export default function QuotesPage() {
  const { data: session } = useSession();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotations = async () => {
      if (!session?.backendAccessToken) return;

      try {
        const res = await fetch("http://localhost:8000/api/v1/quotation/quotes", {
          headers: {
            Authorization: `Bearer ${session.backendAccessToken}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch quotations");

        const data = await res.json();

        if (Array.isArray(data.items)) {
          setQuotations(data.items);
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (error) {
        console.error("Error fetching quotations:", error);
        setError("Failed to load quotations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [session]);

  return (
    <div className="space-y-6 bg-white text-gray-900 dark:bg-[#0b1437] dark:text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold">Your Quotations</h1>

      {error && (
        <Card className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 p-4">
          <p>{error}</p>
        </Card>
      )}

      {loading ? (
        <div className="text-gray-600 dark:text-gray-300">Loading quotations...</div>
      ) : quotations.length === 0 ? (
        <Card className="p-4 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1e2a50]">
          No quotations found.
        </Card>
      ) : (
        <Card className="overflow-x-auto bg-white dark:bg-[#1e2a50]">
          <CardContent className="p-4">
            <table className="min-w-full table-auto border border-gray-300 dark:border-gray-600">
              <thead className="bg-gray-100 dark:bg-[#2c3b65]">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white">Project Title</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white">Description</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white">Budget (₹)</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white">Deadline</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-white">Attachments</th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quote) => (
                  <tr key={quote.id} className="border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2c3b65]">
                    <td className="px-4 py-2 font-medium">{quote.project_title}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{quote.description}</td>
                    <td className="px-4 py-2">₹{quote.estimated_budget_min} - ₹{quote.estimated_budget_max}</td>
                    <td className="px-4 py-2">{new Date(quote.deadline).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      {quote.attachments?.length > 0 ? (
                        <ul className="space-y-1 text-sm">
                          {quote.attachments.map((att, index) => (
                            <li key={index}>
                              <a
                                href={`data:${att.content_type};base64,${att.base64}`}
                                download={att.filename}
                                className="text-blue-500 dark:text-blue-400 hover:underline"
                              >
                                {att.filename}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">No Attachments</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
