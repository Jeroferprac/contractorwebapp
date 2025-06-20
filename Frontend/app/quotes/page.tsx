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
        {quotes.map((quote) => (
          <div key={quote.id} className="p-4 bg-white rounded shadow">
            <p><strong>Contractor:</strong> {quote.contractor}</p>
            <p><strong>Amount:</strong> {quote.amount}</p>
            <p><strong>Status:</strong> {quote.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
