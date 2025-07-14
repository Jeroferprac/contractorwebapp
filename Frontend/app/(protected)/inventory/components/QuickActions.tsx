'use client'
import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Users, Download } from 'lucide-react'

interface QuickActionsProps {
  onAddProduct: () => void
  onAddSupplier: () => void
  onCreateOrder: () => void
  onExport: () => void
}

export default function QuickActions({
  onAddProduct,
  onAddSupplier,
  onCreateOrder,
  onExport,
}: QuickActionsProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onAddProduct();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onAddSupplier();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onCreateOrder();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddProduct, onAddSupplier, onCreateOrder, onExport]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="ghost" className="w-full justify-between p-3 h-auto" onClick={onCreateOrder}>
          <div className="flex items-center space-x-3">
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + O</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto" onClick={onAddProduct}>
          <div className="flex items-center space-x-3">
            <Package className="h-4 w-4" />
            <span>Add Product</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + P</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto" onClick={onAddSupplier}>
          <div className="flex items-center space-x-3">
            <Users className="h-4 w-4" />
            <span>Add Supplier</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + S</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto" onClick={onExport}>
          <div className="flex items-center space-x-3">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + E</span>
        </Button>
      </CardContent>
    </Card>
  )
} 