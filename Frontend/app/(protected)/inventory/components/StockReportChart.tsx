'use client'
import { Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { getInventoryTransactions } from '@/lib/inventory'
import { parseISO, format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Card } from '@/components/ui/card'

export default function StockReportChart() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allTransactions, setAllTransactions] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    setError(null)
    getInventoryTransactions()
      .then((transactions) => {
        setAllTransactions(transactions)
      })
      .catch(() => setError('Failed to load stock data'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    // Group by month and sum inbound/outbound
    const grouped: Record<string, { stockIn: number; stockOut: number }> = {}
    allTransactions.forEach((txn: any) => {
      const date = parseISO(txn.created_at)
      const month = format(date, 'MMM')
      if (!grouped[month]) grouped[month] = { stockIn: 0, stockOut: 0 }
      if (txn.transaction_type === 'inbound') {
        grouped[month].stockIn += Number(txn.quantity)
      } else if (txn.transaction_type === 'outbound') {
        grouped[month].stockOut += Number(txn.quantity)
      }
    })
    // Convert to array and sort by month order
    const monthOrder = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const data = monthOrder.map(month => grouped[month] ? { month, ...grouped[month] } : { month, stockIn: 0, stockOut: 0 })
    setChartData(data)
  }, [allTransactions])

  const handleExport = () => {
    const rows = [
      ['Month', 'Stock In', 'Stock Out'],
      ...chartData.map(row => [row.month, row.stockIn, row.stockOut])
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stock_report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Custom tooltip for professional look
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
  return (
        <div className="rounded-xl bg-white dark:bg-[#23263A] shadow-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
          <div className="font-semibold text-xs text-gray-500 dark:text-gray-300 mb-1">{label}</div>
          {payload.map((entry: any, idx: number) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-sm mb-0.5">
              <span className={`inline-block w-3 h-3 rounded-full`} style={{ background: entry.color }} />
              <span className="capitalize text-gray-700 dark:text-gray-100 font-medium">{entry.name}:</span>
              <span className="font-bold text-gray-900 dark:text-white">{entry.value}</span>
          </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Do not filter out months; display all months on the X-axis
  const displayedChartData = chartData

  return (
    <Card className="mt-6 relative bg-white dark:bg-[#181C32] rounded-2xl shadow-lg px-2 py-2 sm:px-4 sm:py-4 xl:px-6 xl:py-4 flex flex-col justify-between w-full max-w-2xl h-72 sm:h-96 xl:h-[28rem] min-w-[0] overflow-hidden">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 sm:pt-4 px-1 sm:px-2 pb-2 gap-2">
        <span className="text-base sm:text-lg font-bold tracking-widest uppercase text-gray-700 dark:text-gray-100">Stock Report</span>
        <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1 text-xs font-medium text-blue-500"><span className="w-3 h-3 rounded-full bg-[#2563eb] inline-block" /> Stock In</span>
          <span className="flex items-center gap-1 text-xs font-medium text-purple-500"><span className="w-3 h-3 rounded-full bg-[#7c3aed] inline-block" /> Stock Out</span>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#23263A] rounded-xl">
          {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-200 text-base">Loading...</div>
          ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500 dark:text-red-300 text-base">{error}</div>
        ) : displayedChartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-200 text-base">No stock data available for this period.</div>
        ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={displayedChartData} barGap={10} margin={{ top: 8, right: 8, left: 8, bottom: isMobile ? 32 : 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#4B5563]" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={{
                fill: '#22223b',
                fontWeight: 700,
                fontSize: isMobile ? 9 : 12,
                className: 'dark:fill-white',
                angle: isMobile ? -40 : 0,
                dy: isMobile ? 16 : 6
              }}
              height={isMobile ? 44 : 32}
            />
            <YAxis axisLine={false} tickLine={false}
              tick={{
                fill: '#22223b',
                fontWeight: 700,
                fontSize: 12,
                className: 'dark:fill-white'
              }}
            />
            <RechartsTooltip content={<CustomTooltip />} wrapperClassName="dark:bg-[#23263A] dark:border-[#4B5563] dark:text-white" />
            <Bar dataKey="stockIn" name="Stock In" fill="#2563eb" maxBarSize={12} />
            <Bar dataKey="stockOut" name="Stock Out" fill="#7c3aed" maxBarSize={12} />
            </BarChart>
          </ResponsiveContainer>
          )}
        </div>
    </Card>
  )
} 