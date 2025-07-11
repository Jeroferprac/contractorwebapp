"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface PlaceOrderButtonProps {
  onClick: () => void;
}

export function PlaceOrderButton({ onClick }: PlaceOrderButtonProps) {
  return (
    <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={onClick}>
      <Plus className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Place Order</span>
      <span className="sm:hidden">Order</span>
    </Button>
  );
} 