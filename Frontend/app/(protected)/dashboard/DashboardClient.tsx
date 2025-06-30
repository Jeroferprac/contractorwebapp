"use client"

import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { API } from "@/lib/api"

import Sidebar from "@/components/layout/sidebar"
import HeaderBar from "@/components/layout/navbar"

import DashboardStats from "@/components/dashboard/stats/DashboardStats"
import RevenueLineChart from "@/components/dashboard/charts/RevenueLineChart"
import WeeklyRevenueChart from "@/components/dashboard/charts/WeeklyRevenueChart"
import DailyTrafficChart from "@/components/dashboard/charts/DailyTrafficChart"
import PieChartCard from "@/components/dashboard/charts/PieChartCard"
import CheckTable from "@/components/dashboard/tables/CheckTable"
import ComplexTable from "@/components/dashboard/tables/ComplexTable"
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

    if (session?.accessToken && session.user) {
      fetch(API.PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("User not found")
          return res.json()
        })
        .then((data) => {
          setUserProfile(data)
          console.log("✅ Fetched profile:", data)
        })
        .catch((err) => {
          console.error("❌ Error fetching user profile:", err)
        })
    }

    return () => clearTimeout(timer)
  }, [session])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Branding */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white">
            Contractor<span className="rounded bg-white px-2 py-1 text-blue-600">HUB</span>
          </h1>
          <p className="text-white mt-2">Welcome, {session?.user?.name}</p>
        </div>

        {/* Main Dashboard */}
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex gap-6">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              <HeaderBar />
              <DashboardStats stats={stats} loading={loading} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RevenueLineChart
                  data={revenueChartData.map((item) => ({
                    month: item.month,
                    value: item.thisMonth // or item.lastMonth based on what you want
                  }))}
                />

                <WeeklyRevenueChart />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <CheckTable />
                <div className="space-y-4">
                  <DailyTrafficChart />
                  <PieChartCard />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TasksCard />
                <TeamMembersCard />
                <SecurityCard />
                <PromoCard />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ComplexTable />
                <BusinessDesignCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
