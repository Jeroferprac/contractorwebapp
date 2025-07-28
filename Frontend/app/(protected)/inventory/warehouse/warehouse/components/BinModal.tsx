"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Package } from "lucide-react"

interface AddBinModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddBinModal({ open, onOpenChange }: AddBinModalProps) {
  const [formData, setFormData] = useState({
    binCode: "",
    warehouse: "",
    zone: "",
    row: "",
    level: "",
    binType: "",
    capacity: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Bin Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-4 border-0 bg-white/60 dark:bg-slate-800/60">
            <div className="flex items-center space-x-2 mb-4">
              <Package className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Basic Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="binCode">Bin Code *</Label>
                <Input
                  id="binCode"
                  placeholder="e.g., BIN-A12"
                  value={formData.binCode}
                  onChange={(e) => setFormData({ ...formData, binCode: e.target.value })}
                  className="bg-white/80 dark:bg-slate-800/80 border-white/20"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse *</Label>
                <Select
                  value={formData.warehouse}
                  onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
                >
                  <SelectTrigger className="bg-white/80 dark:bg-slate-800/80 border-white/20">
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="warehouse-b">Warehouse B</SelectItem>
                    <SelectItem value="warehouse-c">Warehouse C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/80 dark:bg-slate-800/80 border-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
            >
              Create Bin
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
