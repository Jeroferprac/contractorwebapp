
"use client";
import type { Session } from "next-auth";
import { useEffect, useState, Suspense, useMemo, memo } from "react";
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
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useCompanyStore } from "@/store/companyStore";
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton components
const ChartSkeleton = memo(() => (
  <div className="border-0 shadow-sm bg-white dark:bg-[#020817] rounded-lg p-6">
    <Skeleton className="h-4 w-32 mb-4" />
    <Skeleton className="h-48 w-full" />
  </div>
));

const WidgetSkeleton = memo(() => (
  <div className="border-0 shadow-sm bg-white dark:bg-[#020817] rounded-lg p-6">
    <Skeleton className="h-4 w-24 mb-4" />
    <Skeleton className="h-32 w-full" />
  </div>
));

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const projects = useCompanyStore((state) => state.projects);
  const projectsLoading = useCompanyStore((state) => state.projectsLoading);
  const fetchProjects = useCompanyStore((state) => state.fetchProjects);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Calculate total projects
  const stats = useMemo(() => ({
    earnings: 350.4, // Replace with real calculation if available
    quotation: 12,   // Replace with real calculation if available
    projects: projects.length,
  }), [projects.length]);

  // Aggregate project values by month for the revenue chart
  const revenueChartData = useMemo(() => {
    const monthly: Record<string, number> = {};
    projects.forEach(project => {
      if (!project.completion_date || !project.project_value) return;
      const date = new Date(project.completion_date);
      const month = date.toLocaleString('default', { month: 'short' });
      if (!monthly[month]) monthly[month] = 0;
      monthly[month] += project.project_value;
    });
    // Optionally, sort months in calendar order
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthOrder.map(month => ({
      month,
      thisMonth: monthly[month] || 0,
      lastMonth: 0, // You can add logic for lastMonth if you want
    })).filter(item => item.thisMonth > 0);
  }, [projects]);

  const loading = projectsLoading;

  return (
    <DashboardLayout session={session} title="Main Dashboard">
      <div className="space-y-6">
        <MetricsCards stats={stats} loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Suspense fallback={<ChartSkeleton />}>
            <RevenueChart data={revenueChartData} loading={loading} />
            </Suspense>
          </div>
          <div>
            <Suspense fallback={<ChartSkeleton />}>
            <WeeklyRevenueChart />
            </Suspense>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<WidgetSkeleton />}>
          <CheckTable />
          </Suspense>
          <div className="space-y-6">
            <Suspense fallback={<ChartSkeleton />}>
            <DailyTrafficChart />
            </Suspense>
            <Suspense fallback={<ChartSkeleton />}>
            <PieChart />
            </Suspense>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<WidgetSkeleton />}>
          <ComplexTable />
          </Suspense>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Suspense fallback={<WidgetSkeleton />}>
            <TasksWidget />
            </Suspense>
            <Suspense fallback={<WidgetSkeleton />}>
            <CalendarWidget />
            </Suspense>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Suspense fallback={<WidgetSkeleton />}>
          <LessonCard />
          </Suspense>
          <Suspense fallback={<WidgetSkeleton />}>
          <TeamMembers />
          </Suspense>
          <div className="space-y-6">
            <Suspense fallback={<WidgetSkeleton />}>
            <SecurityCard />
            </Suspense>
            <Suspense fallback={<WidgetSkeleton />}>
            <StarbucksCard />
            </Suspense>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}