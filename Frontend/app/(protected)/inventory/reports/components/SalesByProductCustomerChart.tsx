"use client"

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSalesDetailsByPeriod } from "@/lib/inventory";

interface SaleItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface SaleDetail {
  customer_name: string;
  sale_date: string;
  status: string;
  total_amount: number;
  items: SaleItem[];
}

export default function SalesByProductCustomerChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const today = new Date();
      const last90 = new Date();
      last90.setDate(today.getDate() - 90);
      const start = last90.toISOString().slice(0, 10);
      const end = today.toISOString().slice(0, 10);
      let sales: SaleDetail[] = [];
      try {
        sales = await getSalesDetailsByPeriod(start, end);
      } catch {
        sales = [];
      }
      // Build a map: { date: { customer1: value, customer2: value, ... } }
      const dateMap: Record<string, any> = {};
      const customerSet = new Set<string>();
      sales.forEach((sale) => {
        const date = sale.sale_date;
        if (!dateMap[date]) dateMap[date] = { date };
        sale.items.forEach((item) => {
          const customer = sale.customer_name;
          dateMap[date][customer] = (dateMap[date][customer] || 0) + Number(item.line_total);
          customerSet.add(customer);
        });
      });
      setChartData(Object.values(dateMap));
      setCustomers(Array.from(customerSet));
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  if (!chartData.length) return <div className="h-64 flex items-center justify-center text-gray-400">No data</div>;

  const colors = [
    "#06b6d4", "#6366f1", "#f59e42", "#10b981", "#f43f5e", "#a21caf", "#eab308", "#0ea5e9", "#f472b6"
  ];

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Sales by Product & Customer</CardTitle>
          <CardDescription>
            Stacked area chart: each color is a customer, hover for full breakdown.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {customers.map((customer, idx) => (
                <linearGradient key={customer} id={`fill${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value: string) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <Tooltip
              content={(props: any) => {
                if (!props.active || !props.payload) return null;
                return (
                  <div className="bg-white rounded shadow p-2 text-xs">
                    <div className="font-semibold mb-1">{props.label}</div>
                    {props.payload.map((entry: any, idx: number) => (
                      <div key={idx} className="flex justify-between gap-2">
                        <span style={{ color: entry.color }}>{entry.name}</span>
                        <span>₹{Number(entry.value).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {customers.map((customer, idx) => (
              <Area
                key={customer}
                dataKey={customer}
                type="natural"
                fill={`url(#fill${idx})`}
                stroke={colors[idx % colors.length]}
                stackId="a"
                name={customer}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 