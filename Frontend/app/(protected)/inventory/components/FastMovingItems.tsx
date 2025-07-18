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
    <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-4 py-4 border-0 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-200">Fast Moving Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0 relative z-10">
        {items.map((item, idx) => (
          <div
            key={item.id || item.name}
            className="flex items-center space-x-3 rounded-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-gray-50 dark:hover:bg-[#23263A]/60 px-2 py-1"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-md ${idx % 2 === 0 ? 'bg-gradient-to-br from-green-400 via-teal-400 to-blue-400' : 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400'}`}>
              <Package className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-xs text-gray-900 dark:text-white truncate">{item.name}</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
              {item.units || 0} units
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 