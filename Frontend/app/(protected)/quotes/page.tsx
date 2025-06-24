"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

type Quote = {
  id: string
  contractor: string
  amount: string
  status: "Approved" | "Pending" | "Rejected"
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    setQuotes([
      { id: "1", contractor: "John", amount: "5000", status: "Approved" },
      { id: "2", contractor: "Alex", amount: "3000", status: "Rejected" },
      { id: "3", contractor: "Sara", amount: "7000", status: "Pending" },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "text-green-600"
      case "Rejected":
        return "text-red-600"
      case "Pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="grid gap-4">
      {quotes.map((quote) => (
        <Card key={quote.id} className="p-4">
          <p><strong>Contractor:</strong> {quote.contractor}</p>
          <p><strong>Amount:</strong> ${quote.amount}</p>
          <p className={getStatusColor(quote.status)}><strong>Status:</strong> {quote.status}</p>
        </Card>
      ))}
    </div>
  )
}
