"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Building2, Filter, RotateCcw } from "lucide-react"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StockByWarehouseChartProps {
  data: WarehouseStock[]
  warehouses: Warehouse[]
}

export function StockByWarehouseChart({ data, warehouses }: StockByWarehouseChartProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all")
  const [autoRotate, setAutoRotate] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Aggregate stock data by warehouse
  const warehouseData = useMemo(() => {
    if (!data.length || !warehouses.length) return []
    const warehouseMap = new Map(warehouses.map((w) => [w.id, w.name]))
    const stockByWarehouse: Record<string, number> = {}

    data.forEach((item) => {
      const quantity = typeof item.quantity === "string" ? Number.parseFloat(item.quantity) || 0 : item.quantity || 0
      const warehouseName = warehouseMap.get(item.warehouse_id) || item.warehouse_id
      stockByWarehouse[warehouseName] = (stockByWarehouse[warehouseName] || 0) + quantity
    })

    return Object.entries(stockByWarehouse)
      .map(([name, stock], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + "..." : name,
        fullName: name,
        stock,
        color: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4", "#84cc16", "#f97316"][index % 8],
        gradientId: `gradient-${index}`,
      }))
      .sort((a, b) => b.stock - a.stock)
  }, [data, warehouses])

  // Filter data based on selected warehouse
  const filteredData = useMemo(() => {
    if (selectedWarehouse === "all") {
      return warehouseData.slice(0, 8)
    }
    return warehouseData.filter((item) => item.fullName === selectedWarehouse)
  }, [warehouseData, selectedWarehouse])

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || filteredData.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredData.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [autoRotate, filteredData.length])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl p-4 border border-purple-200/50">
          <p className="font-bold text-gray-900 mb-2">{data.fullName}</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <p className="text-purple-600 font-semibold">Stock: {data.stock.toLocaleString()}</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-0 shadow-2xl hover:shadow-purple-500/10 transition-all duration-700 group overflow-hidden">
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
            >
              <Building2 className="w-5 h-5 text-white" />
            </motion.div>
            <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent font-bold">
              Stock by Warehouse
            </CardTitle>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className={`rounded-xl border-2 transition-all duration-300 ${
                autoRotate
                  ? "bg-purple-100 text-purple-700 border-purple-300 shadow-lg"
                  : "bg-white border-gray-200 hover:border-purple-300"
              }`}
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${autoRotate ? "animate-spin" : ""}`} />
              Auto
            </Button>
            <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
              <SelectTrigger className="w-48 rounded-xl border-2 border-purple-200/50 bg-white/80 hover:bg-white hover:border-purple-300 transition-all duration-300 shadow-lg">
                <Filter className="w-4 h-4 mr-2 text-purple-500" />
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 border-purple-200/50 shadow-2xl bg-white/95 backdrop-blur-xl">
                <SelectItem value="all" className="rounded-xl hover:bg-purple-50">
                  All Warehouses
                </SelectItem>
                {warehouseData.map((warehouse) => (
                  <SelectItem
                    key={warehouse.fullName}
                    value={warehouse.fullName}
                    className="rounded-xl hover:bg-purple-50"
                  >
                    {warehouse.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardDescription className="text-gray-600 font-medium">
          Inventory levels across all warehouse locations
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 relative">
        <div className="w-full h-[280px] sm:h-[320px] lg:h-[350px] px-6 pb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                {filteredData.map((item, index) => (
                  <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={item.color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={item.color} stopOpacity={0.4} />
                  </linearGradient>
                ))}
                <filter id="barShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.1" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.6} />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                tickMargin={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
                tickFormatter={(value: number) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`
                  }
                  return value.toLocaleString()
                }}
                width={60}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="stock"
                radius={[8, 8, 0, 0]}
                animationDuration={1500}
                filter="url(#barShadow)"
              >
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
