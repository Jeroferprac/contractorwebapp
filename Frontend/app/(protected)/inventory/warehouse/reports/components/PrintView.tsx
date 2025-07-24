"use client"

import { useEffect } from "react"
import { X, Building, Calendar, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PrintViewProps {
  onClose: () => void
  filters: {
    dateRange: { from: string; to: string }
    warehouses: string[]
    products: string[]
    status: string
  }
  data: Array<{
    id: string;
    date: string;
    productName: string;
    quantity: number;
    sourceWarehouse: string;
    destinationWarehouse: string;
    status: string;
  }>
}

export function PrintView({ onClose, filters, data }: PrintViewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-white text-black print:bg-white">
      {/* Screen-only controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
          Print Report
        </Button>
        <Button variant="outline" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto p-8 print:p-4">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Warehouse Management System</h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Transfer Report</h2>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        {/* Report Filters Summary */}
        <Card className="mb-6 print:shadow-none print:border print:border-gray-300">
          <CardHeader>
            <CardTitle className="text-lg">Report Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Date Range:</span>
                <span>
                  {filters.dateRange.from && filters.dateRange.to
                    ? `${filters.dateRange.from} to ${filters.dateRange.to}`
                    : "All dates"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Warehouses:</span>
                <span>
                  {filters.warehouses.length > 0 ? `${filters.warehouses.length} selected` : "All warehouses"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Products:</span>
                <span>{filters.products.length > 0 ? `${filters.products.length} selected` : "All products"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Status:</span>
                <span className="capitalize">{filters.status === "all" ? "All statuses" : filters.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="print:shadow-none print:border print:border-gray-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{data.length}</div>
              <div className="text-sm text-gray-600">Total Transfers</div>
            </CardContent>
          </Card>
          <Card className="print:shadow-none print:border print:border-gray-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {data.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Quantity</div>
            </CardContent>
          </Card>
          <Card className="print:shadow-none print:border print:border-gray-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (data.filter((item) => item.status === "completed").length / data.length) * 100,
                )}
                %
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="print:shadow-none print:border print:border-gray-300">
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 font-medium">Date</th>
                    <th className="text-left p-2 font-medium">Transfer ID</th>
                    <th className="text-left p-2 font-medium">Product</th>
                    <th className="text-left p-2 font-medium">Quantity</th>
                    <th className="text-left p-2 font-medium">From</th>
                    <th className="text-left p-2 font-medium">To</th>
                    <th className="text-left p-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((transfer, index) => (
                    <tr key={transfer.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="p-2">{new Date(transfer.date).toLocaleDateString()}</td>
                      <td className="p-2 font-mono">{transfer.id}</td>
                      <td className="p-2">{transfer.productName}</td>
                      <td className="p-2">{transfer.quantity.toLocaleString()}</td>
                      <td className="p-2">{transfer.sourceWarehouse}</td>
                      <td className="p-2">{transfer.destinationWarehouse}</td>
                      <td className="p-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            transfer.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transfer.status === "in-transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transfer.status.replace("-", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 print:mt-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p>Report generated by Warehouse Management System</p>
              <p>
                Date: {new Date().toLocaleDateString()} | Time: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p>Authorized Signature:</p>
              <div className="mt-4 border-b border-gray-400 w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
