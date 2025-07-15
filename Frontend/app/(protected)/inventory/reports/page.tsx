"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeeklySalesChart } from "./components/WeaklySalesChart";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { ReportActions } from "./components/ReportActions";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import SalesByCustomerReport from "./components/SalesByCustomerReport";
import SalesByProductReport from "./components/SalesByProductReport";
import PurchaseBySupplierReport from "./components/PurchaseBySupplierReport";
import PurchaseByProductReport from "./components/PurchaseByProductReport";
import SalesByProductBarChart from "./components/SalesByProductBarChart";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import SalesByProductCustomerChart from "./components/SalesByProductCustomerChart";
import PurchaseBySupplierChart from "./components/PurchaseBySupplierChart";
import { getSalesDetailsByPeriod } from "@/lib/inventory";

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
        {/* Print Reports Button */}
        <div className="flex justify-end mb-4">
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Reports
          </Button>
        </div>
        {/* Existing dashboard charts and actions */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-5">
            <WeeklySalesChart />
            <SupplierPerformanceChart />
          </div>
          <div className="space-y-5">
            <TopSuppliersChart />
            <ReportActions />
          </div>
        </div>
        {/* New professional summary cards section */}
        <h1 className="text-2xl font-bold mb-2">Summary Reports</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sales by Product & Customer Stacked Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales by Product & Customer</CardTitle>
              <CardDescription>
                Distribution of sales revenue by product and customer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SalesByProductCustomerChart />
            </CardContent>
          </Card>
          {/* Purchase by Supplier Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase by Supplier</CardTitle>
              <CardDescription>Suppliers with the highest purchase orders and spend.</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseBySupplierChart />
            </CardContent>
          </Card>
          {/* Purchase by Product (keep as table for now) */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase by Product</CardTitle>
              <CardDescription>Most purchased products and total spend.</CardDescription>
            </CardHeader>
            <CardContent>
              <PurchaseByProductReport />
            </CardContent>
          </Card>
        </div>
        {/* You can add more sections/cards for Inventory Valuation, Profit/Loss, etc. */}
      </div>
    </DashboardLayout>
  );
}
