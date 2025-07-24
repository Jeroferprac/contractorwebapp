"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Package, Eye, Settings } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface Warehouse {
  id: string
  name: string
  address: string
  totalBins: number
  stockCount: number
  status: "active" | "inactive"
  region: string
  manager: string
  utilization: number
  lastUpdated: string
}

interface WarehouseMapProps {
  warehouses: Warehouse[]
  selectedWarehouse: string | null
  onWarehouseSelect: (id: string) => void
}

export function WarehouseMap({ warehouses, selectedWarehouse, onWarehouseSelect }: WarehouseMapProps) {
  const [showBins, setShowBins] = useState(false)

  // Dynamically generate map regions from warehouse data
  const uniqueRegions = Array.from(new Set(warehouses.map(w => w.region || "Unknown")))
  const regionColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#6366f1"]
  const mapRegions = uniqueRegions.map((region, idx) => ({
    id: region.toLowerCase().replace(/\s+/g, "-"),
    name: region,
    x: 20 + (idx * 20), // Spread out regions horizontally (customize as needed)
    y: 40 + (idx * 10), // Spread out regions vertically (customize as needed)
    color: regionColors[idx % regionColors.length],
  }))

  const getWarehousePosition = (warehouse: Warehouse) => {
    const regionIdx = uniqueRegions.indexOf(warehouse.region || "Unknown")
    const region = mapRegions[regionIdx]
    if (region) {
      return { x: region.x, y: region.y }
    }
    return { x: 50, y: 50 }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Map View */}
      <div className="lg:col-span-3">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg h-[600px]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Warehouse Distribution Map
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Switch id="show-bins" checked={showBins} onCheckedChange={setShowBins} />
                <Label htmlFor="show-bins" className="text-sm">
                  Show Bins
                </Label>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg overflow-hidden">
              {/* Background Map Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" className="absolute inset-0">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Region Zones */}
              {mapRegions.map((region) => (
                <motion.div
                  key={region.id}
                  className="absolute w-32 h-24 rounded-lg border-2 border-dashed opacity-30 hover:opacity-60 transition-opacity"
                  style={{
                    left: `${region.x}%`,
                    top: `${region.y}%`,
                    borderColor: region.color,
                    backgroundColor: `${region.color}20`,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute -top-6 left-2 text-xs font-medium" style={{ color: region.color }}>
                    {region.name}
                  </div>
                </motion.div>
              ))}

              {/* Warehouse Markers */}
              {warehouses.map((warehouse) => {
                const position = getWarehousePosition(warehouse)
                const isSelected = selectedWarehouse === warehouse.id

                return (
                  <motion.div
                    key={warehouse.id}
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                      isSelected ? "z-20" : "z-10"
                    }`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onWarehouseSelect(warehouse.id)}
                  >
                    {/* Warehouse Pin */}
                    <div
                      className={`w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-300 ${
                        isSelected
                          ? "bg-purple-500 border-purple-600 shadow-purple-500/50"
                          : warehouse.status === "active"
                            ? "bg-green-500 border-green-600 hover:bg-green-600"
                            : "bg-red-500 border-red-600 hover:bg-red-600"
                      }`}
                    >
                      <Package className="w-4 h-4 text-white m-auto mt-1" />
                    </div>

                    {/* Tooltip */}
                    <motion.div
                      className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-card border shadow-lg rounded-lg p-3 min-w-48 ${
                        isSelected ? "opacity-100" : "opacity-0 hover:opacity-100"
                      } transition-opacity duration-200`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: isSelected ? 1 : 0, y: isSelected ? 0 : 10 }}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{warehouse.name}</h4>
                          <Badge
                            className={
                              warehouse.status === "active"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }
                          >
                            {warehouse.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{warehouse.address}</p>
                        <div className="flex justify-between text-xs">
                          <span>Bins: {warehouse.totalBins}</span>
                          <span>Stock: {warehouse.stockCount.toLocaleString()}</span>
                        </div>
                        {showBins && (
                          <div className="pt-2 border-t">
                            <div className="grid grid-cols-4 gap-1">
                              {Array.from({ length: Math.min(12, warehouse.totalBins) }).map((_, i) => (
                                <div key={i} className="w-3 h-3 rounded-sm bg-blue-500/20 border border-blue-500/40" />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-card" />
                    </motion.div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse List Sidebar */}
      <div className="space-y-4">
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Warehouses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warehouses.map((warehouse) => (
              <motion.div
                key={warehouse.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedWarehouse === warehouse.id
                    ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30"
                    : "hover:bg-muted/50 hover:border-border"
                }`}
                onClick={() => onWarehouseSelect(warehouse.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{warehouse.name}</h4>
                  <Badge
                    className={
                      warehouse.status === "active"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {warehouse.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{warehouse.region}</p>
                <div className="flex justify-between text-xs">
                  <span>Bins: {warehouse.totalBins}</span>
                  <span>{warehouse.utilization}% full</span>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Map Controls */}
        <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Map Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              View All Warehouses
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Map Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
