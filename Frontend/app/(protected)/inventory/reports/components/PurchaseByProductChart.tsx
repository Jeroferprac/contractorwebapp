"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getPurchaseSummaryByProduct } from "@/lib/inventory";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

interface PurchaseSummaryProduct {
  product_name: string;
  total_quantity_purchased: number;
  total_amount: number;
}

export default function PurchaseByProductChart() {
  const [data, setData] = useState<PurchaseSummaryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPurchaseSummaryByProduct()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, []);

  // Limit the number of bars to fit the card nicely (e.g., top 6 products)
  const displayData = data.slice(0, 6);

  return (
    <Card className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0 h-[350px] flex flex-col min-w-0">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300">Purchase by Product</CardTitle>
        <CardDescription className="text-base text-gray-400 dark:text-gray-300">
          Analysis of purchase cost by product.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        {loading ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">Loading chart...</div>
        ) : !displayData.length ? (
          <div className="h-48 flex items-center justify-center text-gray-400">No data</div>
        ) : (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={displayData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
              barCategoryGap={16}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="product_name" type="category" width={120} />
              <Tooltip
                formatter={(value: unknown, name: string) =>
                  name === "total_amount"
                    ? [`₹${Number(value).toLocaleString()}`, "Total Amount"]
                    : [value, name === "total_quantity_purchased" ? "Total Purchased" : name]
                }
                labelFormatter={(label: string) => `Product: ${label}`}
              />
              <Bar dataKey="total_amount" fill="#6366f1" radius={[0, 8, 8, 0]}>
                <LabelList
                  dataKey="total_quantity_purchased"
                  position="insideLeft"
                  fill="#fff"
                  formatter={(v: number) => `Qty: ${v}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
