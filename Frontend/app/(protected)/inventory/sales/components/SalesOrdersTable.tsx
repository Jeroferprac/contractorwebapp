"use client";

import { Filter, Download, Eye, MoreHorizontal, Pencil, Plus, CheckCircle, Clock, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export interface SalesOrder {
  id: string;
  orderCode: string;
  customerName: string;
  saleDate: string;
  status: string;
  totalAmount: string;
  numItems: number;
}

interface SalesOrdersTableProps {
  salesData: SalesOrder[];
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onFilter?: () => void;
  onExport?: () => void;
  onAddSale?: () => void;
}

const STATUS_VARIANTS: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; className?: string }> = {
  Draft: { variant: "outline", icon: <Clock className="h-3 w-3 mr-1 text-muted-foreground" /> },
  Confirmed: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1 text-blue-500" />, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200" },
  Packed: { variant: "secondary", icon: <CheckCircle className="h-3 w-3 mr-1 text-purple-500" />, className: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-200" },
  Shipped: { variant: "secondary", icon: <CheckCircle className="h-3 w-3 mr-1 text-yellow-500" />, className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/60 dark:text-yellow-200" },
  Invoiced: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1 text-green-500" />, className: "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200" },
};

// Add a statusColor map for badge classes
const statusColor: Record<string, string> = {
  completed: 'bg-green-500 text-white dark:bg-green-400',
  'in progress': 'bg-blue-600 text-white dark:bg-blue-400',
  pending: 'bg-yellow-400 text-white dark:bg-yellow-300',
  cancelled: 'bg-red-600 text-white dark:bg-red-400',
  draft: 'bg-muted text-foreground',
  default: 'bg-muted text-foreground',
};

export default function SalesOrdersTable({ salesData, onEdit, onView, onFilter, onExport, onAddSale }: SalesOrdersTableProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const allSelected = selected.length === salesData.length && salesData.length > 0;
  const toggleAll = () => setSelected(allSelected ? [] : salesData.map(s => s.id));
  const toggleOne = (id: string) => setSelected(selected => selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]);

  return (
    <div className="w-full bg-card rounded-2xl p-4 shadow-lg border border-muted">
      <Table className="w-full rounded-2xl overflow-hidden">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-[#6d28d9] to-[#6366f1] border-b border-muted shadow-md">
            <TableHead className="px-2 text-white font-bold text-xs tracking-wider uppercase py-4"> <Checkbox checked={allSelected} onCheckedChange={toggleAll} className="border border-muted bg-muted rounded-md" /> </TableHead>
            <TableHead className="text-white font-bold text-sm tracking-wide uppercase py-4"><span className="text-sm font-semibold">Order Code</span></TableHead>
            <TableHead className="text-white font-bold text-sm tracking-wide uppercase py-4"><span className="text-sm font-semibold">Customer Name</span></TableHead>
            <TableHead className="text-white font-bold text-xs tracking-wide uppercase py-4"><span className="text-xs font-medium">Sale Date</span></TableHead>
            <TableHead className="text-white font-bold text-xs tracking-wide uppercase py-4"><span className="text-xs font-medium">Status</span></TableHead>
            <TableHead className="text-white font-bold text-xs tracking-wide uppercase py-4"><span className="text-xs font-medium">Total Amount</span></TableHead>
            <TableHead className="text-center text-white font-bold text-xs tracking-wide uppercase py-4"><span className="text-xs font-medium"># of Items</span></TableHead>
            <TableHead className="text-white font-bold text-xs tracking-wide uppercase py-4"><span className="text-xs font-medium">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salesData.map((item, idx) => {
            const status = STATUS_VARIANTS[item.status] || STATUS_VARIANTS["Draft"];
            const isSelected = selected.includes(item.id);
            return (
              <TableRow
                key={item.id}
                className={
                  `border-b border-muted transition group
                  ${isSelected ? 'bg-primary/10 ring-2 ring-primary ring-inset' : ''}
                  ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                  hover:bg-muted/60`
                }
                style={{ transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s' }}
              >
                <TableCell className="px-2 py-3">
                  <Checkbox checked={isSelected} onCheckedChange={() => toggleOne(item.id)} className="border border-muted bg-muted rounded-md" />
                </TableCell>
                <TableCell className="text-foreground align-middle py-3"><span className="text-sm font-medium">{item.orderCode}</span></TableCell>
                <TableCell className="text-foreground align-middle py-3"><span className="text-sm font-medium">{item.customerName}</span></TableCell>
                <TableCell className="text-muted-foreground align-middle py-3"><span className="text-xs font-medium">{item.saleDate}</span></TableCell>
                <TableCell className="align-middle py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm inline-block ${statusColor[item.status?.toLowerCase()] || statusColor.default}`}> <span className="text-xs font-semibold">{item.status}</span> </span>
                </TableCell>
                <TableCell className="text-foreground align-middle py-3"><span className="text-xs font-medium">{item.totalAmount}</span></TableCell>
                <TableCell className="text-center text-foreground align-middle py-3"><span className="text-xs font-medium">{item.numItems}</span></TableCell>
                <TableCell className="py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full bg-muted hover:bg-primary text-foreground shadow-sm">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView?.(item.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit?.(item.id)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-2">
        <span className="text-xs text-muted-foreground">{salesData.length} Sales Orders</span>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-muted text-foreground hover:bg-primary shadow-sm">
            <span className="sr-only">Previous</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-muted text-foreground hover:bg-primary shadow-sm">
            <span className="sr-only">Next</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
        </div>
      </div>
    </div>
  );
}
