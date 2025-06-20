export default function ClientsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <p className="text-gray-600">This is where all client records will be displayed.</p>

      {/* Client list placeholder */}
      <div className="mt-6 p-4 bg-white shadow rounded">
        <p className="text-gray-500">No clients added yet.</p>
      </div>
    </div>
  )
}
