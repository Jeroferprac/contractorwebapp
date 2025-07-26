"use client";

import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { useTheme } from "next-themes";

interface SalesByCustomer {
  customer: string;
  total: number;
}

export const SalesByCustomerChart = () => {
  const [data, setData] = React.useState<SalesByCustomer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const { theme } = useTheme();

  React.useEffect(() => {
    // DEMO: Use sample data
    const sampleData = [
      { customer: "Acme Corp", total: 120000 },
      { customer: "Omega Pvt", total: 110000 },
      { customer: "Lambda Works", total: 105000 },
      { customer: "Sigma Group", total: 95000 },
      { customer: "Beta Ltd", total: 90000 },
      { customer: "Pi Holdings", total: 85000 },
    ];
    setData(sampleData);
    setLoading(false);
  }, []);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];
    return (
      <div className="rounded-lg border bg-white dark:bg-[#232946] p-3 shadow-lg text-gray-900 dark:text-white font-semibold">
        <div className="text-base font-bold">{label}</div>
        <div className="text-sm text-blue-700 dark:text-blue-200 font-semibold">
          Sales: ₹{item.value?.toLocaleString()}
        </div>
      </div>
    );
  };

  // Gradient for bars
  const barFill = "url(#barGradient)";

  return (
    <Card className="rounded-2xl border border-white/20 dark:border-blue-200/20 shadow-2xl bg-white/70 dark:bg-[#232946]/40 ring-1 ring-inset ring-white/10 dark:ring-blue-200/10 backdrop-blur-lg p-4">
      <CardHeader className="flex flex-row items-center gap-3 mb-1">
        <Users className="w-7 h-7 text-primary dark:text-blue-300" />
        <CardTitle className="text-xl font-extrabold text-primary dark:text-blue-100 tracking-tight">Sales by Customer</CardTitle>
      </CardHeader>
      <CardContent className="pt-2 px-2">
        {loading ? (
          <div className="flex items-center justify-center h-[150px] text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ left: 10, right: 10, top: 32, bottom: 24 }}
              barCategoryGap={30}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#4f8cff" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={theme === 'dark' ? 0.15 : 0.3} vertical={false} />
              <XAxis
                dataKey="customer"
                stroke={theme === 'dark' ? '#c7d2fe' : '#334155'}
                fontSize={15}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#c7d2fe' : '#cbd5e1', strokeWidth: 2 }}
                tick={{ fill: theme === 'dark' ? '#c7d2fe' : 'var(--muted-foreground)', fontWeight: 600, fontSize: 15 }}
                interval={0}
                height={30}
                className="text-sm font-medium text-muted-foreground dark:text-blue-100"
              />
              <YAxis
                stroke={theme === 'dark' ? '#c7d2fe' : '#334155'}
                fontSize={14}
                tickLine={false}
                axisLine={{ stroke: theme === 'dark' ? '#c7d2fe' : '#cbd5e1', strokeWidth: 2 }}
                tick={{ fill: theme === 'dark' ? '#c7d2fe' : 'var(--muted-foreground)', fontWeight: 600, fontSize: 15, textAnchor: 'end', dx: -8 }}
                tickFormatter={(value: number) =>
                  ` 9${Number(value).toLocaleString("en-IN")}`
                }
                width={80}
                className="text-sm font-medium text-muted-foreground dark:text-blue-100"
              />
              <Tooltip content={CustomTooltip} cursor={{ fill: "#e0e7ff", opacity: 0.1 }} />
              <Bar dataKey="total" fill={barFill} barSize={32} radius={[14, 14, 0, 0]} >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <LabelList
                  dataKey="total"
                  position="top"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  content={({ x, y, value }: any) => (
                    <foreignObject x={x - 20} y={y - 28} width={40} height={22} style={{ overflow: 'visible' }}>
                      <div className="flex items-center justify-center">
                        <span className="px-1.5 py-0.5 rounded-full bg-primary/90 dark:bg-blue-900/30 text-white text-xs font-bold shadow border border-white/10 dark:border-blue-200/10">
                          ₹{Number(value).toLocaleString()}
                        </span>
                      </div>
                    </foreignObject>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
