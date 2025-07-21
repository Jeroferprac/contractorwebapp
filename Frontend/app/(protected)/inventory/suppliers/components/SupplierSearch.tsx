"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter, SortAsc, SortDesc } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

interface SuppliersSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SuppliersSearchBar({
  value,
  onChange,
  placeholder = "Search suppliers by name, email, phone, or contact person...",
}: SuppliersSearchBarProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<string>("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const handleClearSearch = () => {
    onChange("")
  }

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]))
  }

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
  }

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
          <Search className="text-slate-400 dark:text-slate-500 w-5 h-5" />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-12 pr-12 h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-500/5 rounded-2xl text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-200"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
          >
            <X className="h-4 w-4 text-slate-400" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-500/5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFilters.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {activeFilters.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50"
          >
            <DropdownMenuItem onClick={() => toggleFilter("active")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Active Suppliers</span>
                {activeFilters.includes("active") && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleFilter("recent")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Recent Additions</span>
                {activeFilters.includes("recent") && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toggleFilter("verified")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Verified Suppliers</span>
                {activeFilters.includes("verified") && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            {activeFilters.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setActiveFilters([])}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  Clear All Filters
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 shadow-lg shadow-slate-500/5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all duration-200"
            >
              {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-2" /> : <SortDesc className="w-4 h-4 mr-2" />}
              Sort by {sortBy}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50"
          >
            <DropdownMenuItem onClick={() => setSortBy("name")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Name</span>
                {sortBy === "name" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("date")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Date Added</span>
                {sortBy === "date" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("status")} className="cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <span>Status</span>
                {sortBy === "status" && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="cursor-pointer"
            >
              {sortOrder === "asc" ? "Descending" : "Ascending"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filter Tags */}
        {activeFilters.map((filter) => (
          <Badge
            key={filter}
            variant="secondary"
            className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 rounded-full px-3 py-1 text-xs font-medium"
          >
            {filter}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeFilter(filter)}
              className="ml-2 h-4 w-4 p-0 hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}

        {/* Search Results Count */}
        {value && <div className="text-sm text-slate-600 dark:text-slate-400 ml-auto">Searching for "{value}"</div>}
      </div>
    </div>
  )
}
