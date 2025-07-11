'use client'
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Package } from 'lucide-react'
import { getProducts } from '@/lib/inventory'

export default function FastMovingItems() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    getProducts().then(data => {
      // Example: sort by unitsSold or similar property if available
      // If not, just show the first few products
      setItems(data.slice(0, 7))
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fast Moving Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id || item.name} className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.units || 0} units</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 