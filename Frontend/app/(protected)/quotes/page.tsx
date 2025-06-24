"use client"

import { useEffect } from "react"
import { useQuoteStore } from "@/store/quoteStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function QuotesPage() {
  const quotes = useQuoteStore((state) => state.quotes)
  const addQuote = useQuoteStore((state) => state.addQuote)

  // Add sample quotes once
  useEffect(() => {
    if (quotes.length === 0) {
      addQuote({ id: "1", contractor: "John", amount: "5000", status: "Approved" })
      addQuote({ id: "2", contractor: "Alex", amount: "3000", status: "Rejected" })
      addQuote({ id: "3", contractor: "Sara", amount: "7000", status: "Pending" })
    }
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {quotes.map((quote) => (
        <Card key={quote.id}>
          <CardHeader>
            <CardTitle className="text-base">Quote #{quote.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contractor</p>
              <p>{quote.contractor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Amount</p>
              <p>${quote.amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "approved":
      return "default" 
    case "rejected":
      return "destructive"
    case "pending":
    default:
      return "secondary"
  }
}
