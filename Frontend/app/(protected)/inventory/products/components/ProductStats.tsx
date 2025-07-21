"use client"

import { motion } from "framer-motion"
import { Package, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/lib/inventory"

interface ProductStatsProps {
  products: Product[]
}

export function ProductStats({ products }: ProductStatsProps) {
  const activeProducts = products.filter((p) => Number(p.current_stock) > 0).length
  const lowStockItems = products.filter(
    (p) => Number(p.current_stock) <= Number(p.min_stock_level) && Number(p.current_stock) > 0,
  ).length

  const totalValue = products.reduce((sum, product) => {
    return sum + Number(product.current_stock) * Number(product.selling_price)
  }, 0)

  const valueStr = totalValue.toLocaleString();
  let valueClass = "text-4xl"; // default
  if (valueStr.length > 12) valueClass = "text-2xl";
  else if (valueStr.length > 9) valueClass = "text-3xl";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ y: -2 }}
      >
        <Card className="relative overflow-hidden bg-background border border-border rounded-xl lg:rounded-2xl shadow-lg hover:shadow-purple-500/25 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2 relative z-10">
            <CardTitle className="text-xs lg:text-sm font-semibold text-muted-foreground font-sans">
              Total Products
            </CardTitle>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Package className="h-4 w-4 lg:h-5 lg:w-5 text-purple-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2 font-sans">
              {products.length.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-purple-500 font-medium font-sans">
              <TrendingUp className="h-3 w-3 mr-1" />
              6.7% vs last month
            </div>
          </CardContent>
          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ y: -2 }}
      >
        <Card className="relative overflow-hidden bg-background border border-border rounded-xl lg:rounded-2xl shadow-lg hover:shadow-green-500/25 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2 relative z-10">
            <CardTitle className="text-xs lg:text-sm font-semibold text-muted-foreground font-sans">
              Active Products
            </CardTitle>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-green-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2 font-sans">
              {activeProducts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-500 font-medium font-sans">
              <TrendingUp className="h-3 w-3 mr-1" />
              3.9% vs last month
            </div>
          </CardContent>
          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl" />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card className="relative overflow-hidden bg-background border border-border rounded-xl lg:rounded-2xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2 relative z-10">
            <CardTitle className="text-xs lg:text-sm font-semibold text-muted-foreground font-sans">
              Low Stock Items
            </CardTitle>
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            >
              <AlertTriangle className="h-4 w-4 lg:h-5 lg:w-5 text-yellow-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2 font-sans">{lowStockItems}</div>
            <div className="flex items-center text-xs text-red-500 font-medium font-sans">
              <TrendingDown className="h-3 w-3 mr-1" />
              Needs attention
            </div>
          </CardContent>
          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-xl" />
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ y: -2 }}
      >
        <Card className="relative overflow-hidden bg-background border border-border rounded-xl lg:rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 lg:pb-2 relative z-10">
            <CardTitle className="text-xs lg:text-sm font-semibold text-muted-foreground font-sans">
              Total Value
            </CardTitle>
            <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
            </motion.div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="w-full min-w-0">
              <div
                className={`font-bold text-foreground mb-1 lg:mb-2 font-sans ${valueClass} truncate`}
                title={valueStr}
              >
                ${valueStr}
              </div>
            </div>
            <div className="flex items-center text-xs text-blue-500 font-medium font-sans">
              <TrendingUp className="h-3 w-3 mr-1" />
              12.3% vs last month
            </div>
          </CardContent>
          <div className="absolute -bottom-1 -right-1 lg:-bottom-2 lg:-right-2 w-12 h-12 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl" />
        </Card>
      </motion.div>
    </div>
  )
}
