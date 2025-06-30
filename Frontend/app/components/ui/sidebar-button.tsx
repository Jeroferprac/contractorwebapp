// components/ui/sidebar-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import React from "react"

interface SidebarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType
  label: string
  active?: boolean
}

export function SidebarButton({ icon: Icon, label, active, className, ...props }: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start",
        active ? "bg-blue-50 text-blue-600 hover:bg-blue-100" : "text-gray-600 hover:bg-gray-50",
        className
      )}
      {...props}
    >
      <Icon className="mr-3 h-4 w-4" />
      {label}
    </Button>
  )
}
