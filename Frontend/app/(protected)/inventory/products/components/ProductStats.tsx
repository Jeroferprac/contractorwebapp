"use client"

import { motion } from "framer-motion"
import { Package, CheckCircle, Star, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "./ProductTable"

interface ProductStatsProps {
  products: Product[]
}

export function ProductStats({ products }: ProductStatsProps) {
  const activeProducts = products.filter((p) => Number(p.current_stock) > 0).length
  const lowStockItems = products.filter(
    (p) => Number(p.current_stock) <= Number(p.min_stock_level) && Number(p.current_stock) > 0,
  ).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="bg-gradient-to-br from-blue-200/60 to-blue-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">All Products</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{products.length.toLocaleString()}</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              6.7% vs last month
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="bg-gradient-to-br from-green-200/60 to-green-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Active Products</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{activeProducts.toLocaleString()}</div>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              3.9% vs last month
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="bg-gradient-to-br from-red-200/60 to-red-400/30 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Low Stock Items</CardTitle>
            <Star className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">{lowStockItems}</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              Needs attention
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
