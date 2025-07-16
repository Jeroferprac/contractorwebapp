"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Package, DollarSign, Pencil, Trash2, Sliders, BarChart2, Settings, MoreHorizontal } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductTableHandlers } from "./columns";
import type { Product } from "./ProductTable";
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps {
  columns: ColumnDef<Product, unknown>[];
  data: Product[];
  handlers: ProductTableHandlers;
}

export function DataTable({ columns, data, handlers }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full font-sans dark:bg-[#020817]"> {/* Use your project's font class here if different */}
      {/* Desktop Table */}
      <div className="hidden md:block ">
        <div className="flex items-center p-4  gap-2">
          <Input
            placeholder="Search..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm dark:bg-[#1e293b] rounded-full"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="dark:bg-[#020817] font-sans rounded-xl p-4">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-100 dark:hover:bg-[#232b3e] transition-colors hover:scale-[0.9] hover:shadow-lg transition-transform transition-shadow duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-gray-900 dark:text-gray-100">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          
          {/* Pagination page numbers only (no Previous/Next) */}
          {/* You can add a custom pagination component here if needed */}
        </div>
      </div>
      {/* Mobile Table */}
      <div className="block md:hidden">
        <div className="space-y-2">
          {data.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No products found.</div>
          ) : (
            data.map((product, idx) => {
              const isExpanded = expandedRow === product.id;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="bg-white dark:bg-[#020817] rounded-xl p-4 mb-4"
                >
                  <div className="flex items-center px-3 py-2 gap-2">
                    <Checkbox className="mr-2" />
                    <button
                      className="flex items-center flex-1 gap-2 text-left"
                      onClick={() => setExpandedRow(isExpanded ? null : product.id)}
                      aria-label="Expand product details"
                    >
                      <ChevronDown
                        className={`w-5 h-5  transition-transform duration-200 ${isExpanded ? "rotate-180" : "rotate-0"}`}
                      />
                      {/* Product image/icon placeholder */}
                      <span className="inline-block w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                        {/* If you have product.image, use <img src={product.image} ... /> */}
                        <Package className="w-5 h-5 text-blue-400" />
                      </span>
                      <span className="font-semibold text-base truncate max-w-[60vw]">{product.name}</span>
                    </button>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label="Show actions">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="end" side="bottom" className="flex items-center gap-2 p-2 rounded-lg shadow-lg min-w-[180px] max-w-xs animate-in fade-in zoom-in-95">
                        <Button size="icon" variant="ghost" title="Edit" onClick={() => handlers?.onEdit(product)}>
                          <Pencil className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Delete" onClick={() => handlers?.onDelete(product)}>
                          <Trash2 className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Adjust" onClick={() => handlers?.onAdjust(product)}>
                          <Sliders className="w-5 h-5" />
                        </Button>
                        <Button size="icon" variant="ghost" title="Compare" onClick={() => handlers?.setCompareProductId(product.id)}>
                          <BarChart2 className="w-5 h-5" />
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-5 pb-3 pt-1 text-sm bg-gray-50 dark:bg-[#020817] dark:text-gray-100"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 dark:bg-[#020817]">
                          <div className="font-medium text-muted-foreground">SKU:</div>
                          <div>{product.sku}</div>
                          <div className="font-medium text-muted-foreground">Category:</div>
                          <div>{product.category}</div>
                          <div className="font-medium text-muted-foreground">Brand:</div>
                          <div>{product.brand}</div>
                          <div className="font-medium text-muted-foreground">Unit:</div>
                          <div>{product.unit}</div>
                          <div className="font-medium text-muted-foreground flex items-center gap-1"><Package className="w-4 h-4" />Stock:</div>
                          <div>{Number(product.current_stock).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          <div className="font-medium text-muted-foreground flex items-center gap-1"><Package className="w-4 h-4" />Min Stock:</div>
                          <div>{Number(product.min_stock_level).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          <div className="font-medium text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4" />Cost Price:</div>
                          <div>{Number(product.cost_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          <div className="font-medium text-muted-foreground flex items-center gap-1"><DollarSign className="w-4 h-4" />Selling Price:</div>
                          <div>{Number(product.selling_price).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                        {product.description && (
                          <div className="mt-2 text-xs text-muted-foreground">{product.description}</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
} 