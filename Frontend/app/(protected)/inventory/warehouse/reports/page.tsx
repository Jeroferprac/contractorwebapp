"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Search,
  RotateCcw,
  Check,
  TrendingUp,
  Package,
  Building2,
  Truck,
  AlertTriangle,
  Hash,
  MapPin,
  CalendarDays,
  BarChart3,
  Users,
  Activity,
  Filter,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCard } from "./components/StatsCard"
import { AnimatedChart } from "./components/Charts"
import { AnimatedTable } from "./components/Table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getWarehouses, getWarehouseStocks, getWarehouseTransfers } from "@/lib/warehouse"
import { getProducts } from "@/lib/inventory"
import type { Warehouse, WarehouseStock, WarehouseTransfer } from "@/types/warehouse"
import type { Product } from "@/types/inventory"

export default function ReportsDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("last-7-days")
  const [selectedWarehouses, setSelectedWarehouses] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [transferStatusFilter, setTransferStatusFilter] = useState("all")

  // Real data states
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [stocks, setStocks] = useState<WarehouseStock[]>([])
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch real data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      setError(null)
      try {
        const [warehousesData, stocksData, transfersData, productsData] = await Promise.all([
          getWarehouses(),
          getWarehouseStocks(),
          getWarehouseTransfers(),
          getProducts(),
        ])
        
        setWarehouses(warehousesData || [])
        setStocks(stocksData || [])
        setTransfers(transfersData || [])
        setProducts(productsData as Product[] || [])
      } catch (err) {
        console.error("Error fetching reports data:", err)
        setError(`Failed to load reports data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate real statistics
  const calculateStats = () => {
    // Apply filters to data
    const filteredStocks = stocks.filter(stock => {
      const matchesSearch = searchQuery === "" || 
        stock.product_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.bin_location?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesWarehouse = selectedWarehouses === "all" || stock.warehouse_id === selectedWarehouses
      
      return matchesSearch && matchesWarehouse
    })

    const filteredTransfers = transfers.filter(transfer => {
      const matchesSearch = searchQuery === "" || 
        transfer.transfer_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = transferStatusFilter === "all" || transfer.status === transferStatusFilter
      
      // Date range filtering
      let matchesDateRange = true
      if (dateRange !== "all") {
        const transferDate = transfer.transfer_date ? new Date(transfer.transfer_date) : null
        if (transferDate) {
          const now = new Date()
          const daysDiff = Math.floor((now.getTime() - transferDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (dateRange === "last-7-days" && daysDiff > 7) matchesDateRange = false
          else if (dateRange === "last-30-days" && daysDiff > 30) matchesDateRange = false
          else if (dateRange === "last-90-days" && daysDiff > 90) matchesDateRange = false
        }
      }
      
      return matchesSearch && matchesStatus && matchesDateRange
    })

    const filteredWarehouses = warehouses.filter(warehouse => {
      const matchesSearch = searchQuery === "" || 
        warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.address?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })

    const totalWarehouses = filteredWarehouses.length
    const activeWarehouses = filteredWarehouses.filter(w => w.is_active !== false).length
    const totalStockItems = filteredStocks.length
    const activeStockItems = filteredStocks.filter(s => parseFloat(s.quantity as string) > 0).length
    const totalTransfers = filteredTransfers.length
    const completedTransfers = filteredTransfers.filter(t => t.status === 'completed').length
    const lowStockItems = filteredStocks.filter(s => parseFloat(s.quantity as string) < 10).length

    return [
      {
        title: "Total Warehouses",
        subtitle: `Active: ${activeWarehouses}/${totalWarehouses}`,
        percentage: totalWarehouses > 0 ? Math.round((activeWarehouses / totalWarehouses) * 100) : 0,
        primaryLabel: "Active",
        primaryValue: `${activeWarehouses}(${totalWarehouses > 0 ? Math.round((activeWarehouses / totalWarehouses) * 100) : 0}%)`,
        secondaryLabel: "Inactive",
        secondaryValue: `${totalWarehouses - activeWarehouses}(${totalWarehouses > 0 ? Math.round(((totalWarehouses - activeWarehouses) / totalWarehouses) * 100) : 0}%)`,
        borderColor: "from-purple-500 to-pink-500",
        progressColor: "#3b82f6",
      },
      {
        title: "Total Stock Items",
        subtitle: `Active: ${activeStockItems}/${totalStockItems}`,
        percentage: totalStockItems > 0 ? Math.round((activeStockItems / totalStockItems) * 100) : 0,
        primaryLabel: "Active",
        primaryValue: `${activeStockItems}(${totalStockItems > 0 ? Math.round((activeStockItems / totalStockItems) * 100) : 0}%)`,
        secondaryLabel: "Empty",
        secondaryValue: `${totalStockItems - activeStockItems}(${totalStockItems > 0 ? Math.round(((totalStockItems - activeStockItems) / totalStockItems) * 100) : 0}%)`,
        borderColor: "from-blue-500 to-cyan-500",
        progressColor: "#10b981",
      },
      {
        title: "Total Transfers",
        subtitle: `Completed: ${completedTransfers}/${totalTransfers}`,
        percentage: totalTransfers > 0 ? Math.round((completedTransfers / totalTransfers) * 100) : 0,
        primaryLabel: "Completed",
        primaryValue: `${completedTransfers}(${totalTransfers > 0 ? Math.round((completedTransfers / totalTransfers) * 100) : 0}%)`,
        secondaryLabel: "Pending",
        secondaryValue: `${totalTransfers - completedTransfers}(${totalTransfers > 0 ? Math.round(((totalTransfers - completedTransfers) / totalTransfers) * 100) : 0}%)`,
        borderColor: "from-green-500 to-emerald-500",
        progressColor: "#f59e0b",
      },
      {
        title: "Low Stock Items",
        subtitle: `Critical: ${lowStockItems} items`,
        percentage: filteredStocks.length > 0 ? Math.round((lowStockItems / filteredStocks.length) * 100) : 0,
        primaryLabel: "Critical",
        primaryValue: `${lowStockItems}(${filteredStocks.length > 0 ? Math.round((lowStockItems / filteredStocks.length) * 100) : 0}%)`,
        secondaryLabel: "Normal",
        secondaryValue: `${filteredStocks.length - lowStockItems}(${filteredStocks.length > 0 ? Math.round(((filteredStocks.length - lowStockItems) / filteredStocks.length) * 100) : 0}%)`,
        borderColor: "from-orange-500 to-red-500",
        progressColor: "#ef4444",
      },
    ]
  }

  const summaryCards = calculateStats()

  // Generate real chart data
  const generateChartData = () => {
    // Apply filters to transfers for chart data
    const filteredTransfers = transfers.filter(transfer => {
      const matchesSearch = searchQuery === "" || 
        transfer.transfer_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = transferStatusFilter === "all" || transfer.status === transferStatusFilter
      
      // Date range filtering
      let matchesDateRange = true
      if (dateRange !== "all") {
        const transferDate = transfer.transfer_date ? new Date(transfer.transfer_date) : null
        if (transferDate) {
          const now = new Date()
          const daysDiff = Math.floor((now.getTime() - transferDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (dateRange === "last-7-days" && daysDiff > 7) matchesDateRange = false
          else if (dateRange === "last-30-days" && daysDiff > 30) matchesDateRange = false
          else if (dateRange === "last-90-days" && daysDiff > 90) matchesDateRange = false
        }
      }
      
      return matchesSearch && matchesStatus && matchesDateRange
    })

    // Apply filters to stocks for chart data
    const filteredStocks = stocks.filter(stock => {
      const matchesSearch = searchQuery === "" || 
        stock.product_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.bin_location?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesWarehouse = selectedWarehouses === "all" || stock.warehouse_id === selectedWarehouses
      
      return matchesSearch && matchesWarehouse
    })

    // Apply filters to warehouses for chart data
    const filteredWarehouses = warehouses.filter(warehouse => {
      const matchesSearch = searchQuery === "" || 
        warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.address?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })

    // Transfers per day (last 7 days)
    const transfersPerDay = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dayTransfers = filteredTransfers.filter(t => {
        if (!t.transfer_date) return false
        const transferDate = new Date(t.transfer_date)
        return transferDate.toDateString() === date.toDateString()
      })
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        transfers: dayTransfers.length
      }
    })

    // Stock quantity over time (by warehouse)
    const stockOverTime = filteredWarehouses.slice(0, 3).map(warehouse => {
      const warehouseStocks = filteredStocks.filter(s => s.warehouse_id === warehouse.id)
      const totalQuantity = warehouseStocks.reduce((sum, stock) => sum + parseFloat(stock.quantity as string), 0)
      return {
        date: warehouse.name,
        quantity: totalQuantity
      }
    })

    // Products per warehouse
    const productsPerWarehouse = filteredWarehouses.map(warehouse => {
      const warehouseStocks = filteredStocks.filter(s => s.warehouse_id === warehouse.id)
      return {
        date: warehouse.name,
        products: warehouseStocks.length
      }
    })

    // Transfer status over time
    const transferStatus = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const dayTransfers = filteredTransfers.filter(t => {
        if (!t.transfer_date) return false
        const transferDate = new Date(t.transfer_date)
        return transferDate.toDateString() === date.toDateString()
      })
      
      const inTransit = dayTransfers.filter(t => t.status === 'in_transit').length
      const completed = dayTransfers.filter(t => t.status === 'completed').length
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inTransit,
        completed
      }
    })

    return {
      transfersPerDay,
      stockOverTime,
      productsPerWarehouse,
      transferStatus
    }
  }

  const { transfersPerDay, stockOverTime, productsPerWarehouse, transferStatus } = generateChartData()

  // Generate real table data
  const generateTableData = () => {
    // Apply filters to warehouses
    const filteredWarehouses = warehouses.filter(warehouse => {
      const matchesSearch = searchQuery === "" || 
        warehouse.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        warehouse.address?.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesSearch
    })

    // Apply filters to stocks
    const filteredStocks = stocks.filter(stock => {
      const matchesSearch = searchQuery === "" || 
        stock.product_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.bin_location?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesWarehouse = selectedWarehouses === "all" || stock.warehouse_id === selectedWarehouses
      
      return matchesSearch && matchesWarehouse
    })

    // Apply filters to transfers
    const filteredTransfers = transfers.filter(transfer => {
      const matchesSearch = searchQuery === "" || 
        transfer.transfer_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transfer.notes?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = transferStatusFilter === "all" || transfer.status === transferStatusFilter
      
      // Date range filtering
      let matchesDateRange = true
      if (dateRange !== "all") {
        const transferDate = transfer.transfer_date ? new Date(transfer.transfer_date) : null
        if (transferDate) {
          const now = new Date()
          const daysDiff = Math.floor((now.getTime() - transferDate.getTime()) / (1000 * 60 * 60 * 24))
          
          if (dateRange === "last-7-days" && daysDiff > 7) matchesDateRange = false
          else if (dateRange === "last-30-days" && daysDiff > 30) matchesDateRange = false
          else if (dateRange === "last-90-days" && daysDiff > 90) matchesDateRange = false
        }
      }
      
      return matchesSearch && matchesStatus && matchesDateRange
    })

    const warehousesData = filteredWarehouses.map(warehouse => ({
      id: warehouse.id,
      name: warehouse.name,
      status: warehouse.is_active ? 'active' : 'inactive',
      location: warehouse.address || 'N/A',
      createdAt: warehouse.created_at,
      totalStock: filteredStocks.filter(s => s.warehouse_id === warehouse.id).length,
    }))

    const stockData = filteredStocks.map(stock => {
      const product = products.find(p => p.id === stock.product_id)
      const warehouse = warehouses.find(w => w.id === stock.warehouse_id)
      return {
        id: stock.id,
        productId: stock.product_id,
        name: product?.name || stock.product_id,
        warehouse: warehouse?.name || stock.warehouse_id,
        quantity: stock.quantity,
        binLocation: stock.bin_location || 'N/A',
        updated: stock.created_at,
      }
    })

    const transferData = filteredTransfers.map(transfer => {
      const fromWarehouse = warehouses.find(w => w.id === transfer.from_warehouse_id)
      const toWarehouse = warehouses.find(w => w.id === transfer.to_warehouse_id)
      return {
        id: transfer.id,
        from: fromWarehouse?.name || transfer.from_warehouse_id,
        to: toWarehouse?.name || transfer.to_warehouse_id,
        status: transfer.status,
        date: transfer.transfer_date,
        itemCount: transfer.items?.length || 0,
        progress: transfer.status === 'completed' ? 100 : transfer.status === 'in_transit' ? 65 : 0,
      }
    })

    return { warehousesData, stockData, transferData }
  }

  const { warehousesData, stockData, transferData } = generateTableData()

  const warehouseColumns = [
    { key: "id", label: "Warehouse ID", icon: Hash, gradient: "from-purple-500 to-blue-600" },
    { key: "name", label: "Name", icon: Building2, gradient: "from-blue-500 to-cyan-600" },
    { key: "status", label: "Status", icon: Activity, gradient: "from-green-500 to-emerald-600" },
    { key: "location", label: "Location", icon: MapPin, gradient: "from-orange-500 to-red-600" },
    { key: "createdAt", label: "Created At", icon: CalendarDays, gradient: "from-pink-500 to-purple-600" },
    { key: "totalStock", label: "Total Stock", icon: BarChart3, gradient: "from-indigo-500 to-purple-600" },
  ]

  const stockColumns = [
    { key: "productId", label: "Product ID", icon: Hash, gradient: "from-purple-500 to-blue-600" },
    { key: "name", label: "Name", icon: Package, gradient: "from-blue-500 to-cyan-600" },
    { key: "warehouse", label: "Warehouse", icon: Building2, gradient: "from-green-500 to-emerald-600" },
    { key: "quantity", label: "Quantity", icon: BarChart3, gradient: "from-orange-500 to-red-600" },
    { key: "binLocation", label: "Bin Location", icon: MapPin, gradient: "from-pink-500 to-purple-600" },
    { key: "updated", label: "Updated", icon: CalendarDays, gradient: "from-indigo-500 to-purple-600" },
  ]

  const transferColumns = [
    { key: "id", label: "Transfer ID", icon: Hash, gradient: "from-purple-500 to-blue-600" },
    { key: "from", label: "From", icon: Building2, gradient: "from-blue-500 to-cyan-600" },
    { key: "to", label: "To", icon: Building2, gradient: "from-green-500 to-emerald-600" },
    { key: "status", label: "Status", icon: Activity, gradient: "from-orange-500 to-red-600" },
    { key: "date", label: "Date", icon: CalendarDays, gradient: "from-pink-500 to-purple-600" },
    { key: "itemCount", label: "Item Count", icon: Users, gradient: "from-indigo-500 to-purple-600" },
    { key: "progress", label: "Progress", icon: TrendingUp, gradient: "from-cyan-500 to-blue-600" },
  ]

  const handleExport = (format: "csv" | "pdf") => {
    console.log(`Exporting as ${format}`)
    // Implement export logic here
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 min-h-screen p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Comprehensive warehouse analytics and insights
          </p>
        </div>
      </motion.div>

      {/* Consolidated Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-56 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
            />
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-7-days">Last 7 days</SelectItem>
                <SelectItem value="last-30-days">Last 30 days</SelectItem>
                <SelectItem value="last-90-days">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Warehouses */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Building2 className="h-4 w-4 text-gray-500" />
            <Select value={selectedWarehouses} onValueChange={setSelectedWarehouses}>
              <SelectTrigger className="w-36 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300">
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map(warehouse => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Activity className="h-4 w-4 text-gray-500" />
            <Select value={transferStatusFilter} onValueChange={setTransferStatusFilter}>
              <SelectTrigger className="w-32 rounded-xl border-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setDateRange("last-7-days")
                setSelectedWarehouses("all")
                setTransferStatusFilter("all")
              }}
              className="rounded-xl border-2 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <StatsCard {...card} isLoading={isLoading} delay={index * 0.1} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Professional Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="w-full">
          <AnimatedChart
            title="Total Transfers Per Day"
            icon={TrendingUp}
            data={transfersPerDay}
            type="area"
            dataKeys={["transfers"]}
            colors={["#8b5cf6"]}
            gradient="from-purple-500 to-blue-600"
            delay={0.2}
          />
        </div>
        <div className="w-full">
          <AnimatedChart
            title="Stock Quantity Over Time"
            icon={Package}
            data={stockOverTime}
            type="line"
            dataKeys={["quantity"]}
            colors={["#3b82f6"]}
            gradient="from-green-500 to-emerald-600"
            delay={0.3}
          />
        </div>
        <div className="w-full">
          <AnimatedChart
            title="Products Per Warehouse"
            icon={Building2}
            data={productsPerWarehouse}
            type="bar"
            dataKeys={["products"]}
            colors={["#3b82f6"]}
            gradient="from-blue-500 to-cyan-600"
            delay={0.4}
          />
        </div>
        <div className="w-full">
          <AnimatedChart
            title="Transfer Status Over Time"
            icon={AlertTriangle}
            data={transferStatus}
            type="area"
            dataKeys={["inTransit", "completed"]}
            colors={["#f59e0b", "#10b981"]}
            gradient="from-orange-500 to-red-600"
            delay={0.5}
          />
        </div>
      </div>

      {/* Data Tables Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Tabs defaultValue="warehouses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl p-1 bg-gray-100 dark:bg-gray-800">
            <TabsTrigger
              value="warehouses"
              className="flex items-center gap-1 sm:gap-2 rounded-xl text-xs sm:text-sm"
            >
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Warehouses</span>
              <span className="sm:hidden">WH</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex items-center gap-1 sm:gap-2 rounded-xl text-xs sm:text-sm">
              <Package className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Stock Report</span>
              <span className="sm:hidden">Stock</span>
            </TabsTrigger>
            <TabsTrigger value="transfers" className="flex items-center gap-1 sm:gap-2 rounded-xl text-xs sm:text-sm">
              <Truck className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Transfer Report</span>
              <span className="sm:hidden">Transfer</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="warehouses" className="mt-6">
            <AnimatedTable
              title="Warehouses Report"
              titleIcon={Building2}
              columns={warehouseColumns}
              data={warehousesData}
              searchPlaceholder="Search warehouses..."
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="stock" className="mt-6">
            <AnimatedTable
              title="Stock Report"
              titleIcon={Package}
              columns={stockColumns}
              data={stockData}
              searchPlaceholder="Search stock items..."
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="transfers" className="mt-6">
            <AnimatedTable
              title="Transfer Report"
              titleIcon={Truck}
              columns={transferColumns}
              data={transferData}
              searchPlaceholder="Search transfers..."
              onExport={handleExport}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
