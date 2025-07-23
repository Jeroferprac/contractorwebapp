"use client";

import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  
  CardHeader,
  
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { getSalesDetailsByPeriod } from "@/lib/inventory";

interface ChartRow {
  date: string;
  [product: string]: number | string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    color: string;
    value: number;
  }>;
  label?: string;
}

export function PurchaseByProductChart() {
  const [chartData, setChartData] = React.useState<ChartRow[]>([]);
  const [products, setProducts] = React.useState<string[]>([]);
  const [activeChart, setActiveChart] = React.useState<string>("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const today = new Date();
    const last90 = new Date();
    last90.setDate(today.getDate() - 90);
    const start = last90.toISOString().slice(0, 10);
    const end = today.toISOString().slice(0, 10);

    getSalesDetailsByPeriod({ start_date: start, end_date: end })
      .then((data) => {
        setChartData(data);
        if (data.length > 0) {
          const keys = Object.keys(data[0]).filter((key) => key !== "date");
          setProducts(keys);
          if (keys.length > 0) setActiveChart(keys[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const total = React.useMemo(
    () =>
      products.reduce((acc, p) => {
        acc[p] = chartData.reduce((sum, row) => sum + (row[p] as number || 0), 0);
        return acc;
      }, {} as Record<string, number>),
    [chartData, products]
  );

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center">
        Loading chart...
      </div>
    );
  if (!chartData.length)
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data
      </div>
    );

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
        
        <div className="flex">
          {products.map((product) => (
            <button
              key={product}
              data-active={activeChart === product}
              className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
              onClick={() => setActiveChart(product)}
            >
              <span className="text-muted-foreground text-xs">{product}</span>
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
            <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
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
                content={(props: TooltipProps) => {
                  if (!props.active || !props.payload) return null;
                  return (
                    <div className="bg-white rounded shadow p-2 text-xs">
                      <div className="font-semibold mb-1">{props.label}</div>
                      {products.map((product) => {
                        const entry = props.payload!.find(
                          (e) => e.name === product
                        );
                        if (!entry) return null;
                        return (
                          <div key={product} className="mb-1">
                            <div
                              style={{ color: entry.color, fontWeight: 600 }}
                            >
                              {product}
                            </div>
                            <div>
                              Amount: ₹{entry.value?.toLocaleString() ?? 0}
                            </div>
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
                stroke={`var(--chart-${
                  products.indexOf(activeChart) + 1
                })`}
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
