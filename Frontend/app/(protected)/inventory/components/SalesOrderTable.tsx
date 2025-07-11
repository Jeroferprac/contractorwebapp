'use client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SalesOrderTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales Order</CardTitle>
        <Badge variant="secondary">Last 7 Days</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Channel</th>
                <th className="text-center p-3">Draft</th>
                <th className="text-center p-3">Confirmed</th>
                <th className="text-center p-3">Packed</th>
                <th className="text-center p-3">Shipped</th>
                <th className="text-center p-3">Invoiced</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-3 font-medium">Direct Sales</td>
                <td className="text-center p-3">2</td>
                <td className="text-center p-3">32</td>
                <td className="text-center p-3">42</td>
                <td className="text-center p-3">23</td>
                <td className="text-center p-3">7</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Wholesale</td>
                <td className="text-center p-3">0</td>
                <td className="text-center p-3">41</td>
                <td className="text-center p-3">33</td>
                <td className="text-center p-3">11</td>
                <td className="text-center p-3">14</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Retail</td>
                <td className="text-center p-3">2</td>
                <td className="text-center p-3">12</td>
                <td className="text-center p-3">25</td>
                <td className="text-center p-3">16</td>
                <td className="text-center p-3">21</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
} 