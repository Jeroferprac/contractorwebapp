"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  unit: string;
  current_stock: string;
  min_stock_level: string;
  cost_price: string;
  selling_price: string;
  description: string;
  created_at: string;
}

interface ProductTableProps {
  products: Product[]
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Product List</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">SKU</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Brand</th>
                <th className="py-3 px-4 text-left">Unit</th>
                <th className="py-3 px-4 text-right">Stock</th>
                <th className="py-3 px-4 text-right">Min Stock</th>
                <th className="py-3 px-4 text-right">Cost Price</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium">{p.name}</td>
                  <td className="py-3 px-4">{p.sku}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">{p.brand}</td>
                  <td className="py-3 px-4">{p.unit}</td>
                  <td className="py-3 px-4 text-right">{p.current_stock}</td>
                  <td className="py-3 px-4 text-right">{p.min_stock_level}</td>
                  <td className="py-3 px-4 text-right">{p.cost_price}</td>
                  <td className="py-3 px-4 text-right">{p.selling_price}</td>
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit && onEdit(p)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete && onDelete(p)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="p-4">
              <div className="flex items-center gap-3">
                {/* No image field, so use a placeholder */}
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-lg">{product.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {product.sku} • {product.category}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium">{product.selling_price}</span>
                    <Badge variant="secondary">Stock: {product.current_stock}</Badge>
                  </div>
                </div>
                {/* Actions dropdown for mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit && onEdit(product)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete && onDelete(product)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
