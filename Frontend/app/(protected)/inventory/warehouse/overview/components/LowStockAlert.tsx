"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, ShoppingCart, X, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WarehouseStock } from "@/types/warehouse"

interface LowStockItem {
  id: string
  name: string
  currentStock: number
  minStock: number
  category: string
  urgency: "critical" | "low" | "medium"
}

interface LowStockAlertProps {
  stocks?: WarehouseStock[]
}

const urgencyColors = {
  critical: "from-red-500 to-pink-500",
  medium: "from-yellow-500 to-orange-500",
  low: "from-green-500 to-emerald-500",
}

const urgencyBadgeColors = {
  critical: "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  medium: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  low: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
}

// Map warehouse stock to low stock item
function mapStockToLowStockItem(stock: WarehouseStock): LowStockItem {
  const currentStock = typeof stock.quantity === 'string' ? parseFloat(stock.quantity) || 0 : stock.quantity || 0
  const minStock = 10 // Default minimum stock level
  let urgency: "critical" | "low" | "medium" = "low"
  
  if (currentStock < 5) urgency = "critical"
  else if (currentStock < minStock) urgency = "medium"
  
  return {
    id: stock.id,
    name: `Product ${stock.product_id}`,
    currentStock,
    minStock,
    category: "Inventory",
    urgency,
  }
}

export function LowStockAlert({ stocks = [] }: LowStockAlertProps) {
  const [dismissedItems, setDismissedItems] = useState<string[]>([])
  const [reorderingItems, setReorderingItems] = useState<string[]>([])
  const [showAllGood, setShowAllGood] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  // Filter low stock items from real data
  const lowStockItems = stocks
    .filter(stock => {
      const quantity = typeof stock.quantity === 'string' ? parseFloat(stock.quantity) || 0 : stock.quantity || 0
      return quantity < 10
    })
    .map(mapStockToLowStockItem)

  const visibleItems = lowStockItems.filter((item) => !dismissedItems.includes(item.id))

  useEffect(() => {
    if (visibleItems.length === 0 && !showAllGood) {
      setShowAllGood(true)
      const timer = setTimeout(() => {
        setShowAllGood(false)
        setIsVisible(false)
      }, 5000) // Show for 5 seconds
      return () => clearTimeout(timer)
    }
  }, [visibleItems.length, showAllGood])

  const handleDismiss = (itemId: string) => {
    setDismissedItems((prev) => [...prev, itemId])
  }

  const handleReorder = async (itemId: string) => {
    setReorderingItems((prev) => [...prev, itemId])
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setReorderingItems((prev) => prev.filter((id) => id !== itemId))
    setDismissedItems((prev) => [...prev, itemId])
  }

  if (!isVisible) {
    return null
  }

  if (showAllGood) {
    return (
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-3xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-500">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-0 duration-700 delay-200">
            <CheckCircle className="w-8 h-8 text-white animate-in zoom-in-0 duration-500 delay-500" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 animate-in slide-in-from-bottom-2 duration-500 delay-300">
            All Stock Levels Good!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-in slide-in-from-bottom-2 duration-500 delay-400">
            No items require immediate attention.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (visibleItems.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {visibleItems.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "group border-0 shadow-lg rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
            `bg-gradient-to-br ${urgencyColors[item.urgency]}/5 hover:shadow-${item.urgency === "critical" ? "red" : item.urgency === "medium" ? "yellow" : "green"}-500/20`,
          )}
        >
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                    `bg-gradient-to-br ${urgencyColors[item.urgency]}`,
                  )}
                >
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Low Stock Alert</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.name}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(item.id)}
                className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Current Stock</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.currentStock}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minimum Required</div>
                  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{item.minStock}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Stock Level</span>
                  <Badge
                    className={cn(
                      "text-xs font-medium border rounded-full px-3 py-1",
                      urgencyBadgeColors[item.urgency],
                    )}
                  >
                    {item.urgency}
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-1000",
                      `bg-gradient-to-r ${urgencyColors[item.urgency]}`,
                    )}
                    style={{ width: `${Math.min((item.currentStock / item.minStock) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => handleReorder(item.id)}
                  disabled={reorderingItems.includes(item.id)}
                  className={cn(
                    "flex-1 rounded-xl h-10 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl",
                    `bg-gradient-to-r ${urgencyColors[item.urgency]} hover:scale-105 text-white`,
                  )}
                >
                  {reorderingItems.includes(item.id) ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Reordering...
                    </div>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Reorder Now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDismiss(item.id)}
                  className="px-4 rounded-xl border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
