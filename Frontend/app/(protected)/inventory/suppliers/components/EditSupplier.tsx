"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, User } from "lucide-react";
import { Supplier } from "@/types/inventory";

export interface SuppliersTableProps {
  suppliersData: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => Promise<void>;
}

export function SuppliersTable({ suppliersData, onEdit, onDelete }: SuppliersTableProps) {
  return (
    <div className="space-y-4">
      {suppliersData.map((supplier) => (
        <Card
          key={supplier.id}
          className="flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl shadow border border-gray-100 bg-white hover:shadow-lg transition"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xl uppercase">
              {supplier.name?.charAt(0)}
            </div>
            {/* Supplier Info */}
            <div>
              <div className="font-semibold text-lg">{supplier.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <User className="w-4 h-4 text-gray-400" />
                {supplier.contact_person}
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${supplier.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {supplier.email}
                </a>
              </div>
            </div>
          </div>
          {/* Status and Actions */}
          <div className="flex flex-col md:flex-row items-center gap-3 mt-4 md:mt-0">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-1 text-sm">
              Active
            </Badge>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(supplier)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(supplier)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
      {suppliersData.length === 0 && (
        <div className="text-center text-gray-400 py-8">No suppliers found.</div>
      )}
    </div>
  );
}
