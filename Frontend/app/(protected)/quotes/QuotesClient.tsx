"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

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
        }
      } catch (error) {
        console.error("Error fetching quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [session]);

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-[#0b1437] text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Your Quotations</h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading quotations...</p>
      ) : quotations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No quotations found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full table-auto border border-gray-200 dark:border-gray-700 overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Project Title</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Budget (₹)</th>
                <th className="px-4 py-2 text-left">Deadline</th>
                <th className="px-4 py-2 text-left">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quote, index) => (
                <tr
                  key={quote.id}
                  className={`${
                    index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-900"
                  } hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors`}
                >
                  <td className="px-4 py-2 font-medium">{quote.project_title}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{quote.description}</td>
                  <td className="px-4 py-2 text-purple-600 dark:text-purple-400">
                    ₹{quote.estimated_budget_min} - ₹{quote.estimated_budget_max}
                  </td>
                  <td className="px-4 py-2">{new Date(quote.deadline).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    {quote.attachments?.length > 0 ? (
                      <ul className="space-y-1">
                        {quote.attachments.map((att, index) => (
                          <li key={index}>
                            <a
                              href={`data:${att.content_type};base64,${att.base64}`}
                              download={att.filename}
                              className="text-blue-500 hover:underline text-sm"
                            >
                              {att.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-500 text-sm">No Attachments</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
