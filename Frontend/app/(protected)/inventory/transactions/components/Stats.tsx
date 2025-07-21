"use client"

import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react"
import { TransactionStatsCard } from "./TransactionStatsCard"

interface Transaction {
  id: string
  product_id: string
  product_name: string
  transaction_type: "inbound" | "outbound"
  quantity: string
  reference_type: string
  reference_id: string | null
  notes: string
  created_at: string
  category: string
  unit_price: number
  status: "completed" | "pending" | "processing"
}

interface InventoryStatsProps {
  transactions: Transaction[]
}

export function InventoryStats({ transactions }: InventoryStatsProps) {
  // Date helpers for this month and last month
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const isThisMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  };
  const isLastMonth = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  };

  // Inbound
  const inboundThisMonth = transactions.filter(
    t => t.transaction_type === "inbound" && isThisMonth(t.created_at)
  );
  const inboundLastMonth = transactions.filter(
    t => t.transaction_type === "inbound" && isLastMonth(t.created_at)
  );
  const totalInboundThisMonth = inboundThisMonth.reduce((sum, t) => sum + Number(t.quantity) * Number(t.unit_price), 0);
  const totalInboundLastMonth = inboundLastMonth.reduce((sum, t) => sum + Number(t.quantity) * Number(t.unit_price), 0);
  const inboundChange = totalInboundLastMonth
    ? ((totalInboundThisMonth - totalInboundLastMonth) / totalInboundLastMonth) * 100
    : 0;
  const inboundTrend = inboundChange >= 0 ? "up" : "down";

  // Outbound
  const outboundThisMonth = transactions.filter(
    t => t.transaction_type === "outbound" && isThisMonth(t.created_at)
  );
  const outboundLastMonth = transactions.filter(
    t => t.transaction_type === "outbound" && isLastMonth(t.created_at)
  );
  const totalOutboundThisMonth = outboundThisMonth.reduce((sum, t) => sum + Number(t.quantity) * Number(t.unit_price), 0);
  const totalOutboundLastMonth = outboundLastMonth.reduce((sum, t) => sum + Number(t.quantity) * Number(t.unit_price), 0);
  const outboundChange = totalOutboundLastMonth
    ? ((totalOutboundThisMonth - totalOutboundLastMonth) / totalOutboundLastMonth) * 100
    : 0;
  const outboundTrend = outboundChange >= 0 ? "up" : "down";

  // Total transactions
  const totalTransactionsThisMonth = transactions.filter(t => isThisMonth(t.created_at)).length;
  const totalTransactionsLastMonth = transactions.filter(t => isLastMonth(t.created_at)).length;
  const transactionsChange = totalTransactionsLastMonth
    ? ((totalTransactionsThisMonth - totalTransactionsLastMonth) / totalTransactionsLastMonth) * 100
    : 0;
  const transactionsTrend = transactionsChange >= 0 ? "up" : "down";

  // Completion rate (this month)
  const completedThisMonth = transactions.filter(t => isThisMonth(t.created_at) && t.status === "completed").length;
  const completionRateThisMonth = totalTransactionsThisMonth
    ? Math.round((completedThisMonth / totalTransactionsThisMonth) * 100)
    : 0;
  const completedLastMonth = transactions.filter(t => isLastMonth(t.created_at) && t.status === "completed").length;
  const completionRateLastMonth = totalTransactionsLastMonth
    ? Math.round((completedLastMonth / totalTransactionsLastMonth) * 100)
    : 0;
  const completionChange = completionRateLastMonth
    ? completionRateThisMonth - completionRateLastMonth
    : 0;
  const completionTrend = completionChange >= 0 ? "up" : "down";

  console.log("All transactions:", transactions.map(t => t.created_at));
  console.log("This month:", transactions.filter(t => isThisMonth(t.created_at)));
  console.log("Last month:", transactions.filter(t => isLastMonth(t.created_at)));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <TransactionStatsCard
        title="Total Inbound Value"
        value={`$${totalInboundThisMonth.toLocaleString()}`}
        change={`${inboundChange.toFixed(1)}%`}
        trend={inboundTrend}
        icon={<TrendingUp className="h-5 w-5" />}
        color="green"
        delay={0}
      />
      <TransactionStatsCard
        title="Total Outbound Value"
        value={`$${totalOutboundThisMonth.toLocaleString()}`}
        change={`${outboundChange.toFixed(1)}%`}
        trend={outboundTrend}
        icon={<TrendingDown className="h-5 w-5" />}
        color="blue"
        delay={0.1}
      />
      <TransactionStatsCard
        title="Total Transactions"
        value={totalTransactionsThisMonth.toString()}
        change={`${transactionsChange.toFixed(1)}%`}
        trend={transactionsTrend}
        icon={<Activity className="h-5 w-5" />}
        color="purple"
        delay={0.2}
      />
      <TransactionStatsCard
        title="Completion Rate"
        value={`${completionRateThisMonth}%`}
        change={`${completionChange.toFixed(1)}%`}
        trend={completionTrend}
        icon={<DollarSign className="h-5 w-5" />}
        color="orange"
        delay={0.3}
      />
    </div>
  )
}
