'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import { useEffect, useState } from 'react'
import { getInventoryTransactions } from '@/lib/inventory'
import { parseISO, format } from 'date-fns'
import { Button } from '@/components/ui/button'

export default function StockReportChart() {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Stock Report</CardTitle>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Stock In</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Stock Out</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" className="h-8 text-sm px-3" onClick={handleExport}>Export</Button>
        </div>
        <div className="h-64 sm:h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">Loading...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-red-500">{error}</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="stockIn" fill="#3B82F6" />
                <Bar dataKey="stockOut" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 