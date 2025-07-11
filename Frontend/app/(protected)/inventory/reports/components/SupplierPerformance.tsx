import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const performanceData = [
  { name: "Apple", early: 75, onTime: 15, late: 10 },
  { name: "Samsung", early: 65, onTime: 25, late: 10 },
  { name: "Asus", early: 55, onTime: 20, late: 25 },
  { name: "Xiaomi", early: 70, onTime: 15, late: 15 },
  { name: "Logitech", early: 60, onTime: 30, late: 10 },
]

export function SupplierPerformanceChart() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Supplier Performance Report (Top 5 Suppliers)</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-3">
          {performanceData.map((supplier, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{supplier.name}</span>
                <div className="flex space-x-4 text-xs text-gray-500">
                  <span>{supplier.early}%</span>
                  <span>{supplier.onTime}%</span>
                  <span>{supplier.late}%</span>
                </div>
              </div>

              <div className="flex h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-blue-500 transition-all duration-500" style={{ width: `${supplier.early}%` }} />
                <div className="bg-yellow-400 transition-all duration-500" style={{ width: `${supplier.onTime}%` }} />
                <div className="bg-pink-500 transition-all duration-500" style={{ width: `${supplier.late}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded mr-1.5"></div>
            <span className="text-gray-600">Early</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded mr-1.5"></div>
            <span className="text-gray-600">On Time</span>
          </div>
          <div className="flex items-center">
            <div className="w-2.5 h-2.5 bg-pink-500 rounded mr-1.5"></div>
            <span className="text-gray-600">Late</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
