"use client";

import {DashboardLayout} from "@/components/layout/dashboard-layout";
import SummaryCards from "./components/SummaryCards";
import StockReportChart from "./components/StockReportChart";
import SalesOrderTable from "./components/SalesOrderTable";
import FastMovingItems from "./components/FastMovingItems";
import QuickActions from "./components/QuickActions";
import { useSession } from "next-auth/react"

export default function InventoryDashboard() {
    const { data: session } = useSession();
    
  return (
    <DashboardLayout session={session} title="Inventory Dashboard">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 space-y-6">
          <SummaryCards />
          <StockReportChart />
          <SalesOrderTable />
        </div>
        <div className="xl:col-span-4 space-y-6">
          <QuickActions />
          <FastMovingItems />
        </div>
      </div>
    </DashboardLayout>
  );
}
