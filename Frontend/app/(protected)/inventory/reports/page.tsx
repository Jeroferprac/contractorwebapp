"use client";

import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WeeklySalesChart } from "./components/WeaklySalesChart";
import { TopSuppliersChart } from "./components/TopSuppliers";
import { SupplierPerformanceChart } from "./components/SupplierPerformance";
import { SalesByCustomerChart } from "./components/SalesByCustomerChart";
import SalesByProductChart from "./components/SalesByProductChart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";

const summary = [
  {
    label: "Projects",
    value: "24",
    accent: "bg-blue-500",
    textColor: "text-blue-700",
    sub: "Running this month",
  },
  {
    label: "Active Contractors",
    value: "8",
    accent: "bg-purple-500",
    textColor: "text-purple-700",
    sub: "14% of total",
  },
  {
    label: "Total Quotes",
    value: "112",
    accent: "bg-green-500",
    textColor: "text-green-700",
    sub: "81% approved",
  },
  {
    label: "Purchase Orders",
    value: "37",
    accent: "bg-orange-500",
    textColor: "text-orange-700",
    sub: "5% pending",
  },
  {
    label: "Revenue",
    value: "$1.25M",
    accent: "bg-pink-500",
    textColor: "text-pink-700",
    sub: "This fiscal year",
  },
];

export default function ReportsPage() {
  const [lastUpdated, setLastUpdated] = React.useState("");

  React.useEffect(() => {
    setLastUpdated(new Date().toLocaleString());
    // No return value needed
  }, []);
  return (
    <DashboardLayout title="Reports">
      <div className="min-h-screen w-full bg-[#f6f8fc] dark:bg-gradient-to-br dark:from-[#181f2a] dark:to-[#232946] px-4 py-8 space-y-12 text-gray-800 dark:text-gray-100">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
            <p className="text-muted-foreground mt-1">Comprehensive analytics and insights for your business.</p>
            <span className="text-xs text-muted-foreground mt-2 block">Last updated: {lastUpdated}</span>
          </div>
          <Button
            variant="default"
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2 text-base font-semibold shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white border-0 hover:brightness-110"
            aria-label="Download report"
          >
            <Download className="w-5 h-5" />
            Export
          </Button>
        </div>
        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-4 w-full max-w-5xl mx-auto">
          {summary.map((item, index) => (
            <Card
              key={index}
              className="h-28 w-full rounded-2xl border border-white/30 dark:border-white/20 shadow-xl bg-white/60 dark:bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-center p-2 sm:p-4 transition-all duration-200 hover:shadow-2xl hover:scale-[1.03] hover:brightness-105"
            >
              <div className="flex flex-col items-center justify-center h-full w-full">
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-blue-100 mb-1">
                  {item.label}
                </div>
                <div className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${item.textColor} mb-1`}>
                  {item.value}
                </div>
                <div className="text-[11px] sm:text-xs text-muted-foreground dark:text-blue-100 font-medium">
                  {item.sub}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Charts */}
        <div className="border-t border-muted/30 my-8" />
        <section className="flex flex-col items-center w-full max-w-5xl mx-auto gap-10 py-4">
          <SalesByProductChart />
          <WeeklySalesChart />
        </section>

        {/* Side Charts & Performance */}
        <div className="border-t border-muted/30 my-8" />
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <div className="h-full md:col-span-1">
            <TopSuppliersChart />
          </div>
          <div className="h-full md:col-span-2">
            <SupplierPerformanceChart />
          </div>
        </section>

        {/* Footer Chart */}
        <div className="border-t border-muted/30 my-8" />
        <section className="mt-10">
          <SalesByCustomerChart />
        </section>
      </div>
    </DashboardLayout>
  );
}
