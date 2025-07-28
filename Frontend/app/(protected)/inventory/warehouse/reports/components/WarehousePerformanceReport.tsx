"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, TrendingUp, Users, Building, Activity } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import type { Warehouse, WarehouseStock, WarehouseTransfer } from "@/types/warehouse"

interface WarehousePerformanceReportProps {
  warehouses: Warehouse[]
  stocks: WarehouseStock[]
  transfers: WarehouseTransfer[]
}

export function WarehousePerformanceReport({ warehouses, stocks, transfers }: WarehousePerformanceReportProps) {
  const performanceData = useMemo(() => {
    return warehouses.map(warehouse => {
      // Calculate stock metrics
      const warehouseStocks = stocks.filter(stock => stock.warehouse_id === warehouse.id)
      const totalStock = warehouseStocks.reduce((sum, stock) => sum + (stock.quantity || 0), 0)
      const totalReserved = warehouseStocks.reduce((sum, stock) => sum + (stock.reserved_quantity || 0), 0)
      const totalAvailable = totalStock - totalReserved // Calculate available from total - reserved
      
      // Calculate transfer metrics
      const outboundTransfers = transfers.filter(t => t.from_warehouse_id === warehouse.id)
      const inboundTransfers = transfers.filter(t => t.to_warehouse_id === warehouse.id)
      const completedTransfers = outboundTransfers.filter(t => t.status === 'completed')
      
      // Calculate performance scores (0-100)
      const stockUtilization = totalStock > 0 ? (totalReserved / totalStock) * 100 : 0
      const transferEfficiency = outboundTransfers.length > 0 ? (completedTransfers.length / outboundTransfers.length) * 100 : 0
      const activityLevel = (outboundTransfers.length + inboundTransfers.length) * 10 // Scale factor
      const binUtilization = warehouseStocks.length * 5 // Simple metric based on number of products
      
      // Overall performance score
      const overallScore = (stockUtilization + transferEfficiency + Math.min(activityLevel, 100) + binUtilization) / 4
      
      return {
        id: warehouse.id,
        name: warehouse.name,
        code: warehouse.code || 'N/A',
        contactPerson: warehouse.contact_person || 'N/A',
        isActive: true, // Assume active since we don't have is_active property
        totalStock,
        totalReserved,
        totalAvailable,
        stockUtilization,
        transferEfficiency,
        activityLevel: Math.min(activityLevel, 100),
        binUtilization,
        overallScore,
        outboundTransfers: outboundTransfers.length,
        inboundTransfers: inboundTransfers.length,
        completedTransfers: completedTransfers.length,
        uniqueProducts: warehouseStocks.length,
        binLocations: new Set(warehouseStocks.map(s => s.bin_location)).size
      }
    }).sort((a, b) => b.overallScore - a.overallScore) // Sort by performance
  }, [warehouses, stocks, transfers])

  const topPerformers = performanceData.slice(0, 3)
  const averagePerformance = performanceData.reduce((sum, warehouse) => sum + warehouse.overallScore, 0) / performanceData.length

  const radarData = useMemo(() => {
    return performanceData.map(warehouse => ({
      warehouse: warehouse.name,
      'Stock Utilization': warehouse.stockUtilization,
      'Transfer Efficiency': warehouse.transferEfficiency,
      'Activity Level': warehouse.activityLevel,
      'Bin Utilization': warehouse.binUtilization
    }))
  }, [performanceData])

  const performanceComparison = useMemo(() => {
    return performanceData.map(warehouse => ({
      name: warehouse.name,
      score: warehouse.overallScore,
      transfers: warehouse.outboundTransfers + warehouse.inboundTransfers,
      products: warehouse.uniqueProducts
    }))
  }, [performanceData])

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{averagePerformance.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Warehouses</p>
                <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Building className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Warehouses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {warehouses.length} {/* All warehouses are considered active */}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transfers</p>
                <p className="text-2xl font-bold text-gray-900">{transfers.length}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-xl">
                <Star className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500">
        <CardHeader className="border-b border-gray-100 py-5">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Top Performing Warehouses
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {topPerformers.map((warehouse, index) => (
              <div key={warehouse.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{warehouse.name}</h3>
                      <p className="text-sm text-gray-600">Contact: {warehouse.contactPerson}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{warehouse.code}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Performance: <span className="font-semibold text-gray-900">{warehouse.overallScore.toFixed(1)}%</span></span>
                    <span className="text-gray-600">Transfers: <span className="font-semibold text-gray-900">{warehouse.outboundTransfers + warehouse.inboundTransfers}</span></span>
                    <span className="text-gray-600">Products: <span className="font-semibold text-gray-900">{warehouse.uniqueProducts}</span></span>
                  </div>
                  <Progress value={warehouse.overallScore} className="h-2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Radar Chart */}
      <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
        <CardHeader className="border-b border-gray-100 py-5">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Warehouse Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData.slice(0, 3)}> {/* Show top 3 warehouses */}
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="warehouse" tick={{ fontSize: 12, fill: '#6b7280' }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Radar
                  name="Stock Utilization"
                  dataKey="Stock Utilization"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Transfer Efficiency"
                  dataKey="Transfer Efficiency"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Activity Level"
                  dataKey="Activity Level"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Bin Utilization"
                  dataKey="Bin Utilization"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4">
                          <div className="font-semibold text-gray-900 mb-2">{label}</div>
                          <div className="space-y-1">
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-gray-600">{entry.name}:</span>
                                <span className="font-semibold text-gray-900">{entry.value}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
        <CardHeader className="border-b border-gray-100 py-5">
          <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4">
                          <div className="font-semibold text-gray-900 mb-2">{label}</div>
                          <div className="space-y-1">
                            {payload.map((entry: any, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-sm text-gray-600">{entry.name}:</span>
                                <span className="font-semibold text-gray-900">{entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="Performance Score" />
                <Bar dataKey="transfers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Transfers" />
                <Bar dataKey="products" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Unique Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Warehouse Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {performanceData.map((warehouse) => (
          <Card key={warehouse.id} className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-900">{warehouse.name}</CardTitle>
                <Badge 
                  variant={warehouse.isActive ? "default" : "secondary"}
                  className="text-xs"
                >
                  {warehouse.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Score */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Performance Score</span>
                  <span className="text-sm font-medium text-gray-900">{warehouse.overallScore.toFixed(1)}%</span>
                </div>
                <Progress value={warehouse.overallScore} className="h-2" />
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-gray-600">Stock Utilization</div>
                  <div className="font-semibold text-gray-900">{warehouse.stockUtilization.toFixed(1)}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-600">Transfer Efficiency</div>
                  <div className="font-semibold text-gray-900">{warehouse.transferEfficiency.toFixed(1)}%</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-600">Total Transfers</div>
                  <div className="font-semibold text-gray-900">{warehouse.outboundTransfers + warehouse.inboundTransfers}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-600">Unique Products</div>
                  <div className="font-semibold text-gray-900">{warehouse.uniqueProducts}</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
                <Users className="w-3 h-3" />
                <span>{warehouse.contactPerson}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 