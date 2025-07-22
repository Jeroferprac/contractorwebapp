"use client"

import { useEffect } from "react"
import { Plus, Package, Users, Download, Zap, Sparkles } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"

interface QuickActionsProps {
  onAddProduct: () => void
  onAddSupplier: () => void
  onCreateOrder: () => void
  onExport: () => void
}

export default function QuickActions({ onAddProduct, onAddSupplier, onCreateOrder, onExport }: QuickActionsProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "p") {
        e.preventDefault()
        onAddProduct()
      }
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault()
        onAddSupplier()
      }
      if (e.ctrlKey && e.key.toLowerCase() === "o") {
        e.preventDefault()
        onCreateOrder()
      }
      if (e.ctrlKey && e.key.toLowerCase() === "e") {
        e.preventDefault()
        onExport()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onAddProduct, onAddSupplier, onCreateOrder, onExport])

  const [open, setOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const parentVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const childVariants: Variants = {
    closed: {
      opacity: 0,
      y: -15,
      x: -10,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
    open: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const actions = [
    {
      label: "Create Order",
      icon: <Plus className="h-5 w-5" />,
      shortcut: "Ctrl + O",
      onClick: onCreateOrder,
      color: "from-emerald-500 to-teal-600",
      hoverColor: "from-emerald-600 to-teal-700",
    },
    {
      label: "Add Product",
      icon: <Package className="h-5 w-5" />,
      shortcut: "Ctrl + P",
      onClick: onAddProduct,
      color: "from-blue-500 to-indigo-600",
      hoverColor: "from-blue-600 to-indigo-700",
    },
    {
      label: "Add Supplier",
      icon: <Users className="h-5 w-5" />,
      shortcut: "Ctrl + S",
      onClick: onAddSupplier,
      color: "from-purple-500 to-pink-600",
      hoverColor: "from-purple-600 to-pink-700",
    },
    {
      label: "Export Data",
      icon: <Download className="h-5 w-5" />,
      shortcut: "Ctrl + E",
      onClick: onExport,
      color: "from-orange-500 to-red-600",
      hoverColor: "from-orange-600 to-red-700",
    },
  ]

  return (
    <div className="relative z-[9999]">
      {/* Main Trigger Button */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-2xl hover:from-purple-600 hover:to-blue-600 font-semibold text-base overflow-hidden group transition-all duration-300 dark:shadow-purple-500/25"
        aria-label="Quick Actions"
        type="button"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-transparent to-cyan-500/20"
        />

        {/* Sparkle Effect */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-1 right-1"
        >
          <Sparkles className="w-3 h-3 text-yellow-300" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Zap className="w-5 h-5 relative z-10" />
        </motion.div>
        <span className="relative z-10">Quick Actions</span>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={parentVariants}
            className="absolute left-0 mt-3 w-72 rounded-2xl shadow-2xl bg-white/10 dark:bg-[#020817]/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-3 overflow-hidden"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5" />

            {/* Floating Orbs */}
            <motion.div
              animate={{
                x: [0, 20, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full"
            />
            <motion.div
              animate={{
                x: [0, -15, 0],
                y: [0, 15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full"
            />

            <div className="relative z-10 space-y-2">
              {actions.map((action, index) => (
                <motion.button
                  key={action.label}
                  onClick={() => {
                    action.onClick()
                    setOpen(false)
                  }}
                  variants={childVariants}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center w-full bg-gradient-to-r ${
                    hoveredIndex === index ? action.hoverColor : action.color
                  } text-white font-medium rounded-xl px-4 py-3 transition-all duration-300 shadow-lg hover:shadow-xl group relative overflow-hidden`}
                  type="button"
                >
                  {/* Button Background Animation */}
                  <motion.div
                    animate={{
                      x: hoveredIndex === index ? [0, 100, 0] : 0,
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: hoveredIndex === index ? Number.POSITIVE_INFINITY : 0,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />

                  <motion.div
                    animate={{
                      rotate: hoveredIndex === index ? [0, 360] : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                    className="relative z-10"
                  >
                    {action.icon}
                  </motion.div>

                  <span className="flex-1 text-left pl-4 relative z-10 font-semibold">{action.label}</span>

                  <motion.span
                    animate={{
                      opacity: hoveredIndex === index ? [0.7, 1, 0.7] : 0.7,
                    }}
                    transition={{
                      duration: 1,
                      repeat: hoveredIndex === index ? Number.POSITIVE_INFINITY : 0,
                      ease: "easeInOut",
                    }}
                    className="text-xs text-white/80 min-w-[70px] text-right relative z-10 font-mono bg-black/20 px-2 py-1 rounded-md"
                  >
                    {action.shortcut}
                  </motion.span>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-300`}
                  />
                </motion.button>
              ))}
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
