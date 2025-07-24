"use client"

import { motion } from "framer-motion"
import { MapPin, Package, MoreVertical, Edit, Eye, Archive, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getWarehouse } from "@/lib/warehouse"

interface WarehouseCardWarehouse {
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

interface WarehouseCardProps {
  warehouseId: string
  onSelect: () => void
  isSelected: boolean
}

export function WarehouseCard({ warehouseId, onSelect, isSelected }: WarehouseCardProps) {
  const [warehouse, setWarehouse] = useState<WarehouseCardWarehouse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mapping function for UI fields
  function mapWarehouseToCardWarehouse(w: any): WarehouseCardWarehouse {
    return {
      ...w,
      totalBins: 0, // TODO: Replace with real value if available
      stockCount: 0, // TODO: Replace with real value if available
      status: "active", // TODO: Replace with real value if available
      region: w.address || "N/A", // Or use a real region field if available
      manager: w.contact_person || "N/A",
      utilization: 0, // TODO: Replace with real value if available
      lastUpdated: w.updated_at || w.created_at,
    }
  }

  useEffect(() => {
    setLoading(true)
    getWarehouse(warehouseId)
      .then((data) => {
        setWarehouse(mapWarehouseToCardWarehouse(data))
        setLoading(false)
      })
      .catch((err) => {
        setError("Failed to load warehouse data.")
        setLoading(false)
      })
  }, [warehouseId])

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-500 border-green-500/20"
      : "bg-red-500/10 text-red-500 border-red-500/20"
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-500"
    if (utilization >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  if (loading) {
    return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>
  }
  if (error || !warehouse) {
    return <div className="min-h-[200px] flex items-center justify-center text-red-500">{error || "No data"}</div>
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group"
    >
      <Card
        className={`bg-gradient-to-br from-card to-card/50 border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden relative ${
          isSelected ? "ring-2 ring-purple-500 border-purple-500/50" : "hover:border-purple-500/30"
        }`}
        onClick={onSelect}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg group-hover:text-purple-600 transition-colors">
                  {warehouse.name}
                </h3>
                <Badge className={getStatusColor(warehouse.status)}>{warehouse.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="group-hover:text-foreground/80 transition-colors">{warehouse.address}</span>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Warehouse
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total Bins</span>
              </div>
              <p className="text-2xl font-bold group-hover:text-blue-600 transition-colors">{warehouse.totalBins}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Stock Count</span>
              </div>
              <p className="text-2xl font-bold group-hover:text-green-600 transition-colors">
                {warehouse.stockCount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Utilization */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Utilization</span>
              <span className={`text-sm font-medium ${getUtilizationColor(warehouse.utilization)}`}>
                {warehouse.utilization}%
              </span>
            </div>
            <Progress value={warehouse.utilization} className="h-2 group-hover:scale-105 transition-transform" />
          </div>

          {/* Manager */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/50">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                {warehouse.manager
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium group-hover:text-purple-600 transition-colors">{warehouse.manager}</p>
              <p className="text-xs text-muted-foreground">Warehouse Manager</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
