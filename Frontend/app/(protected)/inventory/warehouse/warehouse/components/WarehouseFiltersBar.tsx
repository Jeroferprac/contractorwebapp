"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Download, Filter, X } from "lucide-react"
import type { Warehouse } from "@/types/warehouse"

interface WarehouseFiltersBarProps {
  filters: {
    warehouse: string
    binTypes: string[]
    status: "all" | "active" | "inactive"
  }
  onFiltersChange: (filters: any) => void
  warehouses: Warehouse[] | undefined
  statusOptions: string[]
  onAddBin: () => void
  onExport: (type: 'csv' | 'pdf') => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const binTypes = [
  { id: "picking", label: "Picking" },
  { id: "putaway", label: "Putaway" },
  { id: "overflow", label: "Overflow" },
  { id: "quarantine", label: "Quarantine" },
  { id: "staging", label: "Staging" },
]

export function WarehouseFiltersBar({
  filters,
  onFiltersChange,
  warehouses = [],
  statusOptions = [],
  onAddBin,
  onExport,
  searchQuery,
  onSearchChange
}: WarehouseFiltersBarProps) {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  // Keep localFilters in sync with props
  // (optional: can be omitted if you want to always use local state)

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    setFilterDropdownOpen(false)
  }
  const handleResetFilters = () => {
    setLocalFilters({ warehouse: "", binTypes: [], status: "all" })
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Search */}
      <div className="flex-1 min-w-0">
        <Input
          placeholder="Search bins, warehouse..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full max-w-xs"
        />
      </div>
      
      {/* Controls Group */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Filter Dropdown */}
        <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-72 p-4 space-y-4">
            {/* All Warehouses */}
            <div>
              <label className="block text-xs font-semibold mb-1">Warehouse</label>
              <select
                className="w-full rounded border px-2 py-1"
                value={localFilters.warehouse}
                onChange={e => setLocalFilters(lf => ({ ...lf, warehouse: e.target.value }))}
              >
                <option value="">All Warehouses</option>
                {(warehouses || []).map(w => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
                </div>
            {/* Bin Types */}
            <div>
              <label className="block text-xs font-semibold mb-1">Bin Types</label>
              <div className="flex flex-wrap gap-2">
                {binTypes.map(type => (
                  <label key={type.id} className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={localFilters.binTypes.includes(type.id)}
                      onChange={e => {
                        setLocalFilters(lf => ({
                          ...lf,
                          binTypes: e.target.checked
                            ? [...lf.binTypes, type.id]
                            : lf.binTypes.filter(t => t !== type.id),
                        }))
                      }}
                    />
                    {type.label}
                  </label>
                ))}
        </div>
      </div>
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold mb-1">Status</label>
              <select
                className="w-full rounded border px-2 py-1"
                value={localFilters.status}
                onChange={e => setLocalFilters(lf => ({ ...lf, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                {(statusOptions || []).map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            {/* Apply/Reset */}
            <div className="flex gap-2 mt-2">
              <Button size="sm" className="flex-1" onClick={handleApplyFilters}>Apply</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={handleResetFilters}>Reset</Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Export Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 whitespace-nowrap">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={() => onExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport('pdf')}>
              <X className="w-4 h-4 mr-2" />
              PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Add Bin Button */}
        <Button
          type="button"
          onClick={onAddBin}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg px-4 py-2 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Bin
        </Button>
      </div>
    </div>
  )
}
