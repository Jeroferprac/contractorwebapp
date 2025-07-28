"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RotateCcw } from "lucide-react"

interface WarehouseFiltersDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: {
    warehouse: string
    binTypes: string[]
    status: "all" | "active" | "inactive"
  }
  onFiltersChange: (filters: any) => void
}

const warehouses = ["Warehouse A", "Warehouse B", "Warehouse C", "Distribution Center 1"]
const binTypes = [
  { id: "picking", label: "Picking", color: "bg-green-500" },
  { id: "putaway", label: "Putaway", color: "bg-blue-500" },
  { id: "overflow", label: "Overflow", color: "bg-orange-500" },
  { id: "quarantine", label: "Quarantine", color: "bg-red-500" },
  { id: "staging", label: "Staging", color: "bg-purple-500" },
]

export function WarehouseFiltersDrawer({ open, onOpenChange, filters, onFiltersChange }: WarehouseFiltersDrawerProps) {
  const handleBinTypeChange = (typeId: string, checked: boolean) => {
    const newTypes = checked ? [...filters.binTypes, typeId] : filters.binTypes.filter((t) => t !== typeId)

    onFiltersChange({ ...filters, binTypes: newTypes })
  }

  const resetFilters = () => {
    onFiltersChange({
      warehouse: "",
      binTypes: [],
      status: "all",
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Warehouse Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Warehouse</Label>
            <Select
              value={filters.warehouse}
              onValueChange={(value) => onFiltersChange({ ...filters, warehouse: value })}
            >
              <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                <SelectValue placeholder="All Warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bin Types */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Bin Types</Label>
            <div className="space-y-3">
              {binTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={type.id}
                    checked={filters.binTypes.includes(type.id)}
                    onCheckedChange={(checked) => handleBinTypeChange(type.id, checked as boolean)}
                  />
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${type.color}`} />
                    <Label htmlFor={type.id} className="text-sm cursor-pointer">
                      {type.label}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value: "all" | "active" | "inactive") => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
              onClick={() => onOpenChange(false)}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              className="w-full bg-white/80 dark:bg-slate-800/80 border-white/20"
              onClick={resetFilters}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
