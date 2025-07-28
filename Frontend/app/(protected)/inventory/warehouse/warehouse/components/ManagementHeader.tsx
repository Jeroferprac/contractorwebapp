"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Map, List, Warehouse } from "lucide-react"

interface WarehouseManagementHeaderProps {
  viewMode: "list" | "map"
  onViewModeChange: (mode: "list" | "map") => void
}

export function WarehouseManagementHeader({
  viewMode,
  onViewModeChange,
}: WarehouseManagementHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 lg:gap-6"
    >
      {/* Title and List/Map Nav */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg"
          >
            <Warehouse className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <motion.h1
              className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
          Bin Location Management
            </motion.h1>
            <motion.p
              className="text-muted-foreground mt-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage and organize your warehouse bin locations
            </motion.p>
      </div>
        </div>
        {/* List/Map Nav */}
        <div className="flex items-center bg-white/80 dark:bg-slate-800/80 rounded-xl p-1 border border-white/20">
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={viewMode === "list" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("map")}
            className={viewMode === "map" ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" : ""}
          >
            <Map className="w-4 h-4 mr-2" />
            Map
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
