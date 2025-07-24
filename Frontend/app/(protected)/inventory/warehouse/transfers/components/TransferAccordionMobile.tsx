"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, Search, Filter, ArrowUpDown, Eye, Edit, X } from "lucide-react"

interface TransferAccordionMobileProps {
  data: Array<{
    id: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    date: string;
    status: string;
    priority: string;
  }>
}

const statusColors = {
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  "in-transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function TransferAccordionMobile({ data }: TransferAccordionMobileProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileStatusFilter, setMobileStatusFilter] = useState("all")
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fromWarehouse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.toWarehouse.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = mobileStatusFilter === "all" || item.status === mobileStatusFilter
    return matchesSearch && matchesStatus
  })

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-blue-500" />
          Transfer History
        </CardTitle>

        {/* Mobile Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search transfers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={mobileStatusFilter} onValueChange={setMobileStatusFilter}>
              <SelectTrigger className="flex-1">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="space-y-2 p-4">
          <AnimatePresence>
            {filteredData.map((transfer, index) => (
              <motion.div
                key={transfer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Collapsible
                  open={expandedItems.includes(transfer.id)}
                  onOpenChange={() => toggleExpanded(transfer.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Card className="cursor-pointer hover:bg-gradient-to-r hover:from-purple-500/5 hover:to-blue-500/5 transition-all duration-300 border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-medium text-purple-600">{transfer.id}</span>
                              <Badge className={statusColors[transfer.status as keyof typeof statusColors]}>
                                {transfer.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {transfer.fromWarehouse} → {transfer.toWarehouse}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {transfer.items} items • {new Date(transfer.date).toLocaleDateString()}
                            </p>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedItems.includes(transfer.id) ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="mt-2 border-border/50">
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">From:</span>
                              <p className="font-medium">{transfer.fromWarehouse}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">To:</span>
                              <p className="font-medium">{transfer.toWarehouse}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Items:</span>
                              <p className="font-medium">{transfer.items}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Priority:</span>
                              <p className="font-medium capitalize">{transfer.priority}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-border/50">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            {transfer.status === "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </CollapsibleContent>
                </Collapsible>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transfers found matching your criteria.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
