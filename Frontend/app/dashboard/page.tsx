"use client"

import { useQuoteStore } from "@/store/quoteStore"

export default function DashboardPage() {
  const quotes = useQuoteStore((state) => state.quotes)

  const total = quotes.length
  const approved = quotes.filter((q) => q.status === "Approved").length
  const pending = quotes.filter((q) => q.status === "Pending").length
  const rejected = quotes.filter((q) => q.status === "Rejected").length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Quotes" value={total} color="bg-blue-600" />
        <StatCard title="Approved" value={approved} color="bg-green-600" />
        <StatCard title="Pending" value={pending} color="bg-yellow-500" />
        <StatCard title="Rejected" value={rejected} color="bg-red-600" />
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string
  value: number
  color: string
}) {
  return (
    <div className={`p-4 rounded-lg shadow text-white ${color}`}>
      <h2 className="text-sm">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
