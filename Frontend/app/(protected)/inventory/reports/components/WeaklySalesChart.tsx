import { useEffect, useState } from "react";
import { getSales } from "@/lib/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseISO, isSameWeek, getDay, getHours, startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { BarChart3 } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16];

type Sale = { sale_date?: string; saleDate?: string };

export function WeeklySalesChart() {
  const [salesData, setSalesData] = useState<number[][]>(hours.map(() => Array(7).fill(0)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    setLoading(true);
    setError(null);
    getSales()
      .then((data) => {
        setAllSales(data);
      })
      .catch(() => setError("Failed to load sales data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const grid = hours.map(() => Array(7).fill(0));
    allSales.forEach((sale) => {
      const dateStr = sale.sale_date || sale.saleDate;
      let date: Date;
      if (dateStr && dateStr.length === 10) {
        date = parseISO(dateStr + 'T09:00:00');
      } else {
        date = parseISO(dateStr ?? "");
      }
      if (isSameWeek(date, weekStart, { weekStartsOn: 1 })) {
        let dayIdx = getDay(date) - 1;
        if (dayIdx < 0) dayIdx = 6;
        const hour = getHours(date);
        const hourIdx = hours.indexOf(hour);
        if (hourIdx !== -1) {
          grid[hourIdx][dayIdx]++;
        }
      }
    });
    setSalesData(grid);
  }, [allSales, weekStart]);

  const handlePrevWeek = () => setWeekStart((prev: Date) => addWeeks(prev, -1));
  const handleNextWeek = () => setWeekStart((prev: Date) => addWeeks(prev, 1));

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  // Modern color scale for cells (light blue to deep blue)
  const getCellColor = (intensity: number) => {
    if (intensity === 0) return "bg-[#e0e7ff]";
    if (intensity < 2) return "bg-[#a5b4fc]";
    if (intensity < 4) return "bg-[#6366f1]";
    return "bg-[#2563eb]";
  };

  return (
    <Card className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0">
      <CardHeader className="flex flex-row items-center justify-between pb-3 gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2563eb]" />
          <CardTitle className="text-base font-semibold text-[#2563eb]">Weekly Sales</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="px-3 py-1 rounded-lg bg-[#e0e7ff] hover:bg-[#a5b4fc] text-[#2563eb] font-semibold shadow-sm transition-all duration-200"
          >
            Prev
          </button>
          <span className="text-sm text-gray-500 min-w-[120px] text-center font-medium">{weekLabel}</span>
          <button
            onClick={handleNextWeek}
            className="px-3 py-1 rounded-lg bg-[#e0e7ff] hover:bg-[#a5b4fc] text-[#2563eb] font-semibold shadow-sm transition-all duration-200"
          >
            Next
          </button>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            {/* Days header */}
            <div className="grid grid-cols-8 gap-1 mb-2 min-w-[600px]">
              <div></div>
              {days.map((day, index) => (
                <div key={index} className="text-xs text-gray-500 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            {salesData.map((row, hourIdx) => (
              <div key={hourIdx} className="grid grid-cols-8 gap-1 min-w-[600px]">
                <div className="text-xs text-gray-500 font-medium flex items-center w-14">
                  {`${hours[hourIdx].toString().padStart(2, "0")}:00`}
                </div>
                {row.map((intensity, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${getCellColor(intensity)} hover:ring-2 hover:ring-[#2563eb] cursor-pointer shadow-sm transition-all duration-200`}
                    title={`Sales: ${intensity}`}
                  >
                    {intensity > 0 ? (
                      <span
                        className={`text-xs font-semibold ${
                          intensity < 4 ? "text-[#2563eb]" : "text-white"
                        }`}
                      >
                        {intensity}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((intensity) => (
              <div
                key={intensity}
                className={`w-4 h-4 rounded-full shadow-sm border border-[#e0e7ff] ${getCellColor(intensity)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
