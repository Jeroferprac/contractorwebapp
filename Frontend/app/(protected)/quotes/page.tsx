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
        console.log("Fetched data:", data);

        if (Array.isArray(data.items)) {
          setQuotations(data.items);
        } else {
          console.error("Unexpected response format:", data);
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
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Your Quotations</h1>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading quotations...</p>
      ) : quotations.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No quotations found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotations.map((quote) => (
            <div
              key={quote.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{quote.project_title}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{quote.description}</p>

                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>
                    <span className="font-medium">Budget:</span> ₹{quote.estimated_budget_min} - ₹
                    {quote.estimated_budget_max}
                  </p>
                  <p>
                    <span className="font-medium">Deadline:</span> {quote.deadline}
                  </p>
                </div>

                {quote.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium mb-1">Attachments:</p>
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
