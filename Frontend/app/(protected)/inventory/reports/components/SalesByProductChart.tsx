"use client"

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSalesDetailsByPeriod } from "@/lib/inventory";
import { Download } from "lucide-react";

interface SaleItem {
  product_id: string;
  product_name?: string;
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

// Define a type for a chart row (date is a string, all other keys are product names)
type ChartRow = {
  date: string;
  [product: string]: { revenue: number; quantity: number } | string;
};

function exportToCSV(data: ChartRow[], products: string[]) {
  if (!data.length) return;
  const header = ["Date", ...products.flatMap(p => [p + " Revenue", p + " Quantity"])].join(",");
  const rows = data.map(row => {
    return [
      row.date,
      ...products.flatMap(p => [
        (row[p] && typeof row[p] !== "string" ? (row[p] as { revenue: number }).revenue : 0),
        (row[p] && typeof row[p] !== "string" ? (row[p] as { quantity: number }).quantity : 0)
      ])
    ].join(",");
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sales_by_product.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function SalesByProductChart() {
  const [chartData, setChartData] = useState<ChartRow[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Card className="bg-white dark:bg-[#232946] rounded-2xl shadow-md p-6 border-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-blue-700 dark:text-blue-300">Sales by Product</CardTitle>
          <CardDescription className="text-base text-gray-400 dark:text-gray-300">
            Area chart: each color is a product, hover for full breakdown. Export to CSV available.
          </CardDescription>
        </div>
        <button
          onClick={() => exportToCSV(chartData, products)}
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {products.map((product, idx) => (
                <linearGradient key={product} id={`fill${idx}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} stroke="#334155" strokeOpacity={0.3} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "#64748b", fontSize: 13 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              style={{ color: "#64748b" }}
              className="dark:!text-blue-200"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
              style={{ color: "#64748b" }}
              className="dark:!text-blue-200"
            />
            <Tooltip
              contentStyle={{ background: "#232946", color: "#fff", border: "none", borderRadius: 8, fontSize: 14 }}
              labelStyle={{ color: "#fff" }}
              itemStyle={{ color: "#fff" }}
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
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 