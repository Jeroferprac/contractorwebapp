"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SalesSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SalesSearchBar({ value, onChange, placeholder = "Search sales orders..." }: SalesSearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none z-10" />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-12 pr-4 py-2 bg-card/90 dark:bg-white/20 border border-input rounded-full shadow-md text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring transition-colors backdrop-blur-md"
      />
    </div>
  );
} 