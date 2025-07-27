import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react";

const performanceData = [
  { name: "Apple", early: 75, onTime: 15, late: 10 },
  { name: "Samsung", early: 65, onTime: 25, late: 10 },
  { name: "Asus", early: 55, onTime: 20, late: 25 },
  { name: "Xiaomi", early: 70, onTime: 15, late: 15 },
  { name: "Logitech", early: 60, onTime: 30, late: 10 },
]

export function SupplierPerformanceChart() {
  return (
    <Card className="rounded-2xl border border-white/20 dark:border-blue-200/20 shadow-2xl bg-white/70 dark:bg-[#232946]/40 ring-1 ring-inset ring-white/10 dark:ring-blue-200/10 backdrop-blur-lg p-8 max-w-full h-full min-h-[320px]">
      <CardContent className="pt-2 px-2">
        <div className="flex items-center gap-3 mb-3 dark:text-blue-100">
          <TrendingUp className="w-7 h-7 text-primary dark:text-blue-400" />
          <span className="text-xl font-extrabold text-primary dark:text-blue-100 tracking-tight">Supplier Performance Report (Top 5 Suppliers)</span>
        </div>
        <div className="space-y-3">
          {performanceData.map((supplier, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">{supplier.name}</span>
                <div className="flex space-x-4 text-xs text-muted-foreground">
                  <span className="text-base font-bold text-primary">{supplier.early}%</span>
                  <span className="text-base font-bold text-primary">{supplier.onTime}%</span>
                  <span className="text-base font-bold text-primary">{supplier.late}%</span>
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
        <div className="flex items-center mt-4 gap-4 text-sm font-bold text-muted-foreground dark:text-blue-100">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-xs font-bold text-blue-500">Early</span>
          <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-xs font-bold text-yellow-400">On Time</span>
          <span className="px-3 py-1 rounded-full bg-pink-500/20 text-xs font-bold text-pink-500">Late</span>
        </div>
      </CardContent>
    </Card>
  )
}
