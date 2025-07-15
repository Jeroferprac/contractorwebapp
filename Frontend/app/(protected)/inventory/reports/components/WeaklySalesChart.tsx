import { useEffect, useState } from "react";
import { getSales } from "@/lib/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseISO, isSameWeek, getDay, getHours, startOfWeek, endOfWeek, addWeeks, format } from "date-fns";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16];

const getIntensityColor = (intensity: number) => {
  const colors = [
    "bg-cyan-50", // 0 - lightest
    "bg-cyan-100", // 1
    "bg-cyan-200", // 2
    "bg-cyan-400", // 3
    "bg-cyan-600", // 4 - darkest
  ];
  return colors[Math.min(intensity, colors.length - 1)] || colors[0];
};

export function WeeklySalesChart() {
  const [salesData, setSalesData] = useState<number[][]>(hours.map(() => Array(7).fill(0)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allSales, setAllSales] = useState<any[]>([]);
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
    // Build 2D array: hours x days (Mon-Sun)
    const grid = hours.map(() => Array(7).fill(0));
    allSales.forEach((sale: any) => {
      // Always use sale_date (or saleDate) for grouping
      // Professional: If sale_date is date-only (YYYY-MM-DD), default to 09:00 for heatmap
      let dateStr = sale.sale_date || sale.saleDate;
      let date: Date;
      if (dateStr && dateStr.length === 10) {
        // Date-only, append T09:00:00
        date = parseISO(dateStr + 'T09:00:00');
      } else {
        date = parseISO(dateStr);
      }
      if (isSameWeek(date, weekStart, { weekStartsOn: 1 })) {
        let dayIdx = getDay(date) - 1;
        if (dayIdx < 0) dayIdx = 6; // Sunday to last index
        const hour = getHours(date);
        const hourIdx = hours.indexOf(hour);
        if (hourIdx !== -1) {
          grid[hourIdx][dayIdx]++;
        }
      }
    });
    setSalesData(grid);
  }, [allSales, weekStart]);

  const handlePrevWeek = () => {
    setWeekStart((prev) => addWeeks(prev, -1));
  };
  const handleNextWeek = () => {
    setWeekStart((prev) => addWeeks(prev, 1));
  };

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const weekLabel = `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold">Weekly Sales</CardTitle>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevWeek} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Prev</button>
          <span className="text-sm text-gray-500 min-w-[120px] text-center">{weekLabel}</span>
          <button onClick={handleNextWeek} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200">Next</button>
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
            <div></div> {/* Empty cell for hour labels */}
            {days.map((day, index) => (
              <div key={index} className="text-xs text-gray-500 text-center font-medium">
                {day}
              </div>
            ))}
          </div>
            {/* Calendar grid - Rectangular cells for each hour x day */}
          {salesData.map((row, hourIdx) => (
            <div key={hourIdx} className="grid grid-cols-8 gap-1 min-w-[600px]">
              {/* Hour label */}
                <div className="text-xs text-gray-500 font-medium flex items-center w-14">{`${hours[hourIdx].toString().padStart(2, '0')}:00`}</div>
              {/* Day cells */}
              {row.map((intensity, dayIdx) => (
                <div
                  key={dayIdx}
                    className={`w-10 h-5 rounded flex items-center justify-center ${getIntensityColor(intensity)} hover:ring-2 hover:ring-cyan-300 cursor-pointer transition-all duration-200`}
                    title={`Sales: ${intensity}`}
                  >
                    {intensity > 0 ? <span className="text-xs text-gray-700">{intensity}</span> : null}
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
              <div key={intensity} className={`w-4 h-4 rounded ${getIntensityColor(intensity)}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
