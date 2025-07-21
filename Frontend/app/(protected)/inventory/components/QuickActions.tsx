'use client'
import { useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Users, Download, Zap } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface QuickActionsProps {
  onAddProduct: () => void
  onAddSupplier: () => void
  onCreateOrder: () => void
  onExport: () => void
}

export default function QuickActions({
  onAddProduct,
  onAddSupplier,
  onCreateOrder,
  onExport,
}: QuickActionsProps) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        onAddProduct();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        onAddSupplier();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        onCreateOrder();
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddProduct, onAddSupplier, onCreateOrder, onExport]);

  const [open, setOpen] = useState(false);

  const parentVariants = {
    closed: { transition: { staggerChildren: 0 } },
    open: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const childVariants = {
    closed: { opacity: 0, y: -10, pointerEvents: "none" },
    open: { opacity: 1, y: 0, pointerEvents: "auto", transition: { duration: 0.18 } },
  };

  const actions = [
    { label: "Create Order", icon: <Plus className="h-5 w-5" />, shortcut: "ctrl + O", onClick: onCreateOrder },
    { label: "Add Product", icon: <Package className="h-5 w-5" />, shortcut: "ctrl + P", onClick: onAddProduct },
    { label: "Add Supplier", icon: <Users className="h-5 w-5" />, shortcut: "ctrl + S", onClick: onAddSupplier },
    { label: "Export", icon: <Download className="h-5 w-5" />, shortcut: "ctrl + E", onClick: onExport },
  ];

  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen((prev) => !prev)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:from-purple-600 hover:to-blue-600 shadow-lg font-semibold text-base"
        aria-label="Quick Actions"
        type="button"
      >
        <Zap className="w-3 h-4" />
        Quick Actions
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={parentVariants}
            className="absolute left-0 mt-2 w-56 rounded-xl shadow-2xl bg-gradient-to-br from-blue-500 to-[#8e5ff7] p-2"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            {actions.map((action) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                variants={childVariants}
                className="flex items-center w-full bg-[#8e5ff7]/80 hover:bg-[#8e5ff7]/90 text-white font-medium rounded-lg px-4 py-2 mb-1 last:mb-0 transition min-h-[44px]"
                type="button"
              >
                {action.icon}
                <span className="flex-1 text-left pl-3">{action.label}</span>
                <span className="text-xs text-blue-100 min-w-[60px] text-right">{action.shortcut}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 