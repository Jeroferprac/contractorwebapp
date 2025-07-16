"use client";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { Product } from "./ProductTable";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Pencil, Trash2, Sliders, BarChart2, Settings } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export type ProductTableHandlers = {
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAdjust: (product: Product) => void;
  setCompareProductId: (id: string) => void;
};

export const columns = ({
  onEdit,
  onDelete,
  onAdjust,
  setCompareProductId,
}: ProductTableHandlers): ColumnDef<Product>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info: CellContext<Product, unknown>) => String(info.getValue() ?? ""),
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: info => info.getValue() as string,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: info => info.getValue() as string || "-",
  },
  {
    accessorKey: "brand",
    header: "Brand",
    cell: info => info.getValue() as string || "-",
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: info => info.getValue() as string || "-",
  },
  {
    accessorKey: "current_stock",
    header: "Stock",
    cell: info => {
      const value = Number(info.getValue());
      return (
        <span className="inline-flex items-center gap-1">
          <Package className="w-4 h-4 text-muted-foreground" />
          {isNaN(value) ? "-" : value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    accessorKey: "min_stock_level",
    header: "Min Stock",
    cell: info => {
      const value = Number(info.getValue());
      return (
        <span className="inline-flex items-center gap-1">
          <Package className="w-4 h-4 text-muted-foreground" />
          {isNaN(value) ? "-" : value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    accessorKey: "cost_price",
    header: "Cost Price",
    cell: info => {
      const value = Number(info.getValue());
      return (
        <span className="inline-flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          {isNaN(value) ? "-" : value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    accessorKey: "selling_price",
    header: "Selling Price",
    cell: info => {
      const value = Number(info.getValue());
      return (
        <span className="inline-flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          {isNaN(value) ? "-" : value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: { original: Product } }) => {
      const p = row.original;
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost" aria-label="Show actions">
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="center" side="top" className="flex items-center justify-center gap-3 p-2 rounded-lg shadow-lg min-w-[180px] max-w-xs sm:max-w-sm animate-in fade-in zoom-in-95" style={{ minWidth: 180, maxWidth: 320 }}>
            <Button size="icon" variant="ghost" title="Edit" onClick={() => onEdit && onEdit(p)}>
              <Pencil className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" title="Delete" onClick={() => onDelete && onDelete(p)}>
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" title="Adjust" onClick={() => onAdjust && onAdjust(p)}>
              <Sliders className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost" title="Compare" onClick={() => setCompareProductId && setCompareProductId(p.id)}>
              <BarChart2 className="w-5 h-5" />
            </Button>
          </PopoverContent>
        </Popover>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
]; 