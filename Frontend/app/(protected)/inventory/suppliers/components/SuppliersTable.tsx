"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Star, Edit, MoreVertical, Trash2, ExternalLink, Building2 } from "lucide-react"
import type { Supplier } from "@/types/inventory"

export interface SuppliersTableProps {
  suppliersData: Supplier[]
  onEdit: (supplier: Supplier) => void
  onDelete: (supplier: Supplier) => Promise<void>
}

export function SuppliersTable({ suppliersData, onEdit, onDelete }: SuppliersTableProps) {
  const [selectedSuppliers, setSelectedSuppliers] = useState<Set<string>>(new Set())
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSuppliers(new Set(suppliersData.map((s) => s.id!.toString())))
    } else {
      setSelectedSuppliers(new Set())
    }
  }

  const handleSelectSupplier = (supplierId: string, checked: boolean) => {
    const newSelected = new Set(selectedSuppliers)
    if (checked) {
      newSelected.add(supplierId)
    } else {
      newSelected.delete(supplierId)
    }
    setSelectedSuppliers(newSelected)
  }

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (supplierToDelete) {
      setIsDeleting(true)
      try {
        await onDelete(supplierToDelete)
        setDeleteDialogOpen(false)
        setSupplierToDelete(null)
      } catch (error) {
        console.error("Error deleting supplier:", error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-blue-500", // Apple Inc style
      "bg-purple-500", // Samsung style
      "bg-emerald-500", // Dell style
      "bg-orange-500", // TATA style
      "bg-cyan-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
    ]
    return colors[index % colors.length]
  }

  const generateSupplierID = (name: string, index: number) => {
    const prefix = name.substring(0, 2).toLowerCase()
    const randomId = Math.random().toString(36).substring(2, 6)
    return `${prefix}${randomId}-${index.toString().padStart(4, "0")}`
  }

  const allSelected = suppliersData.length > 0 && selectedSuppliers.size === suppliersData.length
  const someSelected = selectedSuppliers.size > 0 && selectedSuppliers.size < suppliersData.length

  if (suppliersData.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
            <Building2 className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">No suppliers found</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md text-base leading-relaxed">
            No suppliers match your current search criteria. Try adjusting your filters or add a new supplier.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-medium">
            <Building2 className="w-5 h-5 mr-2" />
            Add First Supplier
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <TableHead className="w-12 py-3 pl-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    aria-label="Select all suppliers"
                    className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm">
                  Supplier name
                </TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm">Contact</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm">Email</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm">Phone</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 dark:text-slate-300 py-3 text-sm text-center pr-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliersData.map((supplier, index) => (
                <TableRow
                  key={supplier.id}
                  className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                >
                  <TableCell className="py-3 pl-4">
                    <Checkbox
                      checked={selectedSuppliers.has(supplier.id!.toString())}
                      onCheckedChange={(checked) => handleSelectSupplier(supplier.id!.toString(), checked as boolean)}
                      aria-label={`Select ${supplier.name}`}
                      className="border-slate-300 dark:border-slate-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className={`h-10 w-10 ${getAvatarColor(index)} shadow-sm`}>
                          <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${getInitials(supplier.name)}`} />
                          <AvatarFallback className={`${getAvatarColor(index)} text-white font-bold text-sm`}>
                            {getInitials(supplier.name)}
                          </AvatarFallback>
                        </Avatar>
                        {index < 2 && (
                          <div className="absolute -top-0.5 -right-0.5 p-0.5 bg-yellow-400 rounded-full">
                            <Star className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{supplier.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          ID: {generateSupplierID(supplier.name, index)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {supplier.contact_person || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    {supplier.email ? (
                      <a
                        href={`mailto:${supplier.email}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline"
                      >
                        {supplier.email}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </TableCell>

                  <TableCell className="py-3">
                    {supplier.phone ? (
                      <a
                        href={`tel:${supplier.phone}`}
                        className="text-sm font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {supplier.phone}
                      </a>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 font-semibold px-3 py-1 rounded-md text-xs border-0">
                      Active
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 pr-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          <MoreVertical className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg p-1"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(supplier)}
                          className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-md px-3 py-2"
                        >
                          <Edit className="mr-3 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-md px-3 py-2">
                          <ExternalLink className="mr-3 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700 my-1" />
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(supplier)}
                          className="cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-medium rounded-md px-3 py-2"
                        >
                          <Trash2 className="mr-3 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Delete Supplier
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900 dark:text-slate-100">"{supplierToDelete?.name}"</span>? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 font-medium"
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium shadow-sm hover:shadow-md transition-all"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
