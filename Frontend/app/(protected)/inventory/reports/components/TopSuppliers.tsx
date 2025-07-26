import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function TopSuppliersChart() {
  // Sample data for pie chart
  const pieData = [
    { name: 'Apple', value: 35, color: '#2563eb' },
    { name: 'Samsung', value: 25, color: '#10b981' },
    { name: 'Huawei', value: 20, color: '#a21caf' },
    { name: 'Others', value: 20, color: '#06b6d4' },
  ];

  return (
    <Card className="rounded-2xl border border-white/20 dark:border-blue-200/20 shadow-2xl bg-white/70 dark:bg-[#232946]/40 ring-1 ring-inset ring-white/10 dark:ring-blue-200/10 backdrop-blur-lg p-8 max-w-full h-full min-h-[320px] flex flex-col items-center justify-center">
      <CardContent className="pt-2 px-2 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-3 dark:text-blue-100">
          <Users className="w-7 h-7 text-primary dark:text-blue-400" />
          <span className="text-xl font-extrabold text-primary dark:text-blue-100 tracking-tight">Top Suppliers</span>
        </div>
        <div className="relative flex items-center justify-center mb-3" style={{ minHeight: 180 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                isAnimationActive={false}
                stroke="none"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ active, payload, coordinate }: any) => {
                  if (!active || !payload || !payload.length || !coordinate) return null;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const item = (payload[0] as any)?.payload;
                  const offset = 40;
                  const x = coordinate.x + (coordinate.x > 80 ? offset : -offset); // 80 = cx
                  const y = coordinate.y;
                  return (
                    <div
                      className="rounded-lg px-2 py-1 shadow-md bg-popover border border-popover text-popover-foreground backdrop-blur-md"
                      style={{
                        minWidth: 0,
                        maxWidth: 70,
                        textAlign: 'center',
                        pointerEvents: 'none',
                        position: 'absolute',
                        left: x,
                        top: y,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="flex flex-col items-center">
                        <span
                          className="w-2 h-2 rounded-full mb-0.5"
                          style={{ backgroundColor: item.color, display: 'inline-block' }}
                        />
                        <span className="font-bold text-xs text-popover-foreground">{item.name}</span>
                        <span className="font-bold text-xs" style={{ color: item.color }}>
                          {item.value}%
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              {/* Drop shadow for the pie chart */}
              <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
                </filter>
              </defs>
            </PieChart>
          </ResponsiveContainer>
          {/* Professional center value */}
          <div className="absolute left-1/2 top-1/2 z-10" style={{ transform: 'translate(-50%, -50%)' }}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/60 via-blue-100/30 to-blue-200/20 dark:from-[#232946]/60 dark:via-blue-900/20 dark:to-blue-900/5 shadow-xl flex flex-col items-center justify-center ring-4 ring-blue-200/30 dark:ring-blue-900/30 backdrop-blur-md">
              <span className="text-xs text-muted-foreground dark:text-blue-200 font-semibold tracking-wide flex items-center justify-center w-full mb-1" style={{ letterSpacing: '0.05em' }}>Total</span>
              <span className="text-xl font-extrabold text-primary dark:text-blue-100 drop-shadow-lg tracking-tight flex items-center justify-center w-full">100</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center mt-4 space-y-2 w-full dark:text-blue-100">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-3 w-full justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="px-3 py-1 rounded-full bg-white/20 dark:bg-blue-900/30 text-sm font-bold text-primary dark:text-blue-100 shadow-sm border border-white/10 dark:border-blue-200/10">{item.name}</span>
              </div>
              <span className="text-sm font-bold text-primary dark:text-blue-100">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
