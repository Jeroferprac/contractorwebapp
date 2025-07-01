"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { API } from "@/lib/api"

import Sidebar from "@/components/layout/sidebar"
import { Header } from "@/components/dashboard/header/Header"
import DashboardStats from "@/components/dashboard/stats/DashboardStats"
import RevenueLineChart from "@/components/dashboard/charts/RevenueLineChart"
import WeeklyRevenueChart from "@/components/dashboard/charts/WeeklyRevenueChart"
import DailyTrafficChart from "@/components/dashboard/charts/DailyTrafficChart"
import PieChartCard from "@/components/dashboard/charts/PieChartCard"
import CheckTable from "@/components/dashboard/tables/CheckTable"
import {ComplexTable} from "@/components/dashboard/tables/ComplexTable"
import TasksCard from "@/components/dashboard/widgets/TasksCard"
import TeamMembersCard from "@/components/dashboard/widgets/TeamMembersCard"
import SecurityCard from "@/components/dashboard/widgets/SecurityCard"
import PromoCard from "@/components/dashboard/widgets/PromoCard"
import BusinessDesignCard from "@/components/dashboard/bottom/BusinessDesignCard"

export default function DashboardClient({ session }: { session: Session | null }) {
  const [stats, setStats] = useState({
    earnings: 0,
    spend: 0,
    sales: 0,
    balance: 0,
    tasks: 0,
  })

  const [revenueChartData, setRevenueChartData] = useState<
    { month: string; thisMonth: number; lastMonth: number }[]
  >([])

  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        earnings: 23450,
        spend: 4250,
        sales: 1510,
        balance: 1000,
        tasks: 154,
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
    <div className="min-h-screen bg-[#f4f7fe] p-4">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Final header with search, theme toggle, avatar, etc. */}
            <Header session={session} />

            {/* Stats Section */}
            <DashboardStats stats={stats} loading={loading} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RevenueLineChart
                data={revenueChartData.map((item) => ({
                  month: item.month,
                  value: item.thisMonth,
                }))}
              />
              <WeeklyRevenueChart />
            </div>

            {/* Check Table + Traffic + Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CheckTable />
              <div className="space-y-4">
                <DailyTrafficChart />
                <PieChartCard />
              </div>
            </div>

            {/* Widgets Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <TasksCard />
              <TeamMembersCard />
              <SecurityCard />
              <PromoCard />
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ComplexTable />
              <BusinessDesignCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

