'use client'
import { useEffect, useState } from 'react'
import { Card, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingCart, Package, FileText, Users } from 'lucide-react'
import { getProducts, getSuppliers, getLowStockProducts, getInventorySummary } from '@/lib/inventory'
import { motion } from "framer-motion";

type InventorySummary = {
  total_stock_value?: number;
  stock_value?: number;
  // add other fields if needed
};

export default function SalesSummaryCards() {
  const [products, setProducts] = useState<unknown[]>([])
  const [lowStock, setLowStock] = useState<unknown[]>([])
  const [suppliers, setSuppliers] = useState<unknown[]>([])
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

  const cardVariants = (i: number) => ({
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, type: "spring" as const, stiffness: 60 }
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 justify-center">
      {/* Card 1: Total Products */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants(0)}
      >
        <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-3 py-2 flex flex-col justify-between w-full max-w-xs min-w-[8.5rem] h-28 overflow-hidden transition duration-200 hover:scale-105 hover:shadow-2xl mx-auto">
          {/* Gradient accent bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-300">Total Products</CardTitle>
          </div>
          <CardDescription className="text-xl font-bold text-gray-900 dark:text-white text-center min-h-[1.5rem] flex items-center justify-center mt-2">
            {products.length}
          </CardDescription>
        </Card>
      </motion.div>
      {/* Card 2: Low Stock */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants(1)}
      >
        <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-3 py-2 flex flex-col justify-between w-full max-w-xs min-w-[8.5rem] h-28 overflow-hidden transition duration-200 hover:scale-105 hover:shadow-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400">
              <Package className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-300">Low Stock</CardTitle>
          </div>
          <CardDescription className="text-xl font-bold text-gray-900 dark:text-white text-center min-h-[1.5rem] flex items-center justify-center mt-2">
            {lowStock.length}
          </CardDescription>
        </Card>
      </motion.div>
      {/* Card 3: Suppliers */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants(2)}
      >
        <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-3 py-2 flex flex-col justify-between w-full max-w-xs min-w-[8.5rem] h-28 overflow-hidden transition duration-200 hover:scale-105 hover:shadow-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-green-400 via-teal-400 to-blue-400">
              <Users className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-300">Suppliers</CardTitle>
          </div>
          <CardDescription className="text-xl font-bold text-gray-900 dark:text-white text-center min-h-[1.5rem] flex items-center justify-center mt-2">
            {suppliers.length}
          </CardDescription>
        </Card>
      </motion.div>
      {/* Card 4: Stock Value */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={cardVariants(3)}
      >
        <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-3 py-2 flex flex-col justify-between w-full max-w-xs min-w-[8.5rem] h-28 overflow-hidden transition duration-200 hover:scale-105 hover:shadow-2xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-400" />
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-400 via-yellow-400 to-orange-400">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-[11px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-300">Stock Value</CardTitle>
          </div>
          <CardDescription className="text-xl font-bold text-gray-900 dark:text-white text-center min-h-[1.5rem] flex items-center justify-center mt-2">
            {stockValue === null ? (
              <span className="inline-block w-5 h-5 border-2 border-yellow-400 border-t-pink-400 rounded-full animate-spin" aria-label="Loading" />
            ) : (
              `₹${Number(stockValue).toLocaleString()}`
            )}
          </CardDescription>
        </Card>
      </motion.div>
    </div>
  )
}
