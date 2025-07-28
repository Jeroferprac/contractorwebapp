"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { WarehouseManagementHeader } from "./components/ManagementHeader"
import { WarehouseFiltersBar } from "./components/WarehouseFiltersBar"
import { WarehouseStatsWidgets } from "./components/StatsWidget"
import { WarehouseDataTable } from "./components/WarehouseTable"
import { BinMapView } from "./components/WarehouseMap"
import { AddBinModal } from "./components/BinAddModal"
import { getWarehouses, getWarehouseStocks } from "@/lib/warehouse"
import { getProducts } from "@/lib/inventory"
import type { Warehouse, WarehouseStock } from "@/types/warehouse"

// Loading component
function LoadingSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
        </div>
        <motion.p
          className="text-muted-foreground font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          Loading warehouse data...
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function BinsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    warehouse: "",
    binTypes: [] as string[],
    status: "all" as "all" | "active" | "inactive",
  })

  // Real data states
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stocks, setStocks] = useState<WarehouseStock[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Listen for Add Bin event from filters bar
  useEffect(() => {
    const handler = () => setShowAddModal(true)
    window.addEventListener('open-add-bin-modal', handler)
    return () => window.removeEventListener('open-add-bin-modal', handler)
  }, [])

  // Fetch real data
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        console.log("Fetching warehouses...")
        const warehousesData = await getWarehouses()
        console.log("Warehouses fetched:", warehousesData)
        console.log("Warehouses type:", typeof warehousesData, "Length:", Array.isArray(warehousesData) ? warehousesData.length : 'Not array')
        
        console.log("Fetching stocks...")
        const stocksData = await getWarehouseStocks()
        console.log("Stocks fetched:", stocksData)
        console.log("Stocks type:", typeof stocksData, "Length:", Array.isArray(stocksData) ? stocksData.length : 'Not array')
        
        console.log("Fetching products...")
        const productsData = await getProducts() as any[]
        console.log("Products fetched:", productsData)
        console.log("Products type:", typeof productsData, "Length:", Array.isArray(productsData) ? productsData.length : 'Not array')
        
        console.log("Setting state...")
        setWarehouses(warehousesData)
        setStocks(stocksData)
        setProducts(productsData)
        console.log("State set successfully")
      } catch (err) {
        console.error("Error fetching warehouse data:", err)
        setError(`Failed to load warehouse data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Helper functions
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = warehouses.find(w => w.id === warehouseId)
    return warehouse?.name || warehouseId
  }

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId)
    return product?.name || productId
  }

  const refreshData = async () => {
    setLoading(true)
    try {
              const [warehousesData, stocksData, productsData] = await Promise.all([
          getWarehouses(),
          getWarehouseStocks(),
          getProducts() as Promise<any[]>,
        ])
        setWarehouses(warehousesData)
        setStocks(stocksData)
        setProducts(productsData)
    } catch (err) {
      console.error("Error refreshing data:", err)
      setError("Failed to refresh data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 min-h-screen">
      <WarehouseManagementHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <WarehouseFiltersBar 
        filters={filters}
        onFiltersChange={setFilters}
        warehouses={warehouses || []}
        statusOptions={["all", "active", "inactive"]}
        onAddBin={() => setShowAddModal(true)}
        onExport={(type) => {
          if (type === 'csv') {
            // Export CSV logic
            console.log('Exporting CSV...')
          } else if (type === 'pdf') {
            // Export PDF logic
            console.log('Exporting PDF...')
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <WarehouseStatsWidgets 
        warehouses={warehouses}
        stocks={stocks}
      />

      {viewMode === "list" ? (
        <WarehouseDataTable 
          searchQuery={searchQuery} 
          filters={filters}
          warehouses={warehouses}
          stocks={stocks}
          products={products}
          onRefresh={refreshData}
        />
      ) : (
        <BinMapView 
          warehouses={warehouses}
          stocks={stocks}
        />
      )}

      <AddBinModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        warehouses={warehouses}
        products={products}
        onSuccess={refreshData}
      />
    </div>
  )
}
