"use client";

import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeeklySalesChart } from "./components/WeaklySalesChart";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { SalesByCustomerChart } from "./components/SalesByCustomerChart";
import SalesByProductChart from "./components/SalesByProductChart";

const summary = [
  {
    label: "Projects",
    value: "24",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    sub: "Running this month",
  },
  {
    label: "Active Contractors",
    value: "8",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    sub: "14% of total",
  },
  {
    label: "Total Quotes",
    value: "112",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    sub: "81% approved",
  },
  {
    label: "Purchase Orders",
    value: "37",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    sub: "5% pending",
  },
  {
    label: "Revenue",
    value: "$1.25M",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    sub: "This fiscal year",
  },
];

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="min-h-screen w-full bg-[#f6f8fc] dark:bg-[#0b0f19] px-4 py-8 space-y-12 text-gray-800 dark:text-gray-100">

        {/* Summary Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {summary.map((item, index) => (
            <Card
              key={index}
              className={`rounded-2xl border-0 shadow-md p-5 transition hover:shadow-lg ${item.color}`}
            >
              <div className="text-sm font-medium uppercase tracking-wide">
                {item.label}
              </div>
              <div className="text-3xl font-semibold mt-2">{item.value}</div>
              <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                {item.sub}
              </div>
            </Card>
          ))}
        </section>

        {/* Main Charts */}
        <section className="space-y-8">
          <SalesByProductChart />
          <WeeklySalesChart />
        </section>

        {/* Side Charts & Performance */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <TopSuppliersChart />
          <div className="col-span-1 xl:col-span-2">
            <SupplierPerformanceChart />
          </div>
        </section>

        {/* Footer Chart */}
        <section className="mt-10">
          <SalesByCustomerChart />
        </section>
      </div>
    </DashboardLayout>
  );
}
