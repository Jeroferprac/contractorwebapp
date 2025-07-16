"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { getInventoryTransactions } from "@/lib/inventory";
import { getProducts } from '@/lib/inventory';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Transaction {
  id: string;
  product_id: string;
  transaction_type: string;
  quantity: string;
  reference_type: string;
  reference_id: string | null;
  notes?: string;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
}

const TRANSACTION_TYPES = ["all", "purchase", "sale", "adjustment"];

export default function InventoryTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [viewTxn, setViewTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getInventoryTransactions(),
      getProducts()
    ])
      .then(([txns, prods]) => {
        setTransactions(txns);
        setProducts(prods);
      })
      .catch(() => setError("Failed to load transactions or products."))
      .finally(() => setLoading(false));
  }, []);

  function getProductName(id: string) {
    const prod = products.find(p => p.id === id);
    return prod ? prod.name : id;
  }

  function getReferenceUrl(type: string, id: string | null) {
    if (!id) return null;
    if (type === 'sale') return `/inventory/sales/${id}`;
    if (type === 'product') return `/inventory/products/${id}`;
    if (type === 'adjustment') return `/inventory/adjustments/${id}`;
    // Add more as needed
    return null;
  }

  // Filtering logic
  const filtered = transactions.filter((txn) => {
    if (typeFilter !== "all" && txn.transaction_type !== typeFilter) return false;
    if (search && !(
      txn.reference_type?.toLowerCase().includes(search.toLowerCase()) ||
      txn.notes?.toLowerCase().includes(search.toLowerCase())
    )) return false;
    if (dateFrom && new Date(txn.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(txn.created_at) > new Date(dateTo)) return false;
    return true;
  });

  // Export to CSV
  function handleExport() {
    const rows = [
      ["Date", "Type", "Reference", "Quantity", "Notes"],
      ...filtered.map(txn => [
        new Date(txn.created_at).toLocaleString(),
        txn.transaction_type,
        txn.reference_type,
        txn.quantity,
        txn.notes || ""
      ])
    ];
    const csv = rows.map(r => r.map(String).map(x => `"${x.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout title="Inventory Transactions">
      <div className="max-w-5xl mx-auto p-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transactions</CardTitle>
            <div className="flex gap-2 items-center">
              <Badge variant="secondary">All Time</Badge>
              <Button size="sm" variant="outline" className="text-sm font-medium" onClick={handleExport}>Export CSV</Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4 items-center">
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium mb-1">Type</label>
                <select
                  className="border rounded-md px-3 h-10 w-full text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={typeFilter}
                  onChange={e => setTypeFilter(e.target.value)}
                >
                  {TRANSACTION_TYPES.map(type => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium mb-1">From</label>
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full h-10 text-sm font-normal rounded-md px-3" />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-xs font-medium mb-1">To</label>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full h-10 text-sm font-normal rounded-md px-3" />
              </div>
              <div className="flex-1 min-w-[180px] w-full sm:w-auto">
                <label className="block text-xs font-medium mb-1">Search</label>
                <Input
                  type="text"
                  placeholder="Reference or notes..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-10 text-sm font-normal rounded-md px-3 w-full"
                />
              </div>
            </div>
            {loading ? (
              <div className="p-8 text-center">Loading transactions...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Type</th>
                      <th className="text-left p-3 font-medium">Reference Type</th>
                      <th className="text-left p-3 font-medium">Reference ID</th>
                      <th className="text-left p-3 font-medium">Product ID</th>
                      <th className="text-center p-3 font-medium">Quantity</th>
                      <th className="text-left p-3 font-medium">Notes</th>
                      <th className="text-center p-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-500">No transactions found.</td>
                      </tr>
                    ) : (
                      filtered.map((txn) => (
                        <tr key={txn.id} className="border-b hover:bg-gray-50 dark:hover:bg-zinc-900">
                          <td className="p-3">{new Date(txn.created_at).toLocaleString()}</td>
                          <td className="p-3">{txn.transaction_type}</td>
                          <td className="p-3">{txn.reference_type}</td>
                          <td className="p-3">
                            {txn.reference_id ? (
                              <a
                                href={getReferenceUrl(txn.reference_type, txn.reference_id) || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                {txn.reference_id}
                              </a>
                            ) : '-'}
                          </td>
                          <td className="p-3">{getProductName(txn.product_id)}</td>
                          <td className="text-center p-3">{txn.quantity}</td>
                          <td className="p-3">{txn.notes || '-'}</td>
                          <td className="p-3 text-center">
                            <Button size="sm" variant="outline" onClick={() => setViewTxn(txn)}>View</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {/* View Transaction Modal */}
      <Dialog open={!!viewTxn} onOpenChange={() => setViewTxn(null)}>
        <DialogContent className="sm:max-w-md w-full max-w-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {viewTxn && (
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">ID:</span> {viewTxn.id}</div>
              <div><span className="font-medium">Product:</span> {getProductName(viewTxn.product_id)}</div>
              <div><span className="font-medium">Transaction Type:</span> {viewTxn.transaction_type}</div>
              <div><span className="font-medium">Quantity:</span> {viewTxn.quantity}</div>
              <div><span className="font-medium">Reference Type:</span> {viewTxn.reference_type}</div>
              <div><span className="font-medium">Reference ID:</span> {viewTxn.reference_id ? (
                <a
                  href={getReferenceUrl(viewTxn.reference_type, viewTxn.reference_id) || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {viewTxn.reference_id}
                </a>
              ) : '-'}</div>
              <div><span className="font-medium">Notes:</span> {viewTxn.notes || '-'}</div>
              <div><span className="font-medium">Date:</span> {new Date(viewTxn.created_at).toLocaleString()}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
} 