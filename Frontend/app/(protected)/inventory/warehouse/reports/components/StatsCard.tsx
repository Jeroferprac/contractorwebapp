"use client"

import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  subtitle: string
  percentage: number
  primaryLabel: string
  primaryValue: string
  secondaryLabel: string
  secondaryValue: string
  isLoading?: boolean
  borderColor: string
  progressColor: string
  delay?: number
}

export function StatsCard({
  title,
  subtitle,
  percentage,
  primaryLabel,
  primaryValue,
  secondaryLabel,
  secondaryValue,
  isLoading = false,
  borderColor,
  progressColor,
  delay = 0,
}: StatsCardProps) {
  const circumference = 2 * Math.PI * 40 // radius = 40
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-0 overflow-hidden h-[280px]"
      >
        {/* Loading border */}
        <div className={`h-1 bg-gradient-to-r ${borderColor} animate-pulse`} />
        <div className="p-6 space-y-6 h-full flex flex-col">
          {/* Loading title */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded animate-pulse w-24" />
          </div>

          {/* Loading circle */}
          <div className="flex justify-center items-center flex-1">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-4 w-12 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
              </div>
              <div className="h-4 w-20 bg-gray-100 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        y: -8,
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-0 overflow-hidden h-[280px] hover:shadow-2xl transition-shadow duration-300"
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2, duration: 0.4 }}
            className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.4 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Circular Progress - centered */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              delay: delay + 0.5,
              duration: 0.8,
              type: "spring",
              stiffness: 80,
            }}
            className="relative"
          >
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 88 88">
              {/* Background circle */}
              <circle cx="44" cy="44" r="40" stroke="#e5e7eb" strokeWidth="6" fill="none" />
              {/* Progress circle */}
              <motion.circle
                cx="44"
                cy="44"
                r="40"
                stroke={progressColor}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{
                  delay: delay + 0.8,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
              {/* Progress dot */}
              {percentage > 0 && (
                <motion.circle
                  cx={44 + 40 * Math.cos((percentage / 100) * 2 * Math.PI - Math.PI / 2)}
                  cy={44 + 40 * Math.sin((percentage / 100) * 2 * Math.PI - Math.PI / 2)}
                  r="4"
                  fill={progressColor}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: delay + 1.8,
                    type: "spring",
                    stiffness: 200,
                  }}
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: delay + 1.2,
                  type: "spring",
                  stiffness: 150,
                }}
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                {percentage}%
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Stats at bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + 1.4,
            duration: 0.5,
            type: "spring",
            stiffness: 100,
          }}
          className="space-y-3"
        >
          <motion.div
            className="flex items-center justify-between"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className={`w-3 h-3 rounded-full`}
                style={{ backgroundColor: progressColor }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 1.6, type: "spring" }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{primaryLabel}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{primaryValue}</span>
          </motion.div>
          <motion.div
            className="flex items-center justify-between"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: delay + 1.7, type: "spring" }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">{secondaryLabel}:</span>
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{secondaryValue}</span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
