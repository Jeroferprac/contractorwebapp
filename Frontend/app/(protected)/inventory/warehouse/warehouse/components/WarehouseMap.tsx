"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"

interface BinMapViewProps {
  warehouses: Warehouse[]
  stocks: WarehouseStock[]
}

interface BinLocation {
  id: string
  binCode: string
  warehouseId: string
  warehouseName: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  x: number
  y: number
  status: 'active' | 'nearly-full' | 'full' | 'empty'
}

export function BinMapView({ warehouses, stocks }: BinMapViewProps) {
  const [selectedBin, setSelectedBin] = useState<BinLocation | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Generate bin locations from real stock data
  const binLocations = useMemo(() => {
    const bins: BinLocation[] = []
    
    stocks.forEach((stock, index) => {
      if (stock.bin_location) {
        const warehouse = warehouses.find(w => w.id === stock.warehouse_id)
        const quantity = typeof stock.quantity === 'string' ? parseFloat(stock.quantity) : stock.quantity || 0
        const reservedQty = typeof stock.reserved_quantity === 'string' ? parseFloat(stock.reserved_quantity) : stock.reserved_quantity || 0
        const availableQty = typeof stock.available_quantity === 'string' ? parseFloat(stock.available_quantity) : stock.available_quantity || 0
        
        // Calculate status based on quantity
        let status: 'active' | 'nearly-full' | 'full' | 'empty' = 'empty'
        if (quantity > 0) {
          if (quantity >= 100) status = 'full'
          else if (quantity >= 50) status = 'nearly-full'
          else status = 'active'
        }

        // Generate position based on warehouse and bin location
        const warehouseIndex = warehouses.findIndex(w => w.id === stock.warehouse_id)
        const zoneX = 50 + (warehouseIndex % 2) * 250
        const zoneY = 50 + Math.floor(warehouseIndex / 2) * 200
        
        // Position within zone based on bin location
        const binNumber = parseInt(stock.bin_location.replace(/\D/g, '')) || index
        const x = zoneX + 50 + (binNumber % 3) * 50
        const y = zoneY + 50 + Math.floor((binNumber % 6) / 3) * 60

        bins.push({
          id: stock.id,
          binCode: stock.bin_location,
          warehouseId: stock.warehouse_id,
          warehouseName: warehouse?.name || 'Unknown Warehouse',
          quantity,
          reservedQuantity: reservedQty,
          availableQuantity: availableQty,
          x,
          y,
          status
        })
      }
    })

    // Add some empty bins for visual balance
    warehouses.forEach((warehouse, warehouseIndex) => {
      const existingBins = bins.filter(bin => bin.warehouseId === warehouse.id)
      const zoneX = 50 + (warehouseIndex % 2) * 250
      const zoneY = 50 + Math.floor(warehouseIndex / 2) * 200
      
      // Add empty bins if needed
      for (let i = existingBins.length; i < 6; i++) {
        const x = zoneX + 50 + (i % 3) * 50
        const y = zoneY + 50 + Math.floor(i / 3) * 60
        
        bins.push({
          id: `empty-${warehouse.id}-${i}`,
          binCode: `BIN-${warehouse.code}-${String.fromCharCode(65 + i)}`,
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          quantity: 0,
          reservedQuantity: 0,
          availableQuantity: 0,
          x,
          y,
          status: 'empty'
        })
      }
    })

    return bins
  }, [warehouses, stocks])

  // Group bins by warehouse for zone display
  const warehouseZones = useMemo(() => {
    const zones: { warehouse: Warehouse; bins: BinLocation[] }[] = []
    
    warehouses.forEach(warehouse => {
      const warehouseBins = binLocations.filter(bin => bin.warehouseId === warehouse.id)
      zones.push({ warehouse, bins: warehouseBins })
    })
    
    return zones
  }, [warehouses, binLocations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981'
      case 'nearly-full': return '#f59e0b'
      case 'full': return '#ef4444'
      case 'empty': return '#94a3b8'
      default: return '#94a3b8'
    }
  }

  const handleBinClick = (bin: BinLocation, event: React.MouseEvent) => {
    setSelectedBin(bin)
    setTooltipPosition({ x: event.clientX, y: event.clientY })
  }

  const handleMouseLeave = () => {
    setSelectedBin(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Warehouse Layout</h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-white/80 dark:bg-slate-800/80 border-white/20 rounded-2xl"
          >
            <ZoomIn className="h-4 w-4 mr-2" />
            Zoom In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-white/80 dark:bg-slate-800/80 border-white/20 rounded-2xl"
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Zoom Out
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-white/80 dark:bg-slate-800/80 border-white/20 rounded-2xl"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-white/80 dark:bg-slate-800/80 border-white/20 rounded-2xl"
          >
            <Maximize className="h-4 w-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      <Card className="p-8 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg rounded-3xl">
        <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl overflow-hidden">
          {/* Warehouse Layout SVG */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            style={{
              background:
                'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="%23f8fafc"/><rect width="1" height="20" fill="%23e2e8f0"/><rect width="20" height="1" fill="%23e2e8f0"/></svg>\')',
            }}
          >
            {/* Render warehouse zones */}
            {warehouseZones.map((zone, zoneIndex) => {
              const zoneX = 50 + (zoneIndex % 2) * 250
              const zoneY = 50 + Math.floor(zoneIndex / 2) * 200
              
              return (
                <g key={zone.warehouse.id}>
                  {/* Zone rectangle */}
              <rect
                    x={zoneX}
                    y={zoneY}
                width="200"
                height="150"
                fill="rgba(59, 130, 246, 0.1)"
                stroke="rgba(59, 130, 246, 0.3)"
                strokeWidth="2"
                rx="16"
              />
                  <text 
                    x={zoneX + 100} 
                    y={zoneY - 10} 
                    textAnchor="middle" 
                    className="fill-slate-600 text-sm font-medium"
                  >
                    {zone.warehouse.name}
              </text>

                  {/* Bins in this zone */}
                  {zone.bins.map((bin, binIndex) => (
              <motion.circle
                      key={bin.id}
                      cx={bin.x}
                      cy={bin.y}
                r="8"
                      fill={getStatusColor(bin.status)}
                className="cursor-pointer"
                whileHover={{ scale: 1.2 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                      transition={{ delay: 0.1 + binIndex * 0.05 }}
                      onClick={(e) => handleBinClick(bin, e)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </g>
              )
            })}
          </svg>

          {/* Tooltip */}
          <AnimatePresence>
            {selectedBin && (
          <motion.div
                className="absolute bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-white/20 pointer-events-none z-10"
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y - 10,
                  transform: 'translate(-50%, -100%)'
                }}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                transition={{ duration: 0.2 }}
          >
            <div className="space-y-2">
                  <p className="font-semibold text-sm">{selectedBin.binCode}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {selectedBin.quantity}/{selectedBin.quantity + selectedBin.availableQuantity} items 
                    ({selectedBin.quantity > 0 ? Math.round((selectedBin.quantity / (selectedBin.quantity + selectedBin.availableQuantity)) * 100) : 0}% full)
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedBin.warehouseName}
                  </p>
              <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-xl">
                    {selectedBin.status === 'active' ? 'Active' : 
                     selectedBin.status === 'nearly-full' ? 'Nearly Full' :
                     selectedBin.status === 'full' ? 'Full' : 'Empty'}
              </Badge>
            </div>
          </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Active ({"<"}50 items)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Nearly Full (50-99 items)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Full ({">"}100 items)</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 rounded-full bg-slate-400"></div>
            <span className="text-sm text-slate-600 dark:text-slate-400">Empty</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
