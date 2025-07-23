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
    (async () => {
      const today = new Date();
      const last90 = new Date();
      last90.setDate(today.getDate() - 90);
      const start = last90.toISOString().slice(0, 10);
      const end = today.toISOString().slice(0, 10);
      let sales: SaleDetail[] = [];
      try {
        sales = await getSalesDetailsByPeriod({ start_date: start, end_date: end });
      } catch {
        sales = [];
      }
      // Build a map of productId to productName
      const productIdToName: Record<string, string> = {};
      sales.forEach((sale) => {
        sale.items.forEach((item) => {
          if (item.product_id && item.product_name) {
            productIdToName[item.product_id] = item.product_name;
          }
        });
      });
      // Build a map: { date: { productName: {revenue, quantity}, ... }, date: string }
      const dateMap: Record<string, ChartRow> = {};
      const productSet = new Set<string>();
      sales.forEach((sale) => {
        const date = sale.sale_date;
        if (!dateMap[date]) dateMap[date] = { date };
        sale.items.forEach((item) => {
          const product = productIdToName[item.product_id] || item.product_id;
          if (!dateMap[date][product]) dateMap[date][product] = { revenue: 0, quantity: 0 };
          (dateMap[date][product] as { revenue: number; quantity: number }).revenue += Number(item.line_total);
          (dateMap[date][product] as { revenue: number; quantity: number }).quantity += Number(item.quantity);
          productSet.add(product);
        });
      });
      setChartData(Object.values(dateMap));
      setProducts(Array.from(productSet));
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
          <CardTitle>Sales by Product</CardTitle>
          <CardDescription>
            Area chart: each color is a product, hover for full breakdown. Export to CSV available.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => exportToCSV(chartData, products)}>
          Export CSV
        </Button>
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
              content={(
                props: {
                  active?: boolean;
                  payload?: Array<{
                    name: string;
                    color: string;
                    payload: ChartRow;
                  }>;
                  label?: string;
                }
              ) => {
                if (!props || !props.active || !props.payload) return null;
                return (
                  <div className="bg-white rounded shadow p-2 text-xs">
                    <div className="font-semibold mb-1">{props.label}</div>
                    {products.map((product) => {
                      const entry = props.payload?.find((e) => e.name === product);
                      if (!entry) return null;
                      return (
                        <div key={product} className="mb-1">
                          <div style={{ color: entry.color, fontWeight: 600 }}>{product}</div>
                          <div>
                            Revenue: ₹
                            {typeof entry.payload[product] !== "string"
                              ? (entry.payload[product] as { revenue: number }).revenue?.toLocaleString() ?? 0
                              : 0}
                          </div>
                          <div>
                            Quantity:{" "}
                            {typeof entry.payload[product] !== "string"
                              ? (entry.payload[product] as { quantity: number }).quantity ?? 0
                              : 0}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              }}
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