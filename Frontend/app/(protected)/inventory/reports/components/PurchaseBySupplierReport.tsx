import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PurchaseSummarySupplier {
  supplier_name: string;
  total_po: number;
  total_amount: number;
}

export default function PurchaseBySupplierReport() {
  const [data, setData] = useState<PurchaseSummarySupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const sampleData = [
      { supplier_name: "Apple Inc.", total_po: 12, total_amount: 480000 },
      { supplier_name: "Samsung", total_po: 8, total_amount: 320000 },
    ];
    setData(sampleData);
    setLoading(false);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Summary by Supplier</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="p-4">Loading...</div>
        ) : !data.length ? (
          <div className="p-4 text-gray-500">No data available</div>
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