import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSalesSummaryByProduct } from "@/lib/inventory";

interface SalesSummaryProduct {
  product_id: string;
  product_name: string;
  total_quantity_sold: number;
  total_revenue: number;
}

export default function SalesByProductReport() {
  const [data, setData] = useState<SalesSummaryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSalesSummaryByProduct()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setError("Failed to load sales summary"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Summary by Product</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : !data.length ? (
          <></>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Product Name</th>
                  <th className="text-right p-2">Total Quantity Sold</th>
                  <th className="text-right p-2">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.product_id}>
                    <td className="p-2">{row.product_name}</td>
                    <td className="p-2 text-right">{row.total_quantity_sold}</td>
                    <td className="p-2 text-right">₹{row.total_revenue?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 