'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'

const chartData = [
  { month: 'Jan', stockIn: 400, stockOut: 240 },
  { month: 'Feb', stockIn: 300, stockOut: 139 },
  { month: 'Mar', stockIn: 200, stockOut: 980 },
  { month: 'Apr', stockIn: 278, stockOut: 390 },
  { month: 'May', stockIn: 189, stockOut: 480 },
  { month: 'Jun', stockIn: 239, stockOut: 380 },
  { month: 'Jul', stockIn: 349, stockOut: 430 },
]

export default function StockReportChart() {
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
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Bar dataKey="stockIn" fill="#3B82F6" />
              <Bar dataKey="stockOut" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
} 