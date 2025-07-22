"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { WeeklySalesChart } from "./components/WeaklySalesChart"
import { TopSuppliersChart } from "./components/TopSuppliers"
import { SupplierPerformanceChart } from "./components/SupplierPerformance"
import { ReportActions } from "./components/ReportActions"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import PurchaseBySupplierChart from "./components/PurchaseBySupplierChart"
import SalesByCustomerChart from "./components/SalesByCustomerChart"
import SalesByProductChart from "./components/SalesByProductChart"
import { PurchaseByProductChart } from "./components/PurchaseByProductChart"

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-[#1e293b] dark:via-[#312e81] dark:to-[#0ea5e9] px-2 sm:px-4 py-8 flex flex-col items-center">
        <div className="max-w-7xl w-full space-y-8">
          {/* Print Reports Button */}
          <div className="flex justify-end mb-4">
            <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 text-white px-6 py-2 rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all font-semibold text-base">
              <Printer className="w-5 h-5 mr-2" />
              Print Reports
            </Button>
          </div>
          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-6">
              <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">Weekly Sales Overview</CardTitle>
                  <CardDescription className="text-base text-slate-500 dark:text-slate-300">Sales performance over the last week.</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklySalesChart />
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <CardTitle className="text-xl font-bold text-purple-700 dark:text-purple-300">Supplier Performance</CardTitle>
                  <CardDescription className="text-base text-slate-500 dark:text-slate-300">Performance metrics for key suppliers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplierPerformanceChart />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <CardTitle className="text-xl font-bold text-cyan-700 dark:text-cyan-300">Top Suppliers</CardTitle>
                  <CardDescription className="text-base text-slate-500 dark:text-slate-300">Suppliers with the highest volume.</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopSuppliersChart />
                </CardContent>
              </Card>
              <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
                <CardHeader className="pb-2 flex flex-row items-center gap-2">
                  <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-300">Report Actions</CardTitle>
                  <CardDescription className="text-base text-slate-500 dark:text-slate-300">Quick actions for report management.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportActions />
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Summary Cards Section */}
          <h2 className="text-2xl font-bold mb-2 pt-4 text-gray-800 dark:text-white">Summary Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300">Sales by Customer</CardTitle>
                <CardDescription className="text-base text-slate-500 dark:text-slate-300">Overview of sales performance by individual customers.</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesByCustomerChart />
              </CardContent>
            </Card>
            <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-purple-700 dark:text-purple-300">Sales by Product</CardTitle>
                <CardDescription className="text-base text-slate-500 dark:text-slate-300">Breakdown of sales revenue generated by each product.</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesByProductChart />
              </CardContent>
            </Card>
            <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-cyan-700 dark:text-cyan-300">Purchase by Supplier</CardTitle>
                <CardDescription className="text-base text-slate-500 dark:text-slate-300">Suppliers with the highest purchase orders and spend.</CardDescription>
              </CardHeader>
              <CardContent>
                <PurchaseBySupplierChart />
              </CardContent>
            </Card>
            <Card className="rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl border-0 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300">Purchase by Product</CardTitle>
                <CardDescription className="text-base text-slate-500 dark:text-slate-300">Analysis of purchase volume and cost for each product.</CardDescription>
              </CardHeader>
              <CardContent>
                <PurchaseByProductChart />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
