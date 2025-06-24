"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

type Quote = {
  id: string
  contractor: string
  amount: string
  status: "Approved" | "Rejected" | "Pending"
}

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])

  useEffect(() => {
    setQuotes([
      { id: "1", contractor: "John", amount: "5000", status: "Approved" },
      { id: "2", contractor: "Alex", amount: "3000", status: "Rejected" },
      { id: "3", contractor: "Sara", amount: "7000", status: "Pending" },
    ])
  }, [])

  const total = quotes.length
  const approved = quotes.filter((q) => q.status === "Approved").length
  const rejected = quotes.filter((q) => q.status === "Rejected").length
  const pending = quotes.filter((q) => q.status === "Pending").length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 bg-blue-100">
        <p className="text-sm text-gray-600">Total Quotes</p>
        <h2 className="text-2xl font-bold">{total}</h2>
      </Card>
      <Card className="p-4 bg-green-100">
        <p className="text-sm text-gray-600">Approved</p>
        <h2 className="text-2xl font-bold">{approved}</h2>
      </Card>
      <Card className="p-4 bg-red-100">
        <p className="text-sm text-gray-600">Rejected</p>
        <h2 className="text-2xl font-bold">{rejected}</h2>
      </Card>
      <Card className="p-4 bg-yellow-100">
        <p className="text-sm text-gray-600">Pending</p>
        <h2 className="text-2xl font-bold">{pending}</h2>
      </Card>
    </div>
  )
}
