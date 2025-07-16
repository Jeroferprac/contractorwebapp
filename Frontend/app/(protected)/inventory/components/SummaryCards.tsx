'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Package, FileText, Users } from 'lucide-react'
import { getProducts, getSuppliers, getLowStockProducts, getInventorySummary } from '@/lib/inventory'

type InventorySummary = {
  total_stock_value?: number;
  stock_value?: number;
  // add other fields if needed
};

export default function SalesSummaryCards() {
  const [products, setProducts] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [stockValue, setStockValue] = useState<number | null>(null)

  useEffect(() => {
    getProducts().then(setProducts)
    getLowStockProducts().then(setLowStock)
    getSuppliers().then(setSuppliers)
    getInventorySummary().then((data: InventorySummary) => {
      console.log("Inventory summary response:", data);
      setStockValue(data.total_stock_value || data.stock_value || null)
    })
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600">Total Products</p>
              <p className="text-1xl font-bold">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600">Low Stock</p>
              <p className="text-1xl font-bold">{lowStock.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600">Suppliers</p>
              <p className="text-1xl font-bold">{suppliers.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mt-1">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      {/* You can keep the last card static or add more logic as needed */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-600">Stock Value</p>
              <p className="text-1xl font-bold">
                {stockValue === null ? "Loading..." : `₹${Number(stockValue).toLocaleString()}`}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mt-1">
              <FileText className="h-6 w-6 text-pink-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
