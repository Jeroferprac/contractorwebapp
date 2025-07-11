"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EditSupplierButtonProps {
  onClick: () => void;
}

export function EditSupplierButton({ onClick }: EditSupplierButtonProps) {
  return (
    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Edit Supplier</span>
      <span className="sm:hidden">Edit</span>
    </Button>
  );
}
