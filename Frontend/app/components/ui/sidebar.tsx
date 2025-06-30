"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const SidebarContext = React.createContext<{ collapsed: boolean; setCollapsed: React.Dispatch<React.SetStateAction<boolean>> } | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <aside className={cn("flex h-screen flex-col", className)}>{children}</aside>
  )
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 overflow-y-auto", className)}>{children}</div>
  )
}

export function SidebarInset({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col", className)}>{children}</div>
  )
}

export function SidebarGroup({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)}>{children}</div>
}

export function SidebarGroupContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

export function SidebarMenu({ className, children }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>
}

export function SidebarMenuItem({ className, children }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("list-none", className)}>{children}</li>
}

export function SidebarMenuButton({
  isActive,
  asChild,
  className,
  children,
}: {
  isActive?: boolean
  asChild?: boolean
  className?: string
  children: React.ReactNode
}) {
  const Component = asChild ? React.Fragment : "button"

  const baseClass = cn(
    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition",
    isActive ? "bg-muted text-primary" : "text-muted-foreground",
    className
  )

  return (
    <Component {...(asChild ? {} : { className: baseClass })}>
      {asChild ? <span className={baseClass}>{children}</span> : children}
    </Component>
  )
}
