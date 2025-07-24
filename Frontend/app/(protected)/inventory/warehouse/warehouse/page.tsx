"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, MapPin, Package, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WarehouseCard } from "./components/WarehouseCard"
import { WarehouseMap } from "./components/WarehouseMap"
import { BinAccordion } from "./components/BinAccordion"
import { WarehouseFilterBar } from "./components/WarehouseFilterBar"
import { getWarehouses } from "@/lib/warehouse"
import type { Warehouse, WarehouseCardWarehouse } from "@/types/warehouse"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

// Add mapping function for UI fields
function mapWarehouseToCardWarehouse(w: Warehouse): WarehouseCardWarehouse {
  return {
    ...w,
    address: w.address ?? "N/A",
    totalBins: 0, // TODO: Replace with real value if available
    stockCount: 0, // TODO: Replace with real value if available
    status: "active", // TODO: Replace with real value if available
    region: w.address ?? "N/A", // Or use a real region field if available
    manager: w.contact_person || "N/A",
    utilization: 0, // TODO: Replace with real value if available
    lastUpdated: w.updated_at || w.created_at,
  }
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseCardWarehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const data = await getWarehouses()
      // Map to UI type
      setWarehouses(data.map(mapWarehouseToCardWarehouse))
      setLoading(false)
    }
    fetchData()
  }, [])

  // Remove warehouseCards and mapWarehouseApiToCard
  const uniqueRegions = Array.from(new Set(warehouses.map(w => w.region).filter(Boolean)))
  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      (warehouse.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (warehouse.address?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || (warehouse as any).status === statusFilter || (warehouse as any).is_active === (statusFilter === "active")
    const matchesRegion = regionFilter === "all" || (warehouse as any).region === regionFilter
    return matchesSearch && matchesStatus && matchesRegion
  })

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading warehouses...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Warehouse Directory
            </h1>
            <p className="text-muted-foreground mt-1">Manage and monitor your warehouse locations and inventory</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-card border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={viewMode === "map" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
              >
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <WarehouseFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          regionFilter={regionFilter}
          onRegionChange={setRegionFilter}
          regions={uniqueRegions}
        />

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-6"
            >
              {/* Warehouse Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredWarehouses.map((warehouse) => (
                  <motion.div key={warehouse.id} variants={itemVariants}>
                    <WarehouseCard
                      warehouseId={warehouse.id}
                      onSelect={() => setSelectedWarehouse(warehouse.id)}
                      isSelected={selectedWarehouse === warehouse.id}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Bin Details Accordion */}
              {selectedWarehouse && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BinAccordion
                    warehouseId={selectedWarehouse}
                    warehouse={warehouses.find((w) => w.id === selectedWarehouse)!}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <WarehouseMap
                warehouses={filteredWarehouses}
                selectedWarehouse={selectedWarehouse}
                onWarehouseSelect={setSelectedWarehouse}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {filteredWarehouses.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No warehouses found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or add a new warehouse.</p>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 20 }}
      >
        <Button
          size="lg"
          onClick={() => setShowAddModal(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  )
}
