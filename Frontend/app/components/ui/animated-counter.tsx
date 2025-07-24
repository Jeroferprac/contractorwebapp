"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function AnimatedCounter({ value, duration = 2000, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = value / (duration / 50)
      const counter = setInterval(() => {
        setCount((prev) => {
          if (prev >= value) {
            clearInterval(counter)
            return value
          }
          return Math.min(prev + increment, value)
        })
      }, 50)
      return () => clearInterval(counter)
    }, 100)

    return () => clearTimeout(timer)
  }, [value, duration])

  return (
    <span>
      {prefix}
      {Math.floor(count).toLocaleString()}
      {suffix}
    </span>
  )
}
