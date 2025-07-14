"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AddPurchaseOrderButtonProps {
  onClick: () => void
}

export function AddPurchaseOrderButton({ onClick }: AddPurchaseOrderButtonProps) {
  return (
    <Button onClick={onClick} className="bg-blue-600 hover:bg-blue-700 text-white">
      <Plus className="mr-2 h-4 w-4" />
      Add Purchase Order
    </Button>
  )
} 