"use client"

import type * as React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, Filter } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MobileAccordionTableProps<T> {
  data: T[]
  title: string
  searchKey: keyof T
  searchPlaceholder?: string
  renderCard: (item: T, index: number) => React.ReactNode
  renderDetails: (item: T) => React.ReactNode
  filters?: Array<{
    key: keyof T
    label: string
    options: Array<{ value: string; label: string }>
  }>
}

export function MobileAccordionTable<T extends Record<string, any>>({
  data,
  title,
  searchKey,
  searchPlaceholder = "Search...",
  renderCard,
  renderDetails,
  filters = [],
}: MobileAccordionTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredData = data.filter((item) => {
    const matchesSearch = String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilters = Object.entries(activeFilters).every(([key, value]) => {
      if (!value || value === "all") return true
      return String(item[key]).toLowerCase() === value.toLowerCase()
    })
    return matchesSearch && matchesFilters
  })

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <DropdownMenu key={String(filter.key)}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      {filter.label}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setActiveFilters((prev) => ({ ...prev, [filter.key]: "all" }))}>
                      All {filter.label}
                    </DropdownMenuItem>
                    {filter.options.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setActiveFilters((prev) => ({ ...prev, [filter.key]: option.value }))}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <AnimatePresence>
          {filteredData.map((item, index) => {
            const itemId = String(item.id || index)
            return (
              <motion.div
                key={itemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible open={openItems.includes(itemId)} onOpenChange={() => toggleItem(itemId)}>
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">{renderCard(item, index)}</div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openItems.includes(itemId) ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2"
                    >
                      <Card className="bg-gradient-to-br from-background to-background/50">
                        <CardContent className="p-4">{renderDetails(item)}</CardContent>
                      </Card>
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No items found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
