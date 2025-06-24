"use client"

import { useEffect } from "react"
import { useClientStore } from "@/store/clientStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { v4 as uuid } from "uuid"

export default function ClientsPage() {
  const clients = useClientStore((state) => state.clients)
  const addClient = useClientStore((state) => state.addClient)

  useEffect(() => {
    if (clients.length === 0) {
      addClient({ id: uuid(), name: "John Doe", email: "john@example.com", phone: "1234567890" })
      addClient({ id: uuid(), name: "Jane Smith", email: "jane@example.com", phone: "9876543210" })
    }
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>

      {clients.length === 0 ? (
        <p className="text-gray-500">No clients found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                <Badge variant="outline">Client</Badge>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <p>📧 {client.email}</p>
                <p>📞 {client.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
