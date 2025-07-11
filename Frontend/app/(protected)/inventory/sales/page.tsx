"use client";

import SalesOrdersTable, { SalesOrder } from "./components/SalesOrdersTable";
import SalesReportChart, { ChartDatum } from "./components/SalesReportChart";
import QuickActions from "../components/QuickActions";
import { RecentActivity, Activity } from "../products/components/RecentActivity";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { SalesSearchBar } from "./components/SalesSearchBar";
import { PlaceOrderButton } from "./components/PlaceOrderButton";

const salesData: SalesOrder[] = [
  { id: 1, productName: "MacBook Pro", orderCode: "#0001", company: "Laptop", quantity: 1, totalPrice: "$1,299", lastDays: "View Report" },
  { id: 2, productName: "MacBook Pro", orderCode: "#0002", company: "Laptop", quantity: 1, totalPrice: "$1,299", lastDays: "View Report" },
  { id: 3, productName: "MacBook Pro", orderCode: "#0003", company: "Laptop", quantity: 1, totalPrice: "$1,299", lastDays: "View Report" },
  { id: 4, productName: "MacBook Pro", orderCode: "#0004", company: "Laptop", quantity: 1, totalPrice: "$1,299", lastDays: "View Report" },
  { id: 5, productName: "MacBook Pro", orderCode: "#0005", company: "Laptop", quantity: 1, totalPrice: "$1,299", lastDays: "View Report" },
];

const chartData: ChartDatum[] = [
  { name: "Jan", sales: 4000, orders: 2400, revenue: 2400 },
  { name: "Feb", sales: 3000, orders: 1398, revenue: 2210 },
  { name: "Mar", sales: 2000, orders: 9800, revenue: 2290 },
  { name: "Apr", sales: 2780, orders: 3908, revenue: 2000 },
  { name: "May", sales: 1890, orders: 4800, revenue: 2181 },
  { name: "Jun", sales: 2390, orders: 3800, revenue: 2500 },
  { name: "Jul", sales: 3490, orders: 4300, revenue: 2100 },
];

const activities: Activity[] = [
  { action: "Ordered", item: "MacBook Pro", time: "2 min ago" },
  { action: "Shipped", item: "iPhone 14", time: "5 min ago" },
  { action: "Delivered", item: "iPad Pro", time: "10 min ago" },
  { action: "Returned", item: "Apple Watch", time: "15 min ago" },
];

export default function SalesPage() {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout title="Sales Orders">
      <div className="p-4 lg:p-6">
        {/* Top bar: Search and Place Order */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <SalesSearchBar value={search} onChange={setSearch} />
          <PlaceOrderButton onClick={() => { /* TODO: open order dialog */ }} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Content - Sales Orders and Chart */}
          <div className="xl:col-span-2 space-y-6">
            <SalesOrdersTable salesData={salesData} />
            <SalesReportChart chartData={chartData} />
          </div>
          {/* Right Sidebar - Quick Actions and Recent Activity */}
          <div className="xl:col-span-1 space-y-6">
            <QuickActions />
            <RecentActivity activities={activities} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
