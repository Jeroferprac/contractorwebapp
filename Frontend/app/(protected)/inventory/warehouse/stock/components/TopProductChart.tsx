"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, TrendingUp, Users, Calendar, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { useMemo, useState, useEffect } from "react"
import type { WarehouseStock } from "@/types/warehouse"
import { getProducts } from "@/lib/inventory"
import type { Product } from "@/lib/inventory"
import { AnimatePresence } from "framer-motion"

interface TopProductChartProps {
  data: WarehouseStock[]
}

export function TopProductChart({ data }: TopProductChartProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)

  // Fetch products data
  useEffect(() => {
    async function fetchProducts() {
      try {
        const productsData = await getProducts()
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setProductsLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Create a map of product IDs to product names
  const productMap = useMemo(() => {
    const map: Record<string, Product> = {}
    products.forEach(product => {
      map[product.id] = product
    })
    return map
  }, [products])

  // Aggregate top 5 products by total quantity using real data
  const topProducts = useMemo(() => {
    if (!data.length) return []

    // Group by product_id and sum quantities
  const productTotals: Record<string, number> = {}
  data.forEach((item) => {
      const quantity = typeof item.quantity === 'string' ? parseFloat(item.quantity) || 0 : item.quantity || 0
      productTotals[item.product_id] = (productTotals[item.product_id] || 0) + quantity
  })

    // Convert to array, sort by quantity, and take top 5
    return Object.entries(productTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
      .map(([productId, quantity], i) => {
        const product = productMap[productId]
        const productName = product?.name || productId
        const displayName = productName.length > 20 ? productName.substring(0, 20) + "..." : productName
        
        return {
          id: productId,
          name: displayName,
          fullName: productName,
          sku: product?.sku || "N/A",
          category: product?.category || "N/A",
          brand: product?.brand || "N/A",
      quantity,
          percentage: 0, // Will be calculated below
          color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"][i % 5],
          status: quantity > 50 ? "High Stock" : quantity > 20 ? "Medium Stock" : "Low Stock",
          lastUpdated: new Date().toLocaleDateString(),
          warehouse: "Main Warehouse", // Mock data
          costPrice: product?.cost_price || 0,
          sellingPrice: product?.selling_price || 0,
          unit: product?.unit || "pcs",
        }
      })
  }, [data, productMap])

  // Calculate percentages based on the highest quantity
  const productsWithPercentages = useMemo(() => {
    if (topProducts.length === 0) return []
    
    const maxQuantity = Math.max(...topProducts.map(p => p.quantity))
    return topProducts.map(product => ({
      ...product,
      percentage: maxQuantity > 0 ? Math.round((product.quantity / maxQuantity) * 100) : 0
    }))
  }, [topProducts])

  // Calculate trend percentage
  const trendPercentage = useMemo(() => {
    if (productsWithPercentages.length === 0) return 4 // Default fallback
    
    const totalQuantity = productsWithPercentages.reduce((sum, product) => sum + product.quantity, 0)
    return Math.round((totalQuantity / 1000) * 4) // Simplified calculation
  }, [productsWithPercentages])

  if (productsLoading) {
    return (
      <Card className="bg-gradient-to-br from-card to-card/50 border shadow-lg hover:shadow-xl transition-all duration-500 group h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-500" />
            Top 5 Products
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-purple-200 rounded-full animate-spin border-t-purple-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading products...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border shadow-lg hover:shadow-xl transition-all duration-500 group h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 group-hover:text-purple-600 transition-colors">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 4 }}
          >
            <Package className="w-5 h-5 text-purple-500" />
          </motion.div>
          Top 5 Products
        </CardTitle>
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-medium">+{trendPercentage}%</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Stock levels by product</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {productsWithPercentages.map((product, i) => (
          <motion.div
            key={product.id}
            className="relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
          >
            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50/50 transition-all duration-200 cursor-pointer group/item">
              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 truncate group-hover/item:text-purple-600 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: product.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${product.percentage}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 min-w-[2.5rem] text-right">
                    {product.percentage}%
                  </span>
                </div>
              </div>

              {/* Quantity Display */}
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">
                  {product.quantity.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Hover Card */}
            <AnimatePresence>
              {hoveredProduct === product.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2"
                >
                  <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-sm text-gray-900">{product.fullName}</h5>
                          <p className="text-xs text-gray-500">{product.status}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Quantity: {product.quantity.toLocaleString()} {product.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">{product.warehouse}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">SKU: {product.sku}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: product.color }} />
                          <span className="text-gray-600">{product.percentage}% Complete</span>
                        </div>
                      </div>

                      {/* Additional Product Details */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{product.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Brand:</span>
                          <p className="font-medium">{product.brand}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost Price:</span>
                          <p className="font-medium">${typeof product.costPrice === 'number' ? product.costPrice.toFixed(2) : '0.00'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Selling Price:</span>
                          <p className="font-medium">${typeof product.sellingPrice === 'number' ? product.sellingPrice.toFixed(2) : '0.00'}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Stock Level</span>
                          <span className="font-medium" style={{ color: product.color }}>
                            {product.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${product.percentage}%`,
                              backgroundColor: product.color
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {productsWithPercentages.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-500">No product data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
