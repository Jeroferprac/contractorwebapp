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
import { Loader2 } from "lucide-react";

interface SalesByCustomer {
  customer: string;
  total: number;
}

export const SalesByCustomerChart = () => {
  const [data, setData] = React.useState<SalesByCustomer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

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
    <Card className="bg-white dark:bg-[#232946] rounded-2xl shadow-md p-8 border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-blue-700 dark:text-blue-300">Sales by Customer</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[150px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              margin={{ left: 10, right: 10, top: 30, bottom: 30 }}
              barCategoryGap={30}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="#4f8cff" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} vertical={false} />
              <XAxis
                dataKey="customer"
                stroke="#334155"
                fontSize={15}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#334155", fontWeight: 600 }}
                className="dark:!text-blue-200"
                interval={0}
                angle={-10}
                textAnchor="end"
                height={30}
              />
              <YAxis
                stroke="#334155"
                fontSize={14}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#334155" }}
                className="dark:!text-blue-200"
                tickFormatter={(value: number) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
              <Tooltip content={CustomTooltip} cursor={{ fill: "#e0e7ff", opacity: 0.1 }} />
              <Bar dataKey="total" fill={barFill} barSize={32} radius={[14, 14, 0, 0]} >
                <LabelList
                  dataKey="total"
                  position="top"
                  style={{ fontWeight: 700, fontSize: 16 }}
                  fill="#2563eb"
                  className="dark:!fill-blue-200"
                  formatter={(v: number) => `₹${v.toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
