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

export default function QuotesClient() {
  const { status } = useSession();
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotations = async () => {
      if (status !== "authenticated") return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quotes`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch quotations");
        }

        const data = await res.json();
        if (Array.isArray(data.items)) {
          setQuotations(data.items);
        }
      } catch (error) {
        console.error("❌ Error fetching quotations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [status]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Your Quotations</h2>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading quotations...</p>
      ) : quotations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No quotations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">Project Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Budget (₹)</th>
                <th className="px-4 py-2">Deadline</th>
                <th className="px-4 py-2">Attachments</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quote, index) => (
                <tr
                  key={quote.id}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
                  } hover:bg-purple-100 dark:hover:bg-purple-900 transition`}
                >
                  <td className="px-4 py-2 font-medium">{quote.project_title}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{quote.description}</td>
                  <td className="px-4 py-2 text-purple-600 dark:text-purple-400">
                    ₹{quote.estimated_budget_min} - ₹{quote.estimated_budget_max}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(quote.deadline).toLocaleDateString()}
                  </td>
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
