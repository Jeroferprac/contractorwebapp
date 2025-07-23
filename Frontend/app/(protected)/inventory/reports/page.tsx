// src/app/reports/page.tsx (or wherever your ReportsPage component is located)

"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { WeeklySalesChart } from "./components/WeaklySalesChart";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { ReportActions } from "./components/ReportActions";
import PurchaseBySupplierChart from "./components/PurchaseBySupplierChart";
import { SalesByCustomerChart } from "./components/SalesByCustomerChart";
import SalesByProductChart from "./components/SalesByProductChart";
import PurchaseByProductChart from "./components/PurchaseByProductChart";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#181f36]">
        <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
          {/* 1. Top Summary Cards - Professional Look */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-[#2156f8] text-white rounded-[24px] shadow-lg p-7 flex flex-col min-h-[120px] min-w-[180px] dark:bg-[#232946] dark:text-white">
              <span className="text-base font-semibold mb-2">Total Shipments</span>
              <span className="text-3xl font-extrabold tracking-tight">18,250</span>
            </Card>
            <Card className="bg-[#e0f7fa] text-[#2156f8] rounded-[24px] shadow-lg p-7 flex flex-col min-h-[120px] min-w-[180px] dark:bg-[#232946] dark:text-blue-200">
              <span className="text-base font-semibold mb-2">Active Shipments</span>
              <span className="text-3xl font-extrabold tracking-tight">880</span>
              <span className="text-xs mt-1 text-[#0097a7] font-medium dark:text-cyan-300">14% of total</span>
            </Card>
            <Card className="bg-[#e8f5e9] text-[#388e3c] rounded-[24px] shadow-lg p-7 flex flex-col min-h-[120px] min-w-[180px] dark:bg-[#232946] dark:text-green-200">
              <span className="text-base font-semibold mb-2">Completed</span>
              <span className="text-3xl font-extrabold tracking-tight">16,456</span>
              <span className="text-xs mt-1 text-[#43a047] font-medium dark:text-green-300">81% of total</span>
            </Card>
            <Card className="bg-[#ffebee] text-[#d32f2f] rounded-[24px] shadow-lg p-7 flex flex-col min-h-[120px] min-w-[180px] dark:bg-[#232946] dark:text-pink-200">
              <span className="text-base font-semibold mb-2">Returned</span>
              <span className="text-3xl font-extrabold tracking-tight">912</span>
              <span className="text-xs mt-1 text-[#c62828] font-medium dark:text-pink-300">5% of total</span>
            </Card>
            <Card className="bg-[#e3e7fd] text-[#3949ab] rounded-[24px] shadow-lg p-7 flex flex-col min-h-[120px] min-w-[180px] dark:bg-[#232946] dark:text-indigo-200">
              <span className="text-base font-semibold mb-2">Active Shipments</span>
              <span className="text-3xl font-extrabold tracking-tight">$96</span>
              <span className="text-xs mt-1 text-[#5c6bc0] font-medium dark:text-indigo-300">14% of total</span>
            </Card>
          </div>
          {/* 2. Print Reports Button */}
          <div className="flex justify-end mb-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow font-semibold flex items-center gap-2 dark:bg-blue-500 dark:hover:bg-blue-400">
              <Printer className="w-5 h-5" />
              Print Reports
            </Button>
          </div>
          {/* 3. Main Analytics Grid (Stacked) */}
          <div className="grid grid-cols-1 gap-6">
            <SupplierPerformanceChart />
            <WeeklySalesChart />
          </div>
          {/* 4. Lower Analytics Grid - Remove Outer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopSuppliersChart />
            <SalesByProductChart />
            <PurchaseBySupplierChart />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}