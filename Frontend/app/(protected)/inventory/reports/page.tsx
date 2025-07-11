"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeeklySalesChart } from "./components/WeaklySalesChart";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { ReportActions } from "./components/ReportActions";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-6">
        {/* Print Reports Button */}
        <div className="flex justify-end mb-4">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Reports
          </Button>
        </div>
        {/* Top Row - Weekly Sales and Right Sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Weekly Sales Chart - Takes 3 columns on xl screens */}
          <div className="xl:col-span-3 space-y-5">
            <WeeklySalesChart />
            <SupplierPerformanceChart />

          </div>
          {/* Right Column - Top Suppliers and Quick Actions */}
          <div className="space-y-5">
            <TopSuppliersChart />
            <ReportActions />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
