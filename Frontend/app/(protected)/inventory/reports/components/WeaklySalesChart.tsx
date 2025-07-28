import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { parseISO, isSameWeek, getDay, getHours, startOfWeek, endOfWeek, addWeeks, format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Flame } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = [9, 10, 11, 12, 13, 14, 15, 16];

type Sale = { sale_date?: string; saleDate?: string };

export function WeeklySalesChart() {
  const [salesData, setSalesData] = useState<number[][]>(hours.map(() => Array(7).fill(0)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [tooltip, setTooltip] = useState<{ x: number; y: number; day: string; hour: string; value: number } | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // DEMO: Use visually rich sample data for a full heatmap
    const sampleSales: Sale[] = [];
    for (let d = 0; d < 7; d++) {
      for (let h = 0; h < hours.length; h++) {
        const count = Math.floor(Math.random() * 4);
        for (let c = 0; c < count; c++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + d);
          date.setHours(hours[h]);
          sampleSales.push({ sale_date: date.toISOString().slice(0, 13) + ":00:00" });
        }
      }
    }
    setAllSales(sampleSales);
    setLoading(false);
  }, [weekStart]);

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

  // Professional blue gradient color scale for bubbles
  const getCellColor = (intensity: number) => {
    if (intensity === 0) return "bg-transparent border-transparent";
    if (intensity === 1) return "bg-blue-300 border-blue-300";
    if (intensity === 2) return "bg-blue-400 border-blue-400";
    if (intensity === 3) return "bg-blue-600 border-blue-600";
    if (intensity >= 4) return "bg-blue-900 border-blue-900";
    return "bg-blue-100 border-blue-100";
  };

  return (
    <Card className="rounded-2xl border border-white/20 dark:border-blue-200/20 shadow-2xl bg-white/70 dark:bg-[#232946]/40 ring-1 ring-inset ring-white/10 dark:ring-blue-200/10 backdrop-blur-lg p-8 w-full">
      <CardContent className="pb-4">
        <div className="flex flex-row items-center justify-between mb-6 w-full dark:text-blue-100">
          <div className="flex items-center gap-3">
            <Flame className="w-7 h-7 text-primary dark:text-orange-400" />
            <span className="text-xl font-extrabold text-primary dark:text-blue-100 tracking-tight">Weekly Sales</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrevWeek}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <span className="text-base font-semibold text-blue-700 dark:text-blue-100 min-w-[140px] text-center">{weekLabel}</span>
            <Button
              onClick={handleNextWeek}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="w-full flex justify-center mt-8">
            <div className="min-w-[600px]">
              {/* Days header */}
              <div className="grid grid-cols-8 gap-x-8 gap-y-1 mb-1 w-full">
                <div></div>
                {days.map(day => (
                  <div
                    key={day}
                    className="text-left font-bold text-sm uppercase tracking-wide text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {/* Calendar grid */}
              {salesData.map((row, hourIdx) => (
                <div key={hourIdx} className="grid grid-cols-8 gap-x-8 gap-y-1 items-center mb-0 w-full">
                  <div className="text-right pr-2 font-medium text-gray-400 dark:text-blue-100 text-sm w-14">
                    {`${hours[hourIdx].toString().padStart(2, '0')}:00`}
                  </div>
                  {row.map((intensity, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
                        ${intensity === 0
                          ? 'bg-blue-100 border border-blue-100 text-blue-200'
                          : getCellColor(intensity) + ' shadow-md hover:brightness-110 hover:ring-2 hover:ring-blue-400/40 text-white dark:text-blue-100'} animate-fade-in`}
                      title={`Sales: ${intensity}`}
                      onMouseEnter={() => {
                        setTooltip({
                          x: 0,
                          y: 0,
                          day: days[dayIdx],
                          hour: `${hours[hourIdx].toString().padStart(2, "0")}:00`,
                          value: intensity,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {intensity > 0 ? (
                        <span className="font-bold text-base drop-shadow-sm animate-fade-in">{intensity}</span>
                      ) : null}
                      {/* Tooltip */}
                      {tooltip && tooltip.day === days[dayIdx] && tooltip.hour === `${hours[hourIdx].toString().padStart(2, "0")}:00` && tooltip.value === intensity && intensity > 0 && (
                        <div
                          className={`absolute z-20 left-1/2 -translate-x-1/2 ${hourIdx < 2 ? 'top-12' : '-top-12'} bg-white dark:bg-[#232946] text-gray-900 dark:text-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold whitespace-nowrap border border-gray-200 dark:border-blue-900 pointer-events-none animate-fade-in`}
                        >
                          <div>{tooltip.day}, {tooltip.hour}</div>
                          <div>Sales: <span className="font-bold text-primary dark:text-blue-200">{intensity}</span></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              {/* Legend */}
              <div className="flex items-center justify-center mt-8 gap-4 text-xs font-semibold text-blue-700 dark:text-blue-100 border border-white/10 dark:border-blue-200/10 rounded-xl py-1 animate-fade-in bg-white/10 dark:bg-blue-900/10">
                <span className="px-2 py-0.5 rounded-full bg-white/20 dark:bg-blue-900/20 text-xs font-semibold text-muted-foreground dark:text-blue-100">Less</span>
                <div className="flex space-x-1">
                  {[0, 1, 2, 3, 4].map(intensity => (
                    <div
                      key={intensity}
                      className={`w-4 h-4 rounded-full ${getCellColor(intensity)} animate-fade-in`}
                    />
                  ))}
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 dark:bg-blue-900/20 text-xs font-semibold text-muted-foreground dark:text-blue-100">More</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
