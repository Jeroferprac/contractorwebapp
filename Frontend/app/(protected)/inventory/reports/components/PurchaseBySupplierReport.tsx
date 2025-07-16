import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getPurchaseSummaryBySupplier } from "@/lib/inventory";

interface PurchaseSummarySupplier {
  supplier_name: string;
  total_po: number;
  total_amount: number;
}

export default function PurchaseBySupplierReport() {
  const [data, setData] = useState<PurchaseSummarySupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getPurchaseSummaryBySupplier()
      .then((res) => setData(Array.isArray(res) ? res : []))
      .catch(() => setError("Failed to load purchase summary"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Summary by Supplier</CardTitle>
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
                  <th className="text-left p-2">Supplier Name</th>
                  <th className="text-right p-2">Total POs</th>
                  <th className="text-right p-2">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{row.supplier_name}</td>
                    <td className="p-2 text-right">{row.total_po}</td>
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