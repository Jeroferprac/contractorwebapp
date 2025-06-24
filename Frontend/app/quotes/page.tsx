"use client"

import NewQuoteForm from "@/components/forms/NewQuoteForm"
import { useQuoteStore } from "@/store/quoteStore"

export default function QuotesPage() {
  const quotes = useQuoteStore((state) => state.quotes)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Quotations</h1>
      <NewQuoteForm />

      <div className="space-y-4 mt-6">
        {quotes.length === 0 ? (
          <p className="text-gray-500">No quotes found.</p>
        ) : (
          quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg bg-white shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{quote.contractor}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    getStatusColor(quote.status)
                  }`}
                >
                  {quote.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                💰 <strong>Amount:</strong> ₹{quote.amount}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ✅ Helper function must be OUTSIDE the component, but inside the same file
function getStatusColor(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-700"
    case "Rejected":
      return "bg-red-100 text-red-700"
    case "Pending":
      return "bg-yellow-100 text-yellow-700"
    default:
      return "bg-gray-100 text-gray-600"
  }
}
