"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, Area, AreaChart } from "recharts"
import type { LucideIcon } from "lucide-react"

interface AnimatedChartProps {
  title: string
  icon: LucideIcon
  data: any[]
  type: "bar" | "line" | "area"
  dataKeys: string[]
  colors: string[]
  gradient: string
  delay?: number
}

export function AnimatedChart({
  title,
  icon: Icon,
  data,
  type,
  dataKeys,
  colors,
  gradient,
  delay = 0,
}: AnimatedChartProps) {
  const chartConfig = dataKeys.reduce((acc, key, index) => {
    acc[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index] || colors[0],
    }
    return acc
  }, {} as any)

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (type) {
      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="date" stroke="currentColor" opacity={0.7} fontSize={12} />
            <YAxis stroke="currentColor" opacity={0.7} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index]} radius={[8, 8, 0, 0]} />
            ))}
          </BarChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="date" stroke="currentColor" opacity={0.7} fontSize={12} />
            <YAxis stroke="currentColor" opacity={0.7} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                fill={colors[index]}
                fillOpacity={0.3}
                strokeWidth={3}
              />
            ))}
            <Legend />
          </AreaChart>
        )
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
            <XAxis dataKey="date" stroke="currentColor" opacity={0.7} fontSize={12} />
            <YAxis stroke="currentColor" opacity={0.7} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                strokeWidth={3}
                dot={{ fill: colors[index], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[index], strokeWidth: 2 }}
              />
            ))}
            <Legend />
          </LineChart>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="w-full h-full"
    >
      <Card className="shadow-lg border-0 overflow-hidden dark:bg-gray-800 h-full">
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
              <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-lg sm:text-xl text-gray-900 dark:text-white">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-4 sm:p-6">
          <ChartContainer config={chartConfig} className="h-[280px] sm:h-[320px] w-full">
            {renderChart()}
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}
    