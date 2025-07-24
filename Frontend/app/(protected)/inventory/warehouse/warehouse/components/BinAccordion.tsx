"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Package, QrCode, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getWarehouseStocks } from "@/lib/warehouse"

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

interface Bin {
  id: string
  name: string
  type: "raw" | "finished" | "staging" | "returns"
  capacity: number
  currentStock: number
  zone: string
  lastUpdated: string
  qrCode: string
}

interface BinAccordionProps {
  warehouseId: string
  warehouse: Warehouse
}

export function BinAccordion({ warehouseId, warehouse }: BinAccordionProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [zoneFilter, setZoneFilter] = useState("all")
  const [bins, setBins] = useState<Bin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getWarehouseStocks().then((stocks) => {
      // Filter stocks for this warehouse and group by bin_location
      const binMap: Record<string, Bin> = {}
      stocks.filter((s) => s.warehouse_id === warehouseId && s.bin_location).forEach((s) => {
        if (!binMap[s.bin_location!]) {
          binMap[s.bin_location!] = {
            id: s.bin_location!,
            name: s.bin_location!,
            type: "raw", // TODO: Replace with real type if available
            capacity: 1000, // TODO: Replace with real capacity if available
            currentStock: s.quantity,
            zone: "Zone A", // TODO: Replace with real zone if available
            lastUpdated: s.updated_at || s.created_at,
            qrCode: s.bin_location!,
          }
        } else {
          binMap[s.bin_location!].currentStock += s.quantity
        }
      })
      setBins(Object.values(binMap))
      setLoading(false)
    })
  }, [warehouseId])

  const filteredBins = bins.filter((bin) => {
    const matchesSearch =
      bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bin.zone.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || bin.type === typeFilter
    const matchesZone = zoneFilter === "all" || bin.zone === zoneFilter
    return matchesSearch && matchesType && matchesZone
  })

  const getTypeColor = (type: string) => {
    const colors = {
      raw: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      finished: "bg-green-500/10 text-green-500 border-green-500/20",
      staging: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      returns: "bg-red-500/10 text-red-500 border-red-500/20",
    }
    return colors[type as keyof typeof colors] || colors.raw
  }

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return "text-red-500"
    if (utilization >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  const zones = Array.from(new Set(bins.map((bin) => bin.zone)))

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                Bin Locations - {warehouse.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{filteredBins.length} bins</Badge>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search bins..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="raw">Raw Materials</SelectItem>
                  <SelectItem value="finished">Finished Goods</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="returns">Returns</SelectItem>
                </SelectContent>
              </Select>

              <Select value={zoneFilter} onValueChange={setZoneFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  {zones.map((zone) => (
                    <SelectItem key={zone} value={zone}>
                      {zone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bin Grid */}
            <AnimatePresence>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBins.map((bin, index) => {
                  const utilization = (bin.currentStock / bin.capacity) * 100

                  return (
                    <motion.div
                      key={bin.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group"
                    >
                      <Card className="bg-gradient-to-br from-background to-background/50 border hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-4 space-y-3">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold group-hover:text-purple-600 transition-colors">
                                {bin.name}
                              </h4>
                              <Badge className={getTypeColor(bin.type)}>{bin.type}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10"
                            >
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Zone */}
                          <p className="text-sm text-muted-foreground">{bin.zone}</p>

                          {/* Capacity */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Capacity</span>
                              <span className={`text-sm font-medium ${getUtilizationColor(utilization)}`}>
                                {bin.currentStock} / {bin.capacity}
                              </span>
                            </div>
                            <Progress value={utilization} className="h-2 group-hover:scale-105 transition-transform" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{utilization.toFixed(1)}% full</span>
                              <span>{bin.capacity - bin.currentStock} available</span>
                            </div>
                          </div>

                          {/* Last Updated */}
                          <p className="text-xs text-muted-foreground">
                            Updated: {new Date(bin.lastUpdated).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredBins.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <h3 className="font-medium mb-1">No bins found</h3>
                <p className="text-sm text-muted-foreground">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
