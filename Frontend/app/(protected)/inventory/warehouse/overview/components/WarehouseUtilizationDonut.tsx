"use client"

import * as React from "react"
import { RadialBarChart, RadialBar, LabelList } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Warehouse as WarehouseIcon } from "lucide-react"
import { ResponsiveContainer } from "recharts"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"

interface WarehouseUtilizationDonutProps {
  warehouses?: Warehouse[]
  stocks?: WarehouseStock[]
}

interface WarehouseData {
  warehouse: string
  name: string
  value: number
  fill: string
  gradient: { primary: string; secondary: string }
  totalStock: number
  maxCapacity: number
}

const generateWarehouseColors = (count: number) => {
  const colors = [
    { primary: "#8b5cf6", secondary: "#a855f7" },
    { primary: "#06b6d4", secondary: "#0891b2" },
    { primary: "#10b981", secondary: "#059669" },
    { primary: "#f59e0b", secondary: "#d97706" },
    { primary: "#ef4444", secondary: "#dc2626" },
    { primary: "#8b5cf6", secondary: "#7c3aed" },
    { primary: "#06b6d4", secondary: "#0ea5e9" },
    { primary: "#10b981", secondary: "#16a34a" },
    { primary: "#f59e0b", secondary: "#ea580c" },
    { primary: "#ef4444", secondary: "#b91c1c" },
  ]
  
  return colors.slice(0, Math.min(count, 10))
}

export function WarehouseUtilizationDonut({
  warehouses = [],
  stocks = [],
}: WarehouseUtilizationDonutProps) {
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = React.useState<string>("all")
  const id = "warehouse-utilization"
  
  const warehouseData = React.useMemo((): WarehouseData[] => {
    if (!warehouses.length || !stocks.length) {
      return [
        {
          warehouse: "warehouse-1",
          value: 35,
          fill: "#8b5cf6",
          name: "Warehouse 1",
          gradient: { primary: "#8b5cf6", secondary: "#a855f7" },
          totalStock: 350,
          maxCapacity: 1000,
        },
        {
          warehouse: "warehouse-2",
          value: 25,
          fill: "#06b6d4",
          name: "Warehouse 2",
          gradient: { primary: "#06b6d4", secondary: "#0891b2" },
          totalStock: 250,
          maxCapacity: 1000,
        },
        {
          warehouse: "warehouse-3",
          value: 20,
          fill: "#10b981",
          name: "Warehouse 3",
          gradient: { primary: "#10b981", secondary: "#059669" },
          totalStock: 200,
          maxCapacity: 1000,
        },
        {
          warehouse: "warehouse-4",
          value: 15,
          fill: "#f59e0b",
          name: "Warehouse 4",
          gradient: { primary: "#f59e0b", secondary: "#d97706" },
          totalStock: 150,
          maxCapacity: 1000,
        },
      ]
    }

    const warehouseUtilization = warehouses.map((warehouse, index) => {
      const warehouseStocks = stocks.filter(
        (stock) => stock.warehouse_id === warehouse.id
      )
      const totalStock = warehouseStocks.reduce((sum, stock) => {
        const quantity =
          typeof stock.quantity === "string"
            ? parseFloat(stock.quantity) || 0
            : stock.quantity || 0
        return sum + quantity
      }, 0)
      
      const utilization = Math.min((totalStock / 1000) * 100, 100)
      const colors = generateWarehouseColors(warehouses.length)
      const color = colors[index % colors.length]
      
      return {
        warehouse: warehouse.id,
        name: warehouse.name,
        value: Math.round(utilization),
        fill: color.primary,
        gradient: color,
        totalStock,
        maxCapacity: 1000,
      }
    })

    return warehouseUtilization
  }, [warehouses, stocks])

  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(loadingTimer)
  }, [])

  const totalUtilization = React.useMemo(() => {
    if (!warehouseData.length) return 0
    const total = warehouseData.reduce((sum, warehouse) => sum + warehouse.value, 0)
    return Math.round(total / warehouseData.length)
  }, [warehouseData])

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-900 rounded-3xl overflow-hidden h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Warehouse Utilization
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="h-[300px] flex items-center justify-center">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-purple-200 dark:border-purple-800 border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin animate-reverse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      data-chart={id}
      className="group border-0 shadow-sm bg-white dark:bg-gray-900 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-1 h-full"
    >
      <CardHeader className="flex-row items-start space-y-0 pb-4">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Warehouse Utilization
          </CardTitle>
        </div>
        <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
          <SelectTrigger
            className="ml-auto h-8 w-12 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
            aria-label="Select a warehouse"
          >
            <WarehouseIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </SelectTrigger>
          <SelectContent
            align="end"
            className="rounded-xl border-gray-200 dark:border-gray-700 shadow-xl max-h-[200px] bg-white dark:bg-gray-900"
          >
            <SelectItem value="all" className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                All Warehouses
              </div>
            </SelectItem>
            {warehouseData.slice(0, 10).map((warehouse) => (
                <SelectItem
                key={warehouse.warehouse}
                value={warehouse.warehouse}
                className="rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                <div className="flex items-center gap-2">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-full shadow-sm"
                      style={{
                      background: `linear-gradient(135deg, ${warehouse.gradient.primary}, ${warehouse.gradient.secondary})`,
                      }}
                    />
                  <span className="truncate dark:text-gray-200">{warehouse.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {warehouse.value}%
                  </span>
                  </div>
                </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      {/* ✅ NEW RADIAL CHART SECTION BELOW */}
      <CardContent className="flex flex-1 justify-center pb-6">
        <div className="w-full h-[280px] sm:h-[320px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              innerRadius="30%"
              outerRadius="90%"
              startAngle={90}
              endAngle={-270}
              data={warehouseData}
            >
              <ChartTooltip 
                cursor={false} 
                content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as WarehouseData
                    return (
                      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: `linear-gradient(135deg, ${data.gradient.primary}, ${data.gradient.secondary})`,
                            }}
                          />
                          <span className="font-semibold text-gray-900 dark:text-gray-100">{data.name}</span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Utilization: <span className="font-semibold text-gray-900 dark:text-gray-100">{data.value}%</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Stock: <span className="font-semibold text-gray-900 dark:text-gray-100">{data.totalStock.toLocaleString()}</span>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Capacity: <span className="font-semibold text-gray-900 dark:text-gray-100">{data.maxCapacity.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <RadialBar
                minAngle={15}
                background
                clockWise
              dataKey="value"
                cornerRadius={10}
              >
                <LabelList
                  dataKey="name"
                  position="insideStart"
                  className="fill-white capitalize mix-blend-luminosity"
                />
              </RadialBar>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
