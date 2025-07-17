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
    <Card className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] rounded-2xl shadow-lg px-4 py-4 border-0 overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400" />
      <CardHeader className="pb-2 relative z-10">
        <CardTitle className="text-xs font-bold tracking-widest uppercase text-gray-500 dark:text-gray-200">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0 relative z-10">
        <Button variant="ghost" className="w-full justify-between p-2 h-auto rounded-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-gray-50 dark:hover:bg-[#23263A]/60" onClick={onCreateOrder}>
          <div className="flex items-center space-x-2">
            <Plus className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Create Order</span>
          </div>
          <span className="text-[10px] text-gray-400">ctrl + O</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto rounded-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-gray-50 dark:hover:bg-[#23263A]/60" onClick={onAddProduct}>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-green-500" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Add Product</span>
          </div>
          <span className="text-[10px] text-gray-400">ctrl + P</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto rounded-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-gray-50 dark:hover:bg-[#23263A]/60" onClick={onAddSupplier}>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Add Supplier</span>
          </div>
          <span className="text-[10px] text-gray-400">ctrl + S</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-2 h-auto rounded-lg transition-transform duration-150 hover:scale-[1.03] hover:bg-gray-50 dark:hover:bg-[#23263A]/60" onClick={onExport}>
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4 text-pink-500" />
            <span className="text-xs font-semibold text-gray-900 dark:text-white">Export</span>
          </div>
          <span className="text-[10px] text-gray-400">ctrl + E</span>
        </Button>
      </CardContent>
    </Card>
  )
} 