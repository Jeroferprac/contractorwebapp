"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PurchaseOrderSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function PurchaseOrderSearchBar({ value, onChange }: PurchaseOrderSearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search purchase orders..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
} 