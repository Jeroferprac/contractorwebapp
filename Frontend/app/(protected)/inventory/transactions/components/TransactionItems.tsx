"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Package, Eye, ArrowUpRight, ArrowDownRight, Box, Truck, RefreshCw, Calendar } from "lucide-react"
import { AnimatedButton } from "./premium-button"
import { AnimatedCard } from "./animatedCard"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
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

interface TransactionItemProps {
  transaction: Transaction
  onView: (transaction: Transaction) => void
  index: number
}

export function TransactionItem({ transaction, onView, index }: TransactionItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isInbound = transaction.transaction_type === "inbound"
  const totalValue = Number.parseFloat(transaction.quantity) * transaction.unit_price

  const getIcon = () => {
    switch (transaction.reference_type) {
      case "purchase":
        return <Truck className="h-4 w-4" />
      case "sale":
        return <Box className="h-4 w-4" />
      case "adjustment":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Supplies:
        "from-orange-500/20 to-amber-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-400/30",
      Materials:
        "from-purple-500/20 to-violet-500/10 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-400/30",
      Electronics:
        "from-blue-500/20 to-cyan-500/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-400/30",
      Packaging:
        "from-green-500/20 to-emerald-500/10 text-green-700 dark:text-green-300 border-green-200/50 dark:border-green-400/30",
      Equipment:
        "from-red-500/20 to-pink-500/10 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-400/30",
      Safety:
        "from-yellow-500/20 to-orange-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-200/50 dark:border-yellow-400/30",
      Chemicals:
        "from-indigo-500/20 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-400/30",
    }
    return (
      colors[category as keyof typeof colors] ||
      "from-gray-500/20 to-slate-500/10 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-400/30"
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700"
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700"
      case "processing":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700"
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, type: "spring", stiffness: 120, damping: 20 }}
      whileHover={{ y: -2, scale: 1.01, transition: { duration: 0.2, type: "spring", stiffness: 400, damping: 25 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group cursor-pointer"
    >
      <AnimatedCard>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 dark:from-purple-500/10 dark:to-blue-500/10 opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <motion.div
                className={cn(
                  "p-3 rounded-2xl backdrop-blur-sm transition-all duration-300",
                  isInbound
                    ? "bg-green-500/20 dark:bg-green-500/30 text-green-600 dark:text-green-400"
                    : "bg-red-500/20 dark:bg-red-500/30 text-red-600 dark:text-red-400",
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {getIcon()}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-base truncate text-foreground">{transaction.product_name}</h3>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <motion.span className="flex items-center space-x-1" whileHover={{ scale: 1.05 }}>
                    {isInbound ? (
                      <ArrowDownRight className="h-3 w-3 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-3 w-3 text-red-600 dark:text-red-400" />
                    )}
                    <span className="capitalize font-medium">{transaction.transaction_type}</span>
                  </motion.span>
                  <span className="flex items-center space-x-1">
                    <Package className="h-3 w-3" />
                    <span>{transaction.quantity}</span>
                  </span>
                  <span className="hidden sm:flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <motion.div
                  className={cn(
                    "font-bold text-lg",
                    isInbound ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400",
                  )}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.3, type: "spring", stiffness: 200 }}
                >
                  {isInbound ? "+" : "-"}${totalValue.toFixed(2)}
                </motion.div>
                <div className="text-xs text-muted-foreground">@${(transaction.unit_price ?? 0).toFixed(2)}</div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onView(transaction)}
                  className="h-9 w-9 rounded-xl"
                >
                  <Eye className="h-4 w-4" />
                </AnimatedButton>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>
    </motion.div>
  )
}
