"use client"

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getPurchaseSummaryByProduct } from "@/lib/inventory";

interface PurchaseSummaryProduct {
  product_id: string;
  product_name: string;
  total_quantity_purchased: number;
  total_amount: number;
}

export function PurchaseByProductChart() {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<string[]>([]);
  const [activeChart, setActiveChart] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      let data: PurchaseSummaryProduct[] = [];
      try {
        data = await getPurchaseSummaryByProduct();
      } catch {
        data = [];
      }
      // Sort by total_amount and pick top 2-3 products for clarity
      const topProducts = data
        .sort((a, b) => b.total_amount - a.total_amount)
        .slice(0, 2);
      setProducts(topProducts.map((p) => p.product_name));
      // For demo, fake date-wise data (since API is summary, not time series)
      // In real use, you would fetch or build date-wise data
      const today = new Date();
      const chartRows: any[] = [];
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (13 - i));
        const row: any = { date: date.toISOString().slice(0, 10) };
        topProducts.forEach((p, idx) => {
          // Spread the total over 14 days for demo
          row[p.product_name] = Math.round((p.total_amount / 14) * (0.7 + 0.6 * Math.random()));
        });
        chartRows.push(row);
      }
      setChartData(chartRows);
      setActiveChart(topProducts[0]?.product_name || "");
      setLoading(false);
    })();
  }, []);

  const total = React.useMemo(
    () =>
      products.reduce((acc, p) => {
        acc[p] = chartData.reduce((sum, row) => sum + (row[p] || 0), 0);
        return acc;
      }, {} as Record<string, number>),
    [chartData, products]
  );

  if (loading) return <div className="h-64 flex items-center justify-center">Loading chart...</div>;
  if (!chartData.length) return <div className="h-64 flex items-center justify-center text-gray-400">No data</div>;

  const chartConfig: ChartConfig = products.reduce((acc, p, idx) => {
    acc[p] = {
      label: p,
      color: `var(--chart-${idx + 1})`,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Purchase by Product</CardTitle>
          <CardDescription>
            Interactive line chart: select a product to view its purchase trend (demo data).
          </CardDescription>
        </div>
        <div className="flex">
          {products.map((product, idx) => (
            <button
              key={product}
              data-active={activeChart === product}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(product)}
            >
              <span className="text-muted-foreground text-xs">
                {product}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {total[product]?.toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12 }}
            >
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
                      {products.map((product, idx) => {
                        const entry = props.payload.find((e: any) => e.name === product);
                        if (!entry) return null;
                        return (
                          <div key={product} className="mb-1">
                            <div style={{ color: entry.color, fontWeight: 600 }}>{product}</div>
                            <div>Amount: ₹{entry.value?.toLocaleString() ?? 0}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={`var(--chart-${products.indexOf(activeChart) + 1})`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 