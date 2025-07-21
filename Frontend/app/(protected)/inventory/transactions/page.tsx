"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { InventoryStats } from "./components/Stats"
import { TransactionItem } from "./components/TransactionItems"
import { TransactionPagination } from "./components/TransactionPagination"
import { ItemDetailsSidebar } from "./components/ItemDetails"
import { AnimatedButton } from "./components/premium-button"
import { getInventoryTransactions, getProducts } from "@/lib/inventory";
import { useSession } from "next-auth/react";

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

export default function PremiumInventoryDashboard() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "inbound" | "outbound">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [productMap, setProductMap] = useState<Record<string, string>>({});

  const itemsPerPage = 8
  const { data: session } = useSession();

  useEffect(() => {
    Promise.all([
      getInventoryTransactions(),
      getProducts()
    ]).then(([data, products]) => {
      const txs = (data.items ?? data).map((tx: any) => ({
        ...tx,
        unit_price: Number(tx.unit_price) || 0,
        quantity: Number(tx.quantity) || 0,
      }));
      setTransactions(txs);
      // Build productId -> productName map
      const map: Record<string, string> = {};
      products.forEach((p: any) => { map[p.id] = p.name; });
      setProductMap(map);
    });
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      (transaction.product_name?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (transaction.category?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (transaction.notes?.toLowerCase() ?? "").includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.transaction_type === filterType;

    return matchesSearch && matchesFilter;
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
    setTimeout(() => setSelectedTransaction(null), 300)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterType])

  return (
    <DashboardLayout session={session} title="Transaction Report">
      <div className="min-h-screen bg-white dark:bg-[#0b1437] p-4">
        <div className="space-y-8">
          {/* Premium Stats Cards */}
          <InventoryStats transactions={transactions} />

          {/* Premium Transactions Section */}
          <div className="space-y-6">
            <motion.div
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Transaction History</h2>
                <p className="text-muted-foreground">Recent inventory movements and adjustments</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11 w-full sm:w-80 h-11 rounded-xl backdrop-blur-sm bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 focus:bg-white/60 dark:focus:bg-white/10 transition-all duration-300"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-xl p-1 border border-white/20 dark:border-white/10">
                    {(["all", "inbound", "outbound"] as const).map((type) => (
                      <motion.div key={type} whileTap={{ scale: 0.95 }}>
                        <AnimatedButton
                          variant={filterType === type ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setFilterType(type)}
                          gradient={filterType === type}
                          className={cn(
                            "text-sm capitalize rounded-lg transition-all duration-300",
                            filterType === type && "shadow-lg",
                          )}
                        >
                          {type}
                        </AnimatedButton>
                      </motion.div>
                    ))}
                  </div>

                  <AnimatedButton variant="ghost" size="sm" className="h-11 w-11 rounded-xl">
                    <Filter className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>

            {/* Premium Transaction List */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {paginatedTransactions.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={{ ...transaction, product_name: productMap[transaction.product_id] || transaction.product_name }}
                    onView={handleViewTransaction}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <TransactionPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}

            {filteredTransactions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <div className="p-6 rounded-2xl backdrop-blur-sm bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 inline-block mb-4">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">No transactions found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Premium Transaction Details Sidebar */}
        <ItemDetailsSidebar
          transaction={selectedTransaction}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
        />
      </div>
    </DashboardLayout>
  )
}
