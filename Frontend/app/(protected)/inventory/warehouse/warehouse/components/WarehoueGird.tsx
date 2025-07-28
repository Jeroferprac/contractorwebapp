"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Edit, Trash2, Package, MapPin, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

const bins = [
  {
    id: "BIN-A12",
    warehouse: "Warehouse A",
    type: "Picking",
    typeColor: "bg-green-500",
    itemCount: 45,
    capacity: 60,
    fillPercentage: 75,
    status: "active",
    location: "Zone A, Row 1, Level 2",
  },
  {
    id: "BIN-B08",
    warehouse: "Warehouse B",
    type: "Putaway",
    typeColor: "bg-blue-500",
    itemCount: 0,
    capacity: 50,
    fillPercentage: 0,
    status: "empty",
    location: "Zone B, Row 3, Level 1",
  },
  {
    id: "BIN-C15",
    warehouse: "Warehouse A",
    type: "Overflow",
    typeColor: "bg-orange-500",
    itemCount: 38,
    capacity: 40,
    fillPercentage: 95,
    status: "nearly_full",
    location: "Zone C, Row 2, Level 3",
  },
  {
    id: "BIN-D22",
    warehouse: "Distribution Center 1",
    type: "Quarantine",
    typeColor: "bg-red-500",
    itemCount: 12,
    capacity: 30,
    fillPercentage: 40,
    status: "active",
    location: "Zone D, Row 1, Level 1",
  },
  {
    id: "BIN-E07",
    warehouse: "Warehouse B",
    type: "Staging",
    typeColor: "bg-purple-500",
    itemCount: 25,
    capacity: 35,
    fillPercentage: 71,
    status: "active",
    location: "Zone E, Row 4, Level 2",
  },
  {
    id: "BIN-F19",
    warehouse: "Warehouse A",
    type: "Picking",
    typeColor: "bg-green-500",
    itemCount: 0,
    capacity: 55,
    fillPercentage: 0,
    status: "empty",
    location: "Zone F, Row 2, Level 1",
  },
]

export function WarehouseGrid() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Bin Locations ({bins.length})</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bins.map((bin, index) => (
          <motion.div
            key={bin.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <Card className="p-6 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{bin.id}</h3>
                  <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-3 w-3" />
                    <span>{bin.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Warehouse & Type */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{bin.warehouse}</span>
                <Badge className={`${bin.typeColor} text-white border-0`}>{bin.type}</Badge>
              </div>

              {/* Capacity Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Items</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {bin.itemCount} / {bin.capacity}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={bin.fillPercentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{bin.fillPercentage}% filled</span>
                    {bin.status === "nearly_full" && (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertCircle className="h-3 w-3" />
                        <span>Nearly Full</span>
                      </div>
                    )}
                    {bin.status === "empty" && <span className="text-slate-400">Empty</span>}
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      bin.status === "active"
                        ? "bg-green-500"
                        : bin.status === "empty"
                          ? "bg-slate-400"
                          : bin.status === "nearly_full"
                            ? "bg-orange-500"
                            : "bg-slate-400"
                    }`}
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {bin.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center pt-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80 border-white/20">
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((page) => (
              <Button
                key={page}
                variant={page === 1 ? "default" : "ghost"}
                size="sm"
                className={page === 1 ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80 border-white/20">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
