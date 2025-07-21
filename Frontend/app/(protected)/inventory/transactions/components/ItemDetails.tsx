"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Package } from "lucide-react"
import { AnimatedButton } from "./premium-button"
import { AnimatedCard } from "./animatedCard"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

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

interface ItemDetailsSidebarProps {
  transaction: Transaction | null
  isOpen: boolean
  onClose: () => void
}

export function ItemDetailsSidebar({
  transaction,
  isOpen,
  onClose,
}: ItemDetailsSidebarProps) {
  if (!transaction) return null

  const isInbound = transaction.transaction_type === "inbound"
  const totalValue = Number.parseFloat(transaction.quantity) * transaction.unit_price

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Premium Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Premium Sidebar */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300, opacity: { duration: 0.2 } }}
            className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gradient-to-br from-white/95 to-white/80 dark:from-[#0b1437]/95 dark:to-[#020817]/80 backdrop-blur-xl border-l border-white/20 dark:border-white/5 shadow-2xl z-50 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent" />

            <div className="p-6 relative">
              {/* Premium Header */}
              <motion.div
                className="flex items-center justify-between mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h2 className="text-xl font-bold mb-2 text-foreground">Transaction Details</h2>
                  <p className="text-sm text-muted-foreground">Complete transaction information</p>
                </div>
                <AnimatedButton variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 rounded-xl">
                  <X className="h-4 w-4" />
                </AnimatedButton>
              </motion.div>

              {/* Premium Transaction Info */}
              <div className="space-y-8">
                <motion.div
                  className="flex items-center space-x-4 p-4 rounded-2xl backdrop-blur-sm bg-gradient-to-r from-white/40 to-white/20 dark:from-white/10 dark:to-white/5"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl backdrop-blur-sm",
                      isInbound
                        ? "bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400"
                        : "bg-red-500/20 dark:bg-red-500/30 text-red-600 dark:text-red-400",
                    )}
                  >
                    <Package className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{transaction.product_name}</h3>
                    <p className="text-muted-foreground">{transaction.category}</p>
                  </div>
                </motion.div>

                <Separator className="bg-white/20 dark:bg-white/10" />

                {/* Premium Key Metrics */}
                <motion.div
                  className="grid grid-cols-2 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <AnimatedCard>
                    <CardContent className="p-4 text-center">
                      <motion.div
                        className="text-3xl font-bold text-primary mb-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      >
                        {transaction.quantity}
                      </motion.div>
                      <div className="text-xs text-muted-foreground font-medium">Quantity</div>
                    </CardContent>
                  </AnimatedCard>

                  <AnimatedCard>
                    <CardContent className="p-4 text-center">
                      <motion.div
                        className={cn(
                          "text-3xl font-bold mb-1",
                          isInbound ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                        )}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        ${totalValue.toFixed(0)}
                      </motion.div>
                      <div className="text-xs text-muted-foreground font-medium">Total Value</div>
                    </CardContent>
                  </AnimatedCard>
                </motion.div>

                <Separator className="bg-white/20 dark:bg-white/10" />

                {/* Premium Details */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { label: "Transaction ID", value: transaction.id, mono: true },
                    { label: "Product ID", value: transaction.product_id, mono: true },
                    { label: "Unit Price", value: `$${(transaction.unit_price ?? 0).toFixed(2)}` },
                    { label: "Reference ID", value: transaction.reference_id || "N/A", mono: true },
                    { label: "Notes", value: transaction.notes || "No notes available" },
                    { label: "Created At", value: new Date(transaction.created_at).toLocaleString() },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        {item.label}
                      </label>
                      <div
                        className={cn(
                          "p-3 rounded-xl backdrop-blur-sm bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground",
                          item.mono && "font-mono text-sm",
                        )}
                      >
                        {item.value}
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Status & Type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        className={cn(
                          "capitalize",
                          isInbound
                            ? "bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                            : "bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
                        )}
                      >
                        {transaction.transaction_type}
                      </Badge>
                      <Badge variant="outline" className="capitalize backdrop-blur-sm bg-white/20 dark:bg-white/5">
                        {transaction.reference_type}
                      </Badge>
                      <Badge
                        className={cn(
                          "capitalize",
                          transaction.status === "completed"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                              : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
                        )}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
