import { useEffect, useState } from "react";
import { getSalesSummaryByProduct } from "@/lib/inventory";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface SalesSummaryProduct {
  product_id: string;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
}

export default function SalesByProductBarChart() {
  const [data, setData] = useState<SalesSummaryProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sampleData = [
      { product_id: "1", product_name: "iPhone 17", total_quantity_sold: 10, total_revenue: 800000 },
      { product_id: "2", product_name: "Dell Inspiron", total_quantity_sold: 10, total_revenue: 521000 },
    ];
    setData(sampleData);
    setLoading(false);
  }, []);

  if (loading) return <div className="h-48 flex items-center justify-center">Loading chart...</div>;
  if (!data.length) return <></>;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0 w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="product_name" angle={-20} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total_revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 