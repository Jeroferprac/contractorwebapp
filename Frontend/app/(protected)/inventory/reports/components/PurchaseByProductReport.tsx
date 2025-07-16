import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPurchaseSummaryByProduct } from "@/lib/inventory";

interface PurchaseSummaryProduct {
  product_id: string;
  product_name: string;
  total_quantity_purchased: number;
  total_amount: number;
}

export default function PurchaseByProductReport() {
  const [data, setData] = useState<PurchaseSummaryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPurchaseSummaryByProduct()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setError("Failed to load purchase summary"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Summary by Product</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : !data.length ? (
          <div className="p-4 text-gray-500">No data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left p-2">Product Name</th>
                  <th className="text-right p-2">Total Quantity Purchased</th>
                  <th className="text-right p-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={row.product_id}>
                    <td className="p-2">{row.product_name}</td>
                    <td className="p-2 text-right">{row.total_quantity_purchased}</td>
                    <td className="p-2 text-right">₹{row.total_amount?.toLocaleString()}</td>
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