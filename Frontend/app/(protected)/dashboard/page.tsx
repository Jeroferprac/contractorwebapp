"use client"

import { useEffect } from "react"
import { useQuoteStore } from "@/store/quoteStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const quotes = useQuoteStore((state) => state.quotes)
  const addQuote = useQuoteStore((state) => state.addQuote)

  useEffect(() => {
    if (quotes.length === 0) {
      addQuote({ id: "1", contractor: "John", amount: "5000", status: "Approved" })
      addQuote({ id: "2", contractor: "Alex", amount: "3000", status: "Rejected" })
      addQuote({ id: "3", contractor: "Sara", amount: "7000", status: "Pending" })
    }
  }, [])

  const total = quotes.length
  const approved = quotes.filter((q) => q.status === "Approved").length
  const rejected = quotes.filter((q) => q.status === "Rejected").length
  const pending = quotes.filter((q) => q.status === "Pending").length

  const stats = [
    { title: "Total Quotes", value: total },
    { title: "Approved", value: approved },
    { title: "Rejected", value: rejected },
    { title: "Pending", value: pending },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-white dark:bg-gray-950 border">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
