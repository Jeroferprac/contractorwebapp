"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface LowStockItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  category: string
  urgency: "critical" | "low" | "medium"
}

const lowStockItems: LowStockItem[] = [
  {
    id: "ITM-001",
    name: "Wireless Headphones",
    currentStock: 5,
    minStock: 20,
    category: "Electronics",
    urgency: "critical",
  },
  {
    id: "ITM-002",
    name: "Cotton T-Shirts",
    currentStock: 12,
    minStock: 25,
    category: "Clothing",
    urgency: "low",
  },
  {
    id: "ITM-003",
    name: "Garden Tools Set",
    currentStock: 8,
    minStock: 15,
    category: "Home & Garden",
    urgency: "medium",
  },
  {
    id: "ITM-004",
    name: "Protein Bars",
    currentStock: 3,
    minStock: 50,
    category: "Food & Beverage",
    urgency: "critical",
  },
  {
    id: "ITM-005",
    name: "Smartphone Cases",
    currentStock: 15,
    minStock: 30,
    category: "Electronics",
    urgency: "medium",
  },
]

const urgencyColors = {
  critical: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
}

export function LowStockTable() {
  return (
    <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">Low Stock Alert</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Items requiring attention</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-100/50 transition-all duration-300 group border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                  <div className="text-xs text-gray-500 font-medium">{item.category}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.currentStock} / {item.minStock} units
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge className={cn("text-xs font-medium border rounded-full px-3 py-1", urgencyColors[item.urgency])}>
                  {item.urgency}
                </Badge>
                <div className="text-xs text-gray-400 font-medium">{item.id}</div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-6 text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent rounded-xl h-12 font-semibold transition-all duration-300"
        >
          View All Low Stock Items
        </Button>
      </CardContent>
    </Card>
  )
}
