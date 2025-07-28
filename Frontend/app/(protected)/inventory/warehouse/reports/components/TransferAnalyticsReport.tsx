// "use client"

// import { useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { TrendingUp, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react"
// import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
// import type { WarehouseTransfer, Warehouse } from "@/types/warehouse"

// interface TransferAnalyticsReportProps {
//   transfers: WarehouseTransfer[]
//   warehouses: Warehouse[]
// }

// const STATUS_COLORS = {
//   pending: '#f59e0b',
//   in_transit: '#3b82f6',
//   completed: '#10b981'
// }

// const STATUS_ICONS = {
//   pending: Clock,
//   in_transit: ArrowRight,
//   completed: CheckCircle
// }

// export function TransferAnalyticsReport({ transfers, warehouses }: TransferAnalyticsReportProps) {
//   const transferData = useMemo(() => {
//     // Get warehouse names
//     const getWarehouseName = (id: string) => 
//       warehouses.find(w => w.id === id)?.name || id

//     // Status distribution
//     const statusCounts = transfers.reduce((acc, transfer) => {
//       acc[transfer.status] = (acc[transfer.status] || 0) + 1
//       return acc
//     }, {} as Record<string, number>)

//     // Transfer volume by warehouse
//     const warehouseTransfers = transfers.reduce((acc, transfer) => {
//       const fromWarehouse = getWarehouseName(transfer.from_warehouse_id)
//       const toWarehouse = getWarehouseName(transfer.to_warehouse_id)
      
//       acc[fromWarehouse] = (acc[fromWarehouse] || 0) + 1
//       acc[toWarehouse] = (acc[toWarehouse] || 0) + 1
//       return acc
//     }, {} as Record<string, number>)

//     // Transfer trends over time
//     const transferTrends = transfers.reduce((acc, transfer) => {
//       const date = transfer.transfer_date || transfer.created_at?.split('T')[0] || 'Unknown'
//       acc[date] = (acc[date] || 0) + 1
//       return acc
//     }, {} as Record<string, number>)

//     // Inter-warehouse transfer patterns
//     const transferPatterns = transfers.map(transfer => ({
//       from: getWarehouseName(transfer.from_warehouse_id),
//       to: getWarehouseName(transfer.to_warehouse_id),
//       quantity: transfer.items?.reduce((sum, item) => sum + parseFloat(item.quantity || '0'), 0) || 0,
//       status: transfer.status
//     }))

//     return {
//       statusCounts,
//       warehouseTransfers,
//       transferTrends,
//       transferPatterns,
//       totalTransfers: transfers.length,
//       completedTransfers: statusCounts.completed || 0,
//       completionRate: transfers.length > 0 ? ((statusCounts.completed || 0) / transfers.length) * 100 : 0
//     }
//   }, [transfers, warehouses])

//   const statusData = useMemo(() => {
//     return Object.entries(transferData.statusCounts).map(([status, count]) => ({
//       name: status.charAt(0).toUpperCase() + status.slice(1),
//       value: count,
//       color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] || '#6b7280'
//     }))
//   }, [transferData.statusCounts])

//   const warehouseData = useMemo(() => {
//     return Object.entries(transferData.warehouseTransfers).map(([warehouse, count]) => ({
//       warehouse,
//       transfers: count
//     }))
//   }, [transferData.warehouseTransfers])

//   const trendData = useMemo(() => {
//     return Object.entries(transferData.transferTrends)
//       .sort(([a], [b]) => a.localeCompare(b))
//       .map(([date, count]) => ({
//         date,
//         transfers: count
//       }))
//   }, [transferData.transferTrends])

//   return (
//     <div className="space-y-6">
//       {/* Transfer Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Total Transfers</p>
//                 <p className="text-2xl font-bold text-gray-900">{transferData.totalTransfers}</p>
//               </div>
//               <div className="p-3 bg-blue-100 rounded-xl">
//                 <TrendingUp className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Completion Rate</p>
//                 <p className="text-2xl font-bold text-gray-900">{transferData.completionRate.toFixed(1)}%</p>
//               </div>
//               <div className="p-3 bg-green-100 rounded-xl">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">Pending</p>
//                 <p className="text-2xl font-bold text-gray-900">{transferData.statusCounts.pending || 0}</p>
//               </div>
//               <div className="p-3 bg-orange-100 rounded-xl">
//                 <Clock className="w-6 h-6 text-orange-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-0 shadow-sm bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-600">In Transit</p>
//                 <p className="text-2xl font-bold text-gray-900">{transferData.statusCounts.in_transit || 0}</p>
//               </div>
//               <div className="p-3 bg-cyan-100 rounded-xl">
//                 <ArrowRight className="w-6 h-6 text-cyan-600" />
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Transfer Status Distribution */}
//       <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500">
//         <CardHeader className="border-b border-gray-100 py-5">
//           <CardTitle className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//             Transfer Status Distribution
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Pie Chart */}
//             <div className="h-80">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={statusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={120}
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {statusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip 
//                     content={({ active, payload }: { active?: boolean; payload?: any[] }) => {
//                       if (active && payload && payload.length) {
//                         return (
//                           <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4">
//                             <div className="font-semibold text-gray-900 mb-2">{payload[0].name}</div>
//                             <div className="text-sm text-gray-600">
//                               Count: {payload[0].value}
//                             </div>
//                           </div>
//                         )
//                       }
//                       return null
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Status Details */}
//             <div className="space-y-4">
//               {statusData.map((status) => {
//                 const Icon = STATUS_ICONS[status.name.toLowerCase() as keyof typeof STATUS_ICONS] || AlertCircle
//                 const percentage = transferData.totalTransfers > 0 ? (status.value / transferData.totalTransfers) * 100 : 0
                
//                 return (
//                   <div key={status.name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
//                     <div className="p-2 rounded-lg" style={{ backgroundColor: `${status.color}20` }}>
//                       <Icon className="w-5 h-5" style={{ color: status.color }} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="font-medium text-gray-900">{status.name}</span>
//                         <span className="text-sm font-semibold text-gray-600">{status.value}</span>
//                       </div>
//                       <Progress value={percentage} className="h-2" />
//                       <span className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</span>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Transfer Trends */}
//       <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500">
//         <CardHeader className="border-b border-gray-100 py-5">
//           <CardTitle className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
//             Transfer Trends Over Time
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={trendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis 
//                   dataKey="date" 
//                   tick={{ fontSize: 12 }}
//                   tickFormatter={(value: any) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                 />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip 
//                   content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
//                     if (active && payload && payload.length) {
//                       return (
//                         <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4">
//                           <div className="font-semibold text-gray-900 mb-2">
//                             {new Date(label).toLocaleDateString('en-US', { 
//                               month: 'long', 
//                               day: 'numeric', 
//                               year: 'numeric' 
//                             })}
//                           </div>
//                           <div className="text-sm text-gray-600">
//                             Transfers: {payload[0].value}
//                           </div>
//                         </div>
//                       )
//                     }
//                     return null
//                   }}
//                 />
//                 <Line 
//                   type="monotone" 
//                   dataKey="transfers" 
//                   stroke="#10b981" 
//                   strokeWidth={3}
//                   dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
//                   activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Warehouse Transfer Activity */}
//       <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500">
//         <CardHeader className="border-b border-gray-100 py-5">
//           <CardTitle className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
//             Warehouse Transfer Activity
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={warehouseData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis 
//                   dataKey="warehouse" 
//                   tick={{ fontSize: 12 }}
//                   angle={-45}
//                   textAnchor="end"
//                   height={80}
//                 />
//                 <YAxis tick={{ fontSize: 12 }} />
//                 <Tooltip 
//                   content={({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
//                     if (active && payload && payload.length) {
//                       return (
//                         <div className="bg-white/95 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl p-4">
//                           <div className="font-semibold text-gray-900 mb-2">{label}</div>
//                           <div className="text-sm text-gray-600">
//                             Transfers: {payload[0].value}
//                           </div>
//                         </div>
//                       )
//                     }
//                     return null
//                   }}
//                 />
//                 <Bar dataKey="transfers" fill="#6366f1" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Recent Transfer Patterns */}
//       <Card className="border-0 shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
//         <CardHeader className="border-b border-gray-100 py-5">
//           <CardTitle className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
//             Recent Transfer Patterns
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6">
//           <div className="space-y-3">
//             {transferData.transferPatterns.slice(0, 10).map((pattern, index) => (
//               <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <ArrowRight className="w-4 h-4 text-blue-600" />
//                   </div>
//                   <div>
//                     <div className="font-medium text-gray-900">
//                       {pattern.from} → {pattern.to}
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Quantity: {pattern.quantity.toLocaleString()}
//                     </div>
//                   </div>
//                 </div>
//                 <Badge 
//                   variant="outline" 
//                   className="text-xs"
//                   style={{ 
//                     borderColor: STATUS_COLORS[pattern.status as keyof typeof STATUS_COLORS],
//                     color: STATUS_COLORS[pattern.status as keyof typeof STATUS_COLORS]
//                   }}
//                 >
//                   {pattern.status}
//                 </Badge>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// } 