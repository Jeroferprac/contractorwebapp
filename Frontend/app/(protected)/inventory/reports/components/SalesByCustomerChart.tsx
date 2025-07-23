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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getSalesDetailsByPeriod } from "@/lib/inventory";

interface SalesByCustomer {
  customer: string;
  total: number;
}

interface SaleDetail {
  customer_name: string;
  total_amount: number;
}

export const SalesByCustomerChart = () => {
  const [data, setData] = React.useState<SalesByCustomer[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      const today = new Date();
      const last90 = new Date();
      last90.setDate(today.getDate() - 90);
      const start = last90.toISOString().slice(0, 10);
      const end = today.toISOString().slice(0, 10);

      try {
        const sales: SaleDetail[] = await getSalesDetailsByPeriod({ start_date: start, end_date: end });
        // Aggregate sales by customer
        const customerTotals: Record<string, number> = {};
        sales.forEach((sale) => {
          const customer = sale.customer_name;
          customerTotals[customer] = (customerTotals[customer] || 0) + Number(sale.total_amount);
        });
        setData(
          Object.entries(customerTotals).map(([customer, total]) => ({
            customer,
            total,
          }))
        );
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];

    return (
      <div className="rounded-md border bg-background p-2 shadow-sm">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">
          Sales: ₹{item.value?.toLocaleString()}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium text-blue-700 dark:text-blue-300">Sales by Customer</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[150px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis
                dataKey="customer"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
              <Tooltip content={CustomTooltip} />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="total" fill="#5E60CE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
