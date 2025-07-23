
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { getPurchaseSummaryByProduct } from "@/lib/inventory";

interface PurchaseSummaryProduct {
  product_id: string;
  product_name: string;
  total_quantity_purchased: number;
  total_amount: number;
}

export function PurchaseByProductReport() {
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
    <Card className="rounded-2xl border-none shadow-md bg-white/80 dark:bg-slate-900/80 backdrop-blur h-full">
      <CardHeader>
        <CardTitle className="text-blue-700 dark:text-blue-300">
          Purchase Summary by Product
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : !data.length ? (
          <div className="p-4 text-center text-gray-500">No data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-3 font-semibold">Product Name</th>
                  <th className="text-right p-3 font-semibold">Total Quantity Purchased</th>
                  <th className="text-right p-3 font-semibold">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.product_id}
                    className="even:bg-muted/40 hover:bg-muted/60 transition-colors"
                  >
                    <td className="p-3 max-w-xs truncate">{row.product_name}</td>
                    <td className="p-3 text-right">{row.total_quantity_purchased}</td>
                    <td className="p-3 text-right">
                      ₹{row.total_amount?.toLocaleString()}
                    </td>
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