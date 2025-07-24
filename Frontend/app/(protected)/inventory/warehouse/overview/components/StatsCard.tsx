"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, AlertTriangle, ArrowUpDown, Building } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  change: string
  trend: "up" | "down"
  icon: string
}

const iconMap = {
  package: Package,
  alert: AlertTriangle,
  transfer: ArrowUpDown,
  building: Building,
  truck: ArrowUpDown,
  dollar: TrendingUp,
}

const gradientMap = {
  package: "from-blue-500/20 via-purple-500/10 to-blue-600/5",
  alert: "from-red-500/20 via-orange-500/10 to-red-600/5",
  transfer: "from-green-500/20 via-emerald-500/10 to-green-600/5",
  building: "from-purple-500/20 via-indigo-500/10 to-purple-600/5",
  truck: "from-amber-500/20 via-yellow-500/10 to-amber-600/5",
  dollar: "from-emerald-500/20 via-teal-500/10 to-emerald-600/5",
}

const iconBgMap = {
  package: "from-blue-500 to-purple-600",
  alert: "from-red-500 to-orange-600",
  transfer: "from-green-500 to-emerald-600",
  building: "from-purple-500 to-indigo-600",
  truck: "from-amber-500 to-yellow-600",
  dollar: "from-emerald-500 to-teal-600",
}

export function StatsCard({ title, value, change, trend, icon }: StatsCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Package
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown
  const trendColor = trend === "up" ? "text-emerald-500" : "text-red-500"
  const bgGradient = gradientMap[icon as keyof typeof gradientMap] || gradientMap.package
  const iconBg = iconBgMap[icon as keyof typeof iconBgMap] || iconBgMap.package

  return (
    <motion.div 
      whileHover={{ 
        scale: 1.02,
        y: -4
      }} 
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }}
    >
      <Card className={`
        relative overflow-hidden
        bg-gradient-to-br ${bgGradient}
        border-0
        shadow-lg hover:shadow-2xl
        transition-all duration-500
        backdrop-blur-sm
        group
      `}>
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground/80 tracking-wide uppercase">
                {title}
              </p>
              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {change && (
                  <div className={`flex items-center gap-1.5 text-sm font-medium ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{change}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className={`
              relative p-4 rounded-2xl 
              bg-gradient-to-br ${iconBg}
              shadow-lg shadow-black/10
              group-hover:shadow-xl group-hover:shadow-black/20
              transition-all duration-300
              group-hover:scale-110
            `}>
              <IconComponent className="w-6 h-6 text-white drop-shadow-sm" />
              
              {/* Glow effect */}
              <div className={`
                absolute inset-0 rounded-2xl 
                bg-gradient-to-br ${iconBg}
                opacity-0 group-hover:opacity-30
                blur-xl transition-opacity duration-300
                -z-10
              `} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
