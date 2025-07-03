"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface Quotation {
  id: string
  project_title: string
  description: string
  estimated_budget_min: number
  estimated_budget_max: number
  deadline: string
  attachments: { filename: string; content_type: string; base64: string }[]
}

export default function QuotesPage() {
  const { data: session } = useSession()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuotations = async () => {
      if (!session?.backendAccessToken) return

      try {
        const res = await fetch("http://localhost:8000/api/v1/quotation/quotes", {
          headers: {
            Authorization: `Bearer ${session.backendAccessToken}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch quotations")

        const data = await res.json()
        console.log("Fetched data:", data)

        if (Array.isArray(data.items)) {
          setQuotations(data.items)
        } else {
          console.error("Unexpected response format:", data)
        }
      } catch (error) {
        console.error("Error fetching quotations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotations()
  }, [session])

  return (
    <div className="min-h-screen p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Your Quotations</h1>

      {loading ? (
        <p>Loading quotations...</p>
      ) : quotations.length === 0 ? (
        <p>No quotations found.</p>
      ) : (
        <div className="space-y-4">
          {quotations.map((quote) => (
            <div key={quote.id} className="p-4 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800 space-y-2">
              <h2 className="text-xl font-semibold">{quote.project_title}</h2>
              <p>{quote.description}</p>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p>Budget: ₹{quote.estimated_budget_min} - ₹{quote.estimated_budget_max}</p>
                <p>Deadline: {quote.deadline}</p>
                {quote.attachments.length > 0 && (
                  <p className="mt-2 font-medium">Attachments:</p>
                )}
                {quote.attachments.map((att, index) => (
                  <div key={index} className="text-blue-500 underline">
                    {att.filename}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
