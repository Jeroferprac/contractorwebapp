"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddProductButtonProps {
  onClick: () => void;
}

export function AddProductButton({ onClick }: AddProductButtonProps) {
  return (
    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Add New Product</span>
      <span className="sm:hidden">Add</span>
    </Button>
  );
}
