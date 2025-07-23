"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

// Use default imports for default exports:
import SalesByCustomerChart from "./components/SalesByCustomerChart";
import SalesByProductChart from "./components/SalesByProductChart";
import PurchaseBySupplierChart from "./components/PurchaseBySupplierChart";
import {PurchaseByProductChart} from "./components/PurchaseByProductChart";
import { ReportActions } from "./components/ReportActions";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { WeeklySalesChart } from "./components/WeaklySalesChart";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <section className="w-full px-2 sm:px-4 py-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 dark:from-slate-800 dark:via-slate-900 dark:to-blue-900">
        <div className="w-full max-w-7xl mx-auto space-y-10">
          {/* Header Action */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reports Dashboard</h1>
            <Button
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white font-medium hover:from-blue-700 hover:to-cyan-600"
              size="lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Print Reports
            </Button>
          </div>

          {/* Main Chart Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">Weekly Sales Overview</CardTitle>
                  <CardDescription>Sales performance over the last week</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeeklySalesChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">Supplier Performance</CardTitle>
                  <CardDescription>Performance metrics for key suppliers</CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplierPerformanceChart />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-cyan-700 dark:text-cyan-300">Top Suppliers</CardTitle>
                  <CardDescription>Suppliers with the highest volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopSuppliersChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">Report Actions</CardTitle>
                  <CardDescription>Quick actions for managing reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReportActions />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-4 pt-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Summary Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">Sales by Customer</CardTitle>
                  <CardDescription>
                    Overview of sales performance by individual customers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <SalesByCustomerBarChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">Sales by Product</CardTitle>
                  <CardDescription>
                    Breakdown of sales revenue generated by each product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <SalesByProductChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-cyan-700 dark:text-cyan-300">Purchase by Supplier</CardTitle>
                  <CardDescription>
                    Highest purchase orders and spending per supplier.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <PurchaseBySupplierChart />
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-blue-700 dark:text-blue-300">Purchase by Product</CardTitle>
                  <CardDescription>
                    Analysis of purchase cost by product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-center">
                  <PurchaseByProductChart />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
