
"use client";
import { API } from "@/lib/api"
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { MetricsCards } from "@/components/cards/metrics-cards";
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart";
import { WeeklyRevenueChart } from "@/components/dashboard/charts/weekly-revenue-chart";
import { CheckTable } from "@/components/dashboard/tables/check-table";
import { ComplexTable } from "@/components/dashboard/tables/complex-table";
import { DailyTrafficChart } from "@/components/dashboard/charts/daily-traffic-chart";
import { PieChart } from "@/components/dashboard/charts/pie-chart";
import { TasksWidget } from "@/components/dashboard/widgets/tasks-widget";
import { CalendarWidget } from "@/components/dashboard/widgets/calendar-widget";
import { TeamMembers } from "@/components/dashboard/widgets/team-members";
import { SecurityCard } from "@/components/dashboard/widgets/security-card";
import { StarbucksCard } from "@/components/dashboard/widgets/starbucks-card";
import { LessonCard } from "@/components/dashboard/bottom/lesson-card";


interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const [stats, setStats] = useState({
    earnings: 0,
    quotation: 0,
    projects: 0,
  });

  const [revenueChartData, setRevenueChartData] = useState<
    { month: string; thisMonth: number; lastMonth: number }[]
  >([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Demo stats (replace with real API calls in production)

    console.log("✅ Session received in DashboardClient:", session);


    const timer = setTimeout(() => {
      setStats({
        earnings: 350.4,
        quotation: 12,
        projects: 2935,
      })
      setRevenueChartData([
        { month: "SEP", thisMonth: 100, lastMonth: 60 },
        { month: "OCT", thisMonth: 120, lastMonth: 70 },
        { month: "NOV", thisMonth: 90, lastMonth: 50 },
        { month: "DEC", thisMonth: 110, lastMonth: 60 },
        { month: "JAN", thisMonth: 130, lastMonth: 80 },
        { month: "FEB", thisMonth: 95, lastMonth: 65 },
      ]);

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [session]);

  return (
    <div className="space-y-6">
      <MetricsCards stats={stats} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={revenueChartData} loading={loading} />
        </div>
        <div>
          <WeeklyRevenueChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CheckTable />
        <div className="space-y-6">
          <DailyTrafficChart />
          <PieChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplexTable />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TasksWidget />
          <CalendarWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LessonCard />
        <TeamMembers />
        <div className="space-y-6">
          <SecurityCard />
          <StarbucksCard />
        </div>
      </div>

    </DashboardLayout>
  )
}

