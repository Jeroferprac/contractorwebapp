"use client"

import { useEffect, useState } from "react"
import { getSuppliers, deleteSupplier } from "@/lib/inventory"
import type { Supplier } from "@/types/inventory"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Search, Download, Zap, Grid3X3 } from "lucide-react"
import { SuppliersTable } from "./components/SuppliersTable"

const PAGE_SIZE = 8

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  // Example activities array matching the reference design
  const [activities] = useState([
    {
      action: "System added",
      item: "Apple Inc",
      time: "about 23 hours ago",
      avatar: "S",
    },
    {
      action: "System added",
      item: "Samsung Electronics",
      time: "12 days ago",
      avatar: "S",
    },
    {
      action: "System added",
      item: "Microsoft Corp",
      time: "7 days ago",
      avatar: "S",
    },
  ])

  useEffect(() => {
    getSuppliers()
      .then((res) => setSuppliers(Array.isArray(res) ? res : (res?.data ?? [])))
      .finally(() => setLoading(false))
  }, [])

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.phone?.toLowerCase().includes(search.toLowerCase()) ||
      s.contact_person?.toLowerCase().includes(search.toLowerCase()),
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredSuppliers.length / PAGE_SIZE)
  const paginatedSuppliers = filteredSuppliers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Edit and delete handlers (implement modals as needed)
  const handleEditSupplier = (supplier: Supplier) => {
    // setEditSupplier(supplier);
    // setModalOpen(true);
  }

  const handleDeleteSupplier = async (supplier: Supplier) => {
    await deleteSupplier(supplier.id!)
    setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id))
  }

  // Stats calculations
  const totalSuppliers = suppliers.length
  const activeSuppliers = suppliers.filter((s) => s.status === "active").length
  const recentSuppliers = suppliers.filter((s) => {
    const createdDate = new Date(s.created_at || "")
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return createdDate > weekAgo
  }).length

  return (
    <DashboardLayout title="Suppliers">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Suppliers</h1>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Manage your supplier relationships and contacts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              <Zap className="w-4 h-4 mr-2" />
              Quick Actions
            </Button>
            <Button
              variant="outline"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-2.5 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-950/20 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-6 overflow-x-auto pb-2">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 whitespace-nowrap">
                <Avatar className="h-8 w-8 bg-blue-500 text-white flex-shrink-0 ring-2 ring-blue-100 dark:ring-blue-900/50">
                  <AvatarFallback className="bg-blue-500 text-white text-sm font-semibold">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{activity.action}</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold mx-1">{activity.item}</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-blue-950/50 dark:via-blue-950/30 dark:to-blue-900/50 border-blue-200/60 dark:border-blue-800/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                    All Suppliers
                  </p>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-blue-900 dark:text-blue-100 leading-none">{totalSuppliers}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 17l9.2-9.2M17 17V7H7"
                          />
                        </svg>
                        6.7%
                      </span>
                      <span className="text-blue-600/70 dark:text-blue-400/70">vs last month</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/5 rounded-full -translate-y-16 translate-x-16"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:via-emerald-950/30 dark:to-emerald-900/50 border-emerald-200/60 dark:border-emerald-800/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                    Active Suppliers
                  </p>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-100 leading-none">
                      {activeSuppliers}
                    </p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 17l9.2-9.2M17 17V7H7"
                          />
                        </svg>
                        3.9%
                      </span>
                      <span className="text-emerald-600/70 dark:text-emerald-400/70">vs last month</span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-emerald-500 dark:bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full -translate-y-16 translate-x-16"></div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-red-50 via-red-50 to-red-100 dark:from-red-950/50 dark:via-red-950/30 dark:to-red-900/50 border-red-200/60 dark:border-red-800/40 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
                    New This Week
                  </p>
                  <div className="space-y-1">
                    <p className="text-4xl font-bold text-red-900 dark:text-red-100 leading-none">{recentSuppliers}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-medium">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 13l-5 5m0 0l-5-5m5 5V6"
                          />
                        </svg>
                        Needs attention
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-500 dark:bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 dark:bg-red-400/5 rounded-full -translate-y-16 translate-x-16"></div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3">
            <select className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
              <option>All Collection</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
              <option>All</option>
              <option>Verified</option>
              <option>Unverified</option>
            </select>
            <select className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors">
              <option>All</option>
              <option>Recent</option>
              <option>Oldest</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-2 font-medium"
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Columns
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 font-medium shadow-sm hover:shadow-md transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </div>

        {/* Table */}
        <SuppliersTable
          suppliersData={paginatedSuppliers}
          onEdit={handleEditSupplier}
          onDelete={handleDeleteSupplier}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredSuppliers.length)} of{" "}
              {filteredSuppliers.length} suppliers
            </div>
            <nav className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  className={`w-8 h-8 p-0 font-medium ${
                    page === i + 1
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
