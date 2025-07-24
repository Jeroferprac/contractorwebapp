"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, ArrowRightLeft, MapPin, BarChart3, FileText } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import WarehouseOverview from "./overview/page"
import WarehouseReports from "./reports/page"
import WarehouseStocks from "./stock/page"
import WarehouseTransfers from "./transfers/page"
import WarehouseBinLocations from "./warehouse/page"

export default function WarehouseManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout title="Warehouse Management">
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-[#020817]/80 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-2 shadow-2xl shadow-purple-500/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:shadow-xl data-[state=active]:shadow-purple-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:shadow-xl data-[state=active]:shadow-emerald-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger
              value="stocks"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:shadow-xl data-[state=active]:shadow-amber-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
            >
              <Package className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Stocks</span>
            </TabsTrigger>
            <TabsTrigger
              value="transfers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 data-[state=active]:shadow-xl data-[state=active]:shadow-pink-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20"
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Transfers</span>
            </TabsTrigger>
            <TabsTrigger
              value="bins"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 data-[state=active]:shadow-xl data-[state=active]:shadow-indigo-500/30 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Bins</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
              <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              <TabsContent value="overview" className="mt-0">
                <WarehouseOverview />
              </TabsContent>
              <TabsContent value="reports" className="mt-0">
                <WarehouseReports />
              </TabsContent>
              <TabsContent value="stocks" className="mt-0">
                <WarehouseStocks />
            </TabsContent>
              <TabsContent value="transfers" className="mt-0">
                <WarehouseTransfers />
            </TabsContent>
              <TabsContent value="bins" className="mt-0">
                <WarehouseBinLocations />
            </TabsContent>
              </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
