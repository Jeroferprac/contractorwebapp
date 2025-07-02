"use client"

import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import { API } from "@/lib/api"

// Import the new main dashboard components
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricsCards } from "@/components/cards/metrics-cards"
import { RevenueChart } from "@/components/dashboard/charts/revenue-chart"
import { WeeklyRevenueChart } from "@/components/dashboard/charts/weekly-revenue-chart"
import { CheckTable } from "@/components/dashboard/tables/check-table"
import { ComplexTable } from "@/components/dashboard/tables/complex-table"
import { DailyTrafficChart } from "@/components/dashboard/charts/daily-traffic-chart"
import { PieChart } from "@/components/dashboard/charts/pie-chart"
import { TasksWidget } from "@/components/dashboard/widgets/tasks-widget"
import { CalendarWidget } from "@/components/dashboard/widgets/calendar-widget"
import { TeamMembers } from "@/components/dashboard/widgets/team-members"
import { SecurityCard } from "@/components/dashboard/widgets/security-card"
import { StarbucksCard } from "@/components/dashboard/widgets/starbucks-card"
import { LessonCard } from "@/components/dashboard/bottom/lesson-card"
export default function DashboardClient({ session }: { session: Session | null }) {
  // Your existing state management
  const [stats, setStats] = useState({
    earnings: 0,
    spend: 0,
    sales: 0,
    balance: 0,
    tasks: 0,
    projects: 0, // Added for the new design
  })

  const [revenueChartData, setRevenueChartData] = useState<{ month: string; thisMonth: number; lastMonth: number }[]>(
    [],
  )

  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  // Your existing useEffect logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        earnings: 350.4, // Updated to match main dashboard format
        spend: 642.39,
        sales: 574.34,
        balance: 1000,
        tasks: 154,
        projects: 2935, // Added for new design
      })

      setRevenueChartData([
        { month: "SEP", thisMonth: 100, lastMonth: 60 },
        { month: "OCT", thisMonth: 120, lastMonth: 70 },
        { month: "NOV", thisMonth: 90, lastMonth: 50 },
        { month: "DEC", thisMonth: 110, lastMonth: 60 },
        { month: "JAN", thisMonth: 130, lastMonth: 80 },
        { month: "FEB", thisMonth: 95, lastMonth: 65 },
      ])

      setLoading(false)
    }, 1000)

    const fetchProfile = async () => {
      if (!session?.backendAccessToken) return

      try {
        const res = await fetch(API.PROFILE, {
          headers: {
            Authorization: `Bearer ${session.backendAccessToken}`,
          },
        })
        if (!res.ok) throw new Error("User not found")

        const data = await res.json()
        setUserProfile(data)
        console.log("✅ Fetched profile:", data)
      } catch (error) {
        console.error("❌ Error fetching user profile:", error)
      }
    }

    fetchProfile()

    return () => clearTimeout(timer)
  }, [session])

  return (
    <DashboardLayout session={session} userProfile={userProfile}>
      <div className="space-y-6">
        {/* Metrics Cards - Your stats with new design */}
        <MetricsCards stats={stats} loading={loading} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart data={revenueChartData} loading={loading} />
          </div>
          <div>
            <WeeklyRevenueChart />
          </div>
        </div>

        {/* Tables and Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CheckTable />
          <div className="space-y-6">
            <DailyTrafficChart />
            <PieChart />
          </div>
        </div>

        {/* Complex Table and Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ComplexTable />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TasksWidget />
            <CalendarWidget />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" >
          <LessonCard />
          <TeamMembers />
          <div className="space-y-6">
            <SecurityCard />
            <StarbucksCard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
