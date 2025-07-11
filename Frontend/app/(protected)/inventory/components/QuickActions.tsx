'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Users, Download } from 'lucide-react'

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <div className="flex items-center space-x-3">
            <Plus className="h-4 w-4" />
            <span>Create Order</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + O</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <div className="flex items-center space-x-3">
            <Package className="h-4 w-4" />
            <span>Add Product</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + P</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <div className="flex items-center space-x-3">
            <Users className="h-4 w-4" />
            <span>Add Supplier</span>
          </div>
          <span className="text-xs text-gray-400">ctrl + S</span>
        </Button>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
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