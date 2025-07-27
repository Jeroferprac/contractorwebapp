"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EditSupplierButtonProps {
  onClick: () => void;
}

export function EditSupplierButton({ onClick }: EditSupplierButtonProps) {
  return (
    <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600" onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline ">Edit Supplier</span>
      <span className="sm:hidden">Edit</span>
    </Button>
  );
}