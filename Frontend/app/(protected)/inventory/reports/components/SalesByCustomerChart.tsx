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
import { Button } from "@/components/ui/button";
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

function exportToCSV(data: any[], customers: string[]) {
  if (!data.length) return;
  const header = ["Date", ...customers.flatMap(c => [c + " Revenue", c + " Quantity"])].join(",");
  const rows = data.map(row => {
    return [
      row.date,
      ...customers.flatMap(c => [row[c]?.revenue ?? 0, row[c]?.quantity ?? 0])
    ].join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sales_by_customer.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SalesByCustomerChart() {
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
        const result = await getSalesDetailsByPeriod(start, end);
        sales = Array.isArray(result) ? result : [];
      } catch {
        sales = [];
      }
      // Build a map: { date: { customer1: {revenue, quantity}, ... } }
      const dateMap: Record<string, any> = {};
      const customerSet = new Set<string>();
      sales.forEach((sale) => {
        const date = sale.sale_date;
        if (!dateMap[date]) dateMap[date] = { date };
        const revenue = Number(sale.total_amount);
        const quantity = sale.items.reduce((sum, item) => sum + Number(item.quantity), 0);
        const customer = sale.customer_name;
        if (!dateMap[date][customer]) dateMap[date][customer] = { revenue: 0, quantity: 0 };
        dateMap[date][customer].revenue += revenue;
        dateMap[date][customer].quantity += quantity;
        customerSet.add(customer);
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
          <CardTitle>Sales by Customer</CardTitle>
          <CardDescription>
            Area chart: each color is a customer, hover for full breakdown. Export to CSV available.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => exportToCSV(chartData, customers)}>
          Export CSV
        </Button>
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
                    {customers.map((customer, idx) => {
                      const entry = props.payload.find((e: any) => e.name === customer);
                      if (!entry) return null;
                      return (
                        <div key={customer} className="mb-1">
                          <div style={{ color: entry.color, fontWeight: 600 }}>{customer}</div>
                          <div>Revenue: ₹{entry.payload[customer]?.revenue?.toLocaleString() ?? 0}</div>
                          <div>Quantity: {entry.payload[customer]?.quantity ?? 0}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
            />
            {customers.map((customer, idx) => (
              <Area
                key={customer}
                dataKey={customer + ".revenue"}
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