"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

type Client = {
  id: string
  name: string
  email: string
  company: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    setClients([
      { id: "1", name: "John Doe", email: "john@example.com", company: "ABC Corp" },
      { id: "2", name: "Sara Smith", email: "sara@example.com", company: "XYZ Ltd" },
      { id: "3", name: "Alex Johnson", email: "alex@example.com", company: "Delta Inc" },
    ])
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id} className="p-4">
          <h2 className="text-lg font-semibold">{client.name}</h2>
          <p className="text-sm text-muted-foreground">{client.email}</p>
          <p className="text-sm">{client.company}</p>
        </Card>
      ))}
    </div>
  )
}
