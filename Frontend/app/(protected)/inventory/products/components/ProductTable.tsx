"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import SupplierPricingComparison from "../../suppliers/components/SupplierPricingComparison"
import { ProductStats } from "./ProductStats"
import { ProductFilters } from "./ProductFilters"
import { MobileProductCard } from "./MobileProductCard"
import { ProductTableView } from "./ProductTableView"
import { ProductTablePagination } from "./ProductTablePagination"
import { ProductAdjustModal } from "./ProductAdjustModal"
import {
  Package,
  Hash,
  Barcode,
  DollarSign,
  Archive,
  RotateCcw,
  TrendingUp,
  Weight,
  Ruler,
  Tag,
  Building2,
  Power,
  MoreHorizontal,
  Calendar,
  Clock,
  FileText,
} from "lucide-react"
import type { Product } from "@/lib/inventory";

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  onAdjust?: (
    product: Product,
    data: { quantity: number; notes: string; transaction_type: "inbound" | "outbound" },
  ) => void

  onAddProduct?: () => void // Added onAddProduct prop
  // headerRight?: React.ReactNode // Removed unused prop

}

// Updated columns structure - removed SKU as separate column, added description
const columns = [
  { key: "name", label: "Product Name", visible: true, icon: Package, essential: true, expandable: false },
  { key: "description", label: "Description", visible: false, icon: FileText, essential: false, expandable: true },
  { key: "barcode", label: "Barcode", visible: false, icon: Barcode, essential: false, expandable: true },
  { key: "price", label: "Price", visible: true, icon: DollarSign, essential: true, expandable: false },
  { key: "stock", label: "Current Stock", visible: true, icon: Archive, essential: true, expandable: false },
  { key: "category", label: "Category", visible: true, icon: Tag, essential: true, expandable: false },
  { key: "brand", label: "Brand", visible: true, icon: Building2, essential: true, expandable: false },
  { key: "reorder_point", label: "Reorder Point", visible: false, icon: RotateCcw, essential: false, expandable: true },
  { key: "max_stock_level", label: "Max Stock", visible: false, icon: TrendingUp, essential: false, expandable: true },
  { key: "weight", label: "Weight", visible: false, icon: Weight, essential: false, expandable: true },
  { key: "dimensions", label: "Dimensions", visible: false, icon: Ruler, essential: false, expandable: true },
  { key: "unit", label: "Unit", visible: false, icon: Package, essential: false, expandable: true },
  { key: "is_active", label: "Active Status", visible: false, icon: Power, essential: false, expandable: true },
  { key: "track_serial", label: "Serial Tracking", visible: false, icon: Hash, essential: false, expandable: true },
  { key: "track_batch", label: "Batch Tracking", visible: false, icon: Archive, essential: false, expandable: true },
  { key: "is_composite", label: "Composite", visible: false, icon: Package, essential: false, expandable: true },
  { key: "created_at", label: "Created", visible: false, icon: Calendar, essential: false, expandable: true },
  { key: "updated_at", label: "Updated", visible: false, icon: Clock, essential: false, expandable: true },
  { key: "actions", label: "Actions", visible: true, icon: MoreHorizontal, essential: true, expandable: false },
]

// Helper functions
const getStockStatus = (currentStock: string | number, minStock: string | number) => {
  const current = Number(currentStock)
  const min = Number(minStock)
  if (current === 0)
    return { color: "bg-gradient-to-r from-red-500 to-pink-500", dotColor: "bg-red-500", text: "Out of Stock" }
  if (current <= min)
    return { color: "bg-gradient-to-r from-yellow-500 to-orange-500", dotColor: "bg-yellow-500", text: "Low Stock" }
  return { color: "bg-gradient-to-r from-green-500 to-emerald-500", dotColor: "bg-emerald-500", text: "In Stock" }
}

const getStockBars = (currentStock: string | number, minStock: string | number) => {
  const current = Number(currentStock)
  const min = Number(minStock)
  if (current === 0) return 0
  if (current <= min) return 2
  if (current <= min * 2) return 3
  if (current <= min * 3) return 4
  return 5
}


export function ProductTable({ products, onEdit, onDelete, onAdjust, onAddProduct }: ProductTableProps) {
  // State management

  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [compareProductId, setCompareProductId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({})           
  const [visibleColumns, setVisibleColumns] = useState(columns)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [expandedRows, setExpandedRows] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  
  // Your existing click outside logic
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const formatCurrency = (value: string | number) =>
    Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const toggleRowExpansion = (productId: string) => {
    setExpandedRows((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const toggleColumnVisibility = (columnKey: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col)))
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const toggleAllProducts = () => {
    setSelectedProducts((prev) => (prev.length === products.length ? [] : products.map((p) => p.id)))
  }

  // Enhanced filtering logic with comprehensive filters and null safety
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter with null safety
      const matchesSearch =
        (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.sku || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description || "").toLowerCase().includes(searchTerm.toLowerCase())

      // Dynamic filters with null safety
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value || value === "all") return true
        switch (key) {
          case "category":
            return (product.category || "") === value
          case "brand":
            return (product.brand || "") === value
          case "status":
            const currentStock = Number(product.current_stock || 0)
            const minStock = Number(product.min_stock_level || 0)
            if (value === "active") return currentStock > 0
            if (value === "inactive") return currentStock === 0
            if (value === "low_stock") return currentStock <= minStock && currentStock > 0
            return true
          case "price_range":
            const price = Number(product.selling_price || 0)
            if (value === "0-50") return price <= 50
            if (value === "50-100") return price > 50 && price <= 100
            if (value === "100-200") return price > 100 && price <= 200
            if (value === "200+") return price > 200
            return true
          case "stock_range":
            const stock = Number(product.current_stock || 0)
            if (value === "0-10") return stock <= 10
            if (value === "10-50") return stock > 10 && stock <= 50
            if (value === "50-100") return stock > 50 && stock <= 100
            if (value === "100+") return stock > 100
            return true
          default:
            return true
        }
      })

      return matchesSearch && matchesFilters
    })
  }, [products, searchTerm, filters])

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredProducts, currentPage, itemsPerPage])


  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  // Get unique values for filter options with null safety
  const filterOptions = useMemo(
    () => ({
      categories: Array.from(new Set(products.map((p) => p.category || "Uncategorized").filter(Boolean))),
      brands: Array.from(new Set(products.map((p) => p.brand || "Unknown").filter(Boolean))),
      statuses: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "low_stock", label: "Low Stock" },
      ],
      priceRanges: [
        { value: "0-50", label: "$0 - $50" },
        { value: "50-100", label: "$50 - $100" },
        { value: "100-200", label: "$100 - $200" },
        { value: "200+", label: "$200+" },
      ],
      stockRanges: [
        { value: "0-10", label: "0 - 10" },
        { value: "10-50", label: "10 - 50" },
        { value: "50-100", label: "50 - 100" },
        { value: "100+", label: "100+" },
      ],
    }),
    [products],
  )

  return (
    <div className="space-y-4 lg:space-y-8 bg-background rounded-2xl lg:rounded-3xl shadow-2xl p-4 lg:p-8 border border-border">
        {/* Stats Cards */}
        <ProductStats products={products} />

        {/* Enhanced Filter Bar */}
        <ProductFilters
          searchTerm={searchTerm ?? ""}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          visibleColumns={visibleColumns}
          toggleColumnVisibility={toggleColumnVisibility}
          isMobile={isMobile}
          onAddProduct={onAddProduct}
        />

        {/* Table or Mobile Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          {isMobile ? (
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between mb-4 lg:mb-6 px-1 lg:px-2">
                <Checkbox
                  checked={selectedProducts.length === products.length}
                  onCheckedChange={toggleAllProducts}
                  className="border-purple-500 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-blue-500"
                />
                <span className="text-xs lg:text-sm text-muted-foreground font-medium font-sans">
                  {selectedProducts.length} of {products.length} selected
                </span>
              </div>
              {paginatedProducts.map((product) => (
                <MobileProductCard
                  key={product.id}
                  product={product}
                  isExpanded={expandedRows.includes(product.id)}
                  isSelected={selectedProducts.includes(product.id)}
                  onToggleExpansion={toggleRowExpansion}
                  onToggleSelection={toggleProductSelection}
                  onCompare={setCompareProductId}
                  onEdit={onEdit || (() => {})}
                  onAdjust={setAdjustProduct}
                  onDelete={onDelete || (() => {})}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStockStatus={getStockStatus}
                />
              ))}
              {/* Mobile Pagination */}
              <ProductTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
                onPageChange={setCurrentPage}
                visibleColumnsCount={visibleColumns.filter((col) => col.visible).length}
              />
            </div>

          ) : (
            <div className="bg-background border border-border rounded-xl lg:rounded-2xl shadow-2xl">
              <div className="overflow-x-auto">
                <ProductTableView
                  products={paginatedProducts}
                  visibleColumns={visibleColumns}
                  selectedProducts={selectedProducts}
                  onToggleAllProducts={toggleAllProducts}
                  onToggleProductSelection={toggleProductSelection}
                  onCompare={setCompareProductId}
                  onEdit={onEdit || (() => {})}
                  onAdjust={setAdjustProduct}
                  onDelete={onDelete || (() => {})}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStockStatus={getStockStatus}
                  getStockBars={getStockBars}

                />
              </div>
              {/* Desktop Pagination */}
              <ProductTablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
                onPageChange={setCurrentPage}
                visibleColumnsCount={visibleColumns.filter((col) => col.visible).length}
              />
            </div>
          )}
        </motion.div>

        {/* Modals */}
        <ProductAdjustModal
          product={adjustProduct}
          onClose={() => setAdjustProduct(null)}
          onAdjust={onAdjust || (() => {})}
        />

        <Dialog open={!!compareProductId} onOpenChange={() => setCompareProductId(null)}>
          <DialogContent className="max-w-lg w-full bg-background text-foreground border border-border shadow-2xl">
            <DialogTitle className="text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-sans">
              Supplier Pricing Comparison
            </DialogTitle>
            {compareProductId && (
              <SupplierPricingComparison productId={compareProductId} onClose={() => setCompareProductId(null)} />
            )}
          </DialogContent>
        </Dialog>
    </div>
  )
}