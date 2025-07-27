"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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

const sampleData = [
  { product_name: "iPhone 17", total_quantity_purchased: 10, total_amount: 800000 },
  { product_name: "Dell Inspiron", total_quantity_purchased: 10, total_amount: 521000 },
];

export default function PurchaseByProductChart() {
  // For demo, always use sampleData
  const displayData = sampleData;

  return (
    <Card className="bg-white dark:bg-[#232946] rounded-2xl shadow-md p-6 border-0 h-[350px] flex flex-col min-w-0">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300">Purchase by Product</CardTitle>
        <CardDescription className="text-base text-gray-400 dark:text-gray-300">
          Analysis of purchase cost by product.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={displayData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
            barCategoryGap={24}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="product_name"
              type="category"
              width={120}
              tick={{ fill: "#64748b", fontSize: 14, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#232946",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
              }}
              formatter={(value, name) =>
                name === "total_amount"
                  ? [`₹${Number(value).toLocaleString()}`, "Total Amount"]
                  : [value, name === "total_quantity_purchased" ? "Total Purchased" : name]
              }
              labelFormatter={(label) => `Product: ${label}`}
            />
            <Bar dataKey="total_amount" fill="#6366f1" radius={[0, 8, 8, 0]} maxBarSize={32}>
              <LabelList
                dataKey="total_quantity_purchased"
                position="insideLeft"
                fill="#fff"
                formatter={(v) => `Qty: ${v}`}
                style={{ fontWeight: 600, fontSize: 13 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
