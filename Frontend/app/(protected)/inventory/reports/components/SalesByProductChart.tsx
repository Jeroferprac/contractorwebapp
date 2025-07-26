"use client"

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { BarChart3 } from "lucide-react";

// Define a type for a chart row (date is a string, all other keys are product names)
type ChartRow = {
  date: string;
  [product: string]: { revenue: number; quantity: number } | string;
};

export default function SalesByProductChart() {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // DEMO: Use sample data for area chart
    const sampleChartData = [
      { date: "Jul 10", "iPhone 17": { revenue: 800000, quantity: 10 }, "Dell Inspiron": { revenue: 521000, quantity: 10 } },
      { date: "Jul 11", "iPhone 17": { revenue: 400000, quantity: 5 }, "Dell Inspiron": { revenue: 300000, quantity: 5 } },
      { date: "Jul 12", "iPhone 17": { revenue: 600000, quantity: 8 }, "Dell Inspiron": { revenue: 200000, quantity: 3 } },
      { date: "Jul 13", "iPhone 17": { revenue: 200000, quantity: 2 }, "Dell Inspiron": { revenue: 400000, quantity: 7 } },
      { date: "Jul 14", "iPhone 17": { revenue: 500000, quantity: 6 }, "Dell Inspiron": { revenue: 350000, quantity: 4 } },
    ];
    setChartData(sampleChartData);
    setProducts(["iPhone 17", "Dell Inspiron"]);
    setLoading(false);
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  if (!chartData.length) return <></>;

  const colors = [
    "#06b6d4", "#6366f1", "#f59e42", "#10b981", "#f43f5e", "#a21caf", "#eab308", "#0ea5e9", "#f472b6"
  ];

  return (
    <Card className="w-full mt-0 rounded-2xl border border-white/20 dark:border-blue-200/20 shadow-2xl bg-white/70 dark:bg-[#232946]/40 ring-1 ring-inset ring-white/10 dark:ring-blue-200/10 backdrop-blur-lg p-4">
      <CardContent className="px-2">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-7 h-7 text-primary dark:text-blue-400" />
          <span className="text-xl font-extrabold text-primary dark:text-blue-100 tracking-tight">Sales by Product</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {products.map((product, idx) => (
                <linearGradient key={product} id={`fill${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="#334155" strokeOpacity={theme === 'dark' ? 0.15 : 0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: theme === 'dark' ? '#c7d2fe' : 'var(--muted-foreground)', fontSize: 13 }}
              className="text-sm font-medium text-muted-foreground dark:text-blue-100"
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <YAxis
              tick={{ fill: theme === 'dark' ? '#c7d2fe' : 'var(--muted-foreground)', fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              className="text-sm font-medium text-muted-foreground dark:text-blue-100"
            />
            <Tooltip
              contentStyle={{ background: theme === "dark" ? "#232946" : "#fff", color: theme === "dark" ? "#fff" : "#232946", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.10)" }}
              labelStyle={{ color: theme === "dark" ? "#fff" : "#232946", fontWeight: 700, fontSize: 15 }}
              itemStyle={{ color: theme === "dark" ? "#fff" : "#232946", fontWeight: 600, fontSize: 14 }}
            />
            {products.map((product, idx) => (
              <Area
                key={product}
                dataKey={`${product}.revenue`}
                type="natural"
                fill={`url(#fill${idx})`}
                stroke={colors[idx % colors.length]}
                stackId="a"
                name={product}
                isAnimationActive={true}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
        {/* Custom Legend */}
        <div className="flex flex-wrap gap-4 mt-6 items-center justify-center">
          {products.map((product, idx) => (
            <div key={product} className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
              <span className="px-3 py-1 rounded-full bg-white/20 dark:bg-blue-900/30 text-sm font-bold text-primary dark:text-blue-100 shadow-sm border border-white/10 dark:border-blue-200/10">{product}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 