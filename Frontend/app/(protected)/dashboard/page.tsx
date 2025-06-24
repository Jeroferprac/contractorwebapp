"use client"

import { useEffect } from "react"
import { useQuoteStore } from "@/store/quoteStore"

export default function DashboardPage() {
  const quotes = useQuoteStore((state) => state.quotes)
  const addQuote = useQuoteStore((state) => state.addQuote)

  // ✅ Add fake data if no quotes
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card title="Total Quotes" value={total} color="bg-blue-100" />
      <Card title="Approved" value={approved} color="bg-green-100" />
      <Card title="Rejected" value={rejected} color="bg-red-100" />
      <Card title="Pending" value={pending} color="bg-yellow-100" />
    </div>
  )
}

function Card({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`p-4 rounded shadow ${color}`}>
      <p className="text-sm text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  )
}
