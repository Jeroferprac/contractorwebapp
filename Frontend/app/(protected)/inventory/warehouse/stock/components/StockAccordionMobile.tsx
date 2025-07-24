"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Package, MapPin, Building } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface StockAccordionMobileProps {
  data: Array<{
    id: string;
    productName: string;
    sku: string;
    quantity: number;
    binLocation: string;
    warehouse: string;
    category: string;
    status: string;
    lastUpdated: string;
  }>
  warehouseFilter: string
  categoryFilter: string
  statusFilter: string
}

const statusColors = {
  "in-stock": "bg-green-500/10 text-green-500 border-green-500/20",
  "low-stock": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  "out-of-stock": "bg-red-500/10 text-red-500 border-red-500/20",
}

export function StockAccordionMobile({ data, warehouseFilter, categoryFilter, statusFilter }: StockAccordionMobileProps) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const filteredData = data.filter((item) => {
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesWarehouse && matchesCategory && matchesStatus
  })

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-500" />
          Stock Inventory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence>
          {filteredData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Collapsible open={openItems.includes(item.id)} onOpenChange={() => toggleItem(item.id)}>
                <CollapsibleTrigger asChild>
                  <Card className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold group-hover:text-purple-600 transition-colors">
                              {item.productName}
                            </h4>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                openItems.includes(item.id) ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground font-mono">{item.sku}</span>
                            <Badge
                              className={`${statusColors[item.status as keyof typeof statusColors]} group-hover:scale-105 transition-transform`}
                            >
                              {item.status.replace("-", " ")}
                            </Badge>
                          </div>
                        </div>
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
                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Quantity</p>
                            <p className="font-semibold">{item.quantity.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-semibold">{item.category}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">Bin: {item.binLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{item.warehouse}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            Last updated: {new Date(item.lastUpdated).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-blue-500/10 bg-transparent"
                          >
                            Move
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredData.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-1">No stock items found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
