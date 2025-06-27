'use client'

import { Session } from "next-auth"
import {
  Bell, Search, Settings, BarChart3, ShoppingBag, Table, Layers,
  UserCircle, LogIn, TrendingUp, DollarSign, CreditCard, ChevronDown,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DashboardStatsCard } from "@/components/cards/DashboardStatsCard"
import { API } from "@/lib/api"



export default function DashboardClient({ session }: { session: Session | null }) {
  const [stats, setStats] = useState({
    earnings: 0,
    spend: 0,
    sales: 0,
    balance: 0,
    tasks: 0,
  })
  const [loading, setLoading] = useState(true)
  const [revenueChartData, setRevenueChartData] = useState<
    { month: string; thisMonth: number; lastMonth: number }[]
  >([])
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
        { month: 'SEP', thisMonth: 100, lastMonth: 60 },
        { month: 'OCT', thisMonth: 120, lastMonth: 70 },
        { month: 'NOV', thisMonth: 90, lastMonth: 50 },
        { month: 'DEC', thisMonth: 110, lastMonth: 60 },
        { month: 'JAN', thisMonth: 130, lastMonth: 80 },
        { month: 'FEB', thisMonth: 95, lastMonth: 65 },
      ])
      setLoading(false)
    }, 1000)

    // Store user details to backend when session and accessToken are available
    if (session?.accessToken && session.user) {
      fetch(API.PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          // Do something with the user profile data
          console.log(data);
        })
        .catch((err) => {
          console.error("Failed to fetch user profile:", err)
        })
    }

    return () => clearTimeout(timer)
  }, [session])
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4">
      {/* Main Dashboard Container */}
      <div className="mx-auto max-w-7xl">
        {/* Header with Horizon UI branding */}
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-white">
            Contractor<span className="rounded bg-white px-2 py-1 text-blue-600">HUB</span>
          </h1>
          <p className="text-white mt-2">Welcome, {session?.user?.name}</p>

        </div>

        {/* Dashboard Content */}
        <div className="rounded-3xl bg-white p-6 shadow-2xl">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 space-y-2">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">HORIZON FREE</h2>
              </div>

              <nav className="space-y-1">
                <Button variant="ghost" className="w-full justify-start bg-blue-50 text-blue-600 hover:bg-blue-100">
                  <BarChart3 className="mr-3 h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                  <ShoppingBag className="mr-3 h-4 w-4" />
                  NFT Marketplace
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                  <Table className="mr-3 h-4 w-4" />
                  Tables
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                  <Layers className="mr-3 h-4 w-4" />
                  Kanban
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                  <UserCircle className="mr-3 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
                  <LogIn className="mr-3 h-4 w-4" />
                  Sign In
                </Button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pages / Dashboard</p>
                  <h1 className="text-2xl font-bold text-gray-900">Main Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search" className="pl-10 w-64" />
                  </div>
                  <Bell className="h-5 w-5 text-gray-400" />
                  <Settings className="h-5 w-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-5 gap-4">
                <DashboardStatsCard
                  title="Earnings"
                  value={`$${stats.earnings}`}
                  icon={<TrendingUp className="h-4 w-4 text-green-500" />}
                  isLoading={loading}
                />
                <DashboardStatsCard
                  title="Spend this month"
                  value={`$${stats.spend}`}
                  icon={<DollarSign className="h-4 w-4 text-red-500" />}
                  isLoading={loading}
                />
                <DashboardStatsCard
                  title="Sales"
                  value={`$${stats.sales}`}
                  icon={<BarChart3 className="h-4 w-4 text-green-500" />}
                  isLoading={loading}
                />
                <DashboardStatsCard
                  title="Your Balance"
                  value={`$${stats.balance}`}
                  icon={<CreditCard className="h-4 w-4 text-blue-500" />}
                  isLoading={loading}
                />
                <DashboardStatsCard
                  title="New Tasks"
                  value={stats.tasks}
                  icon={
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  }
                  isLoading={loading}
                />
              </div>


              {/* Charts Row */}
              <div className="grid grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <Card className="col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">This month</p>
                      <div className="flex items-center gap-4">
                        <h3 className="text-3xl font-bold">$37.5K</h3>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Total Spent: +2.45%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-green-600">On track</span>
                      </div>
                    </div>
                    <BarChart3 className="h-5 w-5 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between px-4">
                      {revenueChartData.map((item) => (
                        <div key={item.month} className="flex flex-col items-center gap-2">
                          <div className="relative flex gap-1">
                            <div
                              className="w-8 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t"
                              style={{ height: `${item.thisMonth}px` }}
                            ></div>
                            <div
                              className="w-8 bg-gradient-to-t from-cyan-300 to-blue-400 rounded-t"
                              style={{ height: `${item.lastMonth}px` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{item.month}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                </Card>

                {/* Weekly Revenue */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Weekly Revenue</CardTitle>
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between">
                      {Array.from({ length: 9 }, (_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div
                            className="w-6 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t"
                            style={{ height: `${30 + Math.random() * 80}px` }}
                          ></div>
                          <span className="text-xs text-gray-500">{17 + i}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-3 gap-6">
                {/* Check Table */}
                <Card className="col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Check Table</CardTitle>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-4 text-sm text-gray-500 font-medium">
                        <span>NAME</span>
                        <span>PROGRESS</span>
                        <span>QUANTITY</span>
                        <span>DATE</span>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="font-medium">Horizon UI PRO</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={17.5} className="flex-1" />
                            <span className="text-sm">17.5%</span>
                          </div>
                          <span>2,458</span>
                          <span className="text-sm text-gray-500">24.Jan.2021</span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Horizon UI Free</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={10.8} className="flex-1" />
                            <span className="text-sm">10.8%</span>
                          </div>
                          <span>1,485</span>
                          <span className="text-sm text-gray-500">12.Jun.2021</span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="font-medium">Weekly Update</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={21.3} className="flex-1" />
                            <span className="text-sm">21.3%</span>
                          </div>
                          <span>1,024</span>
                          <span className="text-sm text-gray-500">5.Jan.2021</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Daily Traffic */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Daily Traffic</span>
                        <span className="text-sm text-green-600">+2.45%</span>
                      </div>
                      <p className="text-2xl font-bold">2,579</p>
                      <p className="text-sm text-gray-500">Visitors</p>

                      <div className="mt-4 flex items-end gap-1 h-16">
                        {Array.from({ length: 12 }, (_, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-400 to-purple-500 rounded-t"
                            style={{ height: `${20 + Math.random() * 40}px` }}
                          ></div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pie Chart */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="text-sm">Your Pie Chart</CardTitle>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-gray-500">Monthly</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="relative h-32 w-32 mx-auto">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"></div>
                        <div className="absolute inset-2 rounded-full bg-white"></div>
                        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
