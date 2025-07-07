"use client"

import { useEffect, useState } from "react"
import type { Session } from "next-auth"
import { API } from "@/lib/api"

// Dashboard components
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

// Optionally, define a type for user profile
// import type { UserProfile } from "@/types/user"

export default function DashboardClient({ session }: { session: Session | null }) {
  // Dashboard stats state
  
  const [stats, setStats] = useState({
    earnings: 0,
    spend: 0,
    sales: 0,
    balance: 0,
    tasks: 0,
    projects: 0,
  })

  const [revenueChartData, setRevenueChartData] = useState<{ month: string; thisMonth: number; lastMonth: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    // Demo stats (replace with real API calls in production)
    const timer = setTimeout(() => {
      setStats({
        earnings: 350.4,
        spend: 642.39,
        sales: 574.34,
        balance: 1000,
        tasks: 154,
        projects: 2935,
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
    }, 2000)

    // Fetch user profile from backend
    const fetchProfile = async () => {
      if (!session?.backendAccessToken) {
        setUserProfile(null)
        setProfileLoading(false)
        return
      }
      setProfileLoading(true)
      try {
        const res = await fetch(API.PROFILE, {
          headers: {
            Authorization: `Bearer ${session.backendAccessToken}`,
          },
        })
        if (!res.ok) throw new Error("User not found")
        const data = await res.json()
        setUserProfile(data)
        // Optionally: setProfileLoading(false) here
      } catch (error) {
        setUserProfile(null)
        // Optionally: show a toast or error message
        console.error("❌ Error fetching user profile:", error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
    return () => clearTimeout(timer)
  }, [session])
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  // if (profileLoading) return <div>Loading profile...</div>

  return (
    <DashboardLayout session={session} userProfile={userProfile}>
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
      </div>
    </DashboardLayout>
  )
}