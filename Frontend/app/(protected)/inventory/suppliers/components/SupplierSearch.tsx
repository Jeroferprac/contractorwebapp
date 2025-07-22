"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SuppliersSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SuppliersSearchBar({ value, onChange, placeholder = "Search suppliers..." }: SuppliersSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 bg-gray-50 border-0"
      />
    </div>
  );
}