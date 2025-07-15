import { useEffect, useState } from "react";
import { getSalesSummary } from "@/lib/inventory";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface SalesSummaryCustomer {
  customer_name: string;
  total_sales: number;
  order_count: number;
  last_order_date: string;
}

export default function SalesByCustomerReport() {
  const [data, setData] = useState<SalesSummaryCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSalesSummary()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setError("Failed to load sales summary"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Summary by Customer</CardTitle>
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
                  <th className="text-left p-2">Customer Name</th>
                  <th className="text-right p-2">Total Sales</th>
                  <th className="text-right p-2"># Orders</th>
                  <th className="text-right p-2">Last Order Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{row.customer_name}</td>
                    <td className="p-2 text-right">₹{row.total_sales?.toLocaleString()}</td>
                    <td className="p-2 text-right">{row.order_count}</td>
                    <td className="p-2 text-right">{row.last_order_date}</td>
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