import { useEffect, useState } from "react";
import { getPurchaseSummaryBySupplier } from "@/lib/inventory";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";

interface PurchaseSummarySupplier {
  supplier_name: string;
  total_po: number;
  total_amount: number;
}

export default function PurchaseBySupplierChart() {
  const [data, setData] = useState<PurchaseSummarySupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPurchaseSummaryBySupplier()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center">Loading chart...</div>;
  if (!data.length) return <div className="h-48 flex items-center justify-center text-gray-400">No data</div>;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0 w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
          barCategoryGap={16}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="supplier_name" type="category" width={120} />
          <Tooltip
            formatter={(value: unknown, name: string) =>
              name === "total_amount"
                ? [
                    `₹${Number(value).toLocaleString()}`,
                    "Total Amount"
                  ]
                : [value, name === "total_po" ? "Total POs" : name]
            }
            labelFormatter={(label: string) => `Supplier: ${label}`}
          />
          <Bar dataKey="total_amount" fill="#6366f1" radius={[0, 8, 8, 0]}>
            <LabelList dataKey="total_po" position="insideLeft" fill="#fff" formatter={(v: number) => `POs: ${v}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 