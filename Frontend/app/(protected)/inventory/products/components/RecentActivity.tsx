"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, type PanInfo } from "framer-motion"

// Define the structure for an activity item
type Activity = {
  action: string // e.g., "Added", "Sold"
  count: number // e.g., 2200
  product: string // e.g., "products" (used for pluralization)
  name: string // e.g., "System"
  surname: string // e.g., "Doe" (not used in this simplified UI)
  avatar: string // URL for the avatar image
  time: string // e.g., "6 days ago"
}

interface RecentActivitySlideshowProps {
  activities?: Activity[] // Optional array of activity data
}

export function RecentActivity({ activities = [] }: RecentActivitySlideshowProps) {
  // State to control if the auto-scrolling is paused (e.g., on hover or drag)
  const [isPaused, setIsPaused] = useState(false)
  // State to store the calculated drag constraints for Framer Motion
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })
  // Refs to get DOM elements for width calculations
  const containerRef = useRef<HTMLDivElement>(null) // Outer container for overflow and fades
  const contentRef = useRef<HTMLDivElement>(null) // Inner content that scrolls
  // MotionValue for controlling the horizontal position of the content
  const x = useMotionValue(0)

  // --- Default Activities (for preview/no data) ---
  // This provides some mock data if no activities are passed via props.
  // It helps in previewing the component even without real data.
  const defaultActivities: Activity[] = [
    {
      action: "Added",
      count: 2200,
      product: "products",
      name: "System",
      surname: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "6 days ago",
    },
    {
      action: "Sold",
      count: 50,
      product: "products",
      name: "User",
      surname: "One",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 day ago",
    },
    {
      action: "Updated",
      count: 100,
      product: "products",
      name: "System",
      surname: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "3 hours ago",
    },
    {
      action: "Added",
      count: 120,
      product: "products",
      name: "User",
      surname: "Two",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "5 hours ago",
    },
    {
      action: "Sold",
      count: 15,
      product: "products",
      name: "System",
      surname: "Admin",
      avatar: "/placeholder.svg?height=32&width=32",
      time: "1 week ago",
    },
  ]

  // Use provided activities or default ones
  const displayActivities = activities.length > 0 ? activities : defaultActivities

  // --- Calculate Drag Constraints ---
  // This effect runs when activities or component dimensions change.
  // It calculates the maximum scroll distance for manual dragging.
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const containerWidth = containerRef.current.offsetWidth
      const contentWidth = contentRef.current.scrollWidth
      // The `maxDrag` is the total width of content minus the visible container width.
      // We use Math.max(0, ...) to ensure it's not negative if content is smaller than container.
      const maxDrag = Math.max(0, contentWidth - containerWidth)
      setDragConstraints({ left: -maxDrag, right: 0 })
    }
  }, [displayActivities]) // Recalculate if activities change

  // --- Auto-scroll Animation Logic ---
  // This effect handles the continuous auto-scrolling.
  useEffect(() => {
    // If paused or refs are not ready, do nothing.
    if (isPaused || !containerRef.current || !contentRef.current) return

    const containerWidth = containerRef.current.offsetWidth
    const contentWidth = contentRef.current.scrollWidth
    const scrollDistance = contentWidth - containerWidth

    // If content is smaller than container, no need to scroll.
    if (scrollDistance <= 0) return

    // Set up an interval for smooth, frame-based scrolling.
    // The speed is controlled by the interval duration (50ms here).
    const interval = setInterval(() => {
      const currentX = x.get() // Get current X position
      const nextX = currentX - 1 // Move one pixel to the left

      // If we've scrolled past the end, reset to the beginning for a loop effect.
      if (Math.abs(nextX) >= scrollDistance) {
        x.set(0)
      } else {
        x.set(nextX)
      }
    }, 40) // ~25 frames per second, adjust for desired speed

    // Cleanup function to clear the interval when component unmounts or dependencies change.
    return () => clearInterval(interval)
  }, [isPaused, x, displayActivities]) // Dependencies: pause state, motion value, activities

  // --- Event Handlers for Dragging/Hovering ---
  // Pauses auto-scroll when dragging starts.
  const handleDragStart = () => {
    setIsPaused(true)
  }

  // Resumes auto-scroll when dragging ends.
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsPaused(false)
  }

  // --- Seamless Loop Duplication ---
  // Duplicate the activities array to create a seamless looping effect.
  // This prevents a visible "jump" when the marquee resets.
  const duplicatedActivities = [...displayActivities, ...displayActivities]

  return (
    <div className="w-full font-sans">
      {/* Marquee Container */}
      {/* This div acts as the viewport for the marquee. It hides overflowing content. */}
      {/* It also handles hover events to pause/resume auto-scrolling. */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl h-[40px] flex items-center bg-gradient-to-r from-background via-muted/20 to-background border border-border/50 shadow-lg backdrop-blur-sm"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Fade Overlay */}
        {/* Creates a fading effect on the left edge, making content appear/disappear smoothly. */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Right Fade Overlay */}
        {/* Creates a fading effect on the right edge. */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />

        {/* Marquee Content (Draggable) */}
        {/* This is the actual content that scrolls. It uses Framer Motion for dragging. */}
        <motion.div
          ref={contentRef}
          className="flex items-center py-0 cursor-grab active:cursor-grabbing h-full"
          style={{ x }} // Bind the x MotionValue for animation
          drag="x" // Enable horizontal dragging
          dragConstraints={dragConstraints} // Apply calculated drag limits
          dragElastic={0.1} // Controls "bounciness" when dragging past limits
          onDragStart={handleDragStart} // Pause on drag start
          onDragEnd={handleDragEnd} // Resume on drag end
          whileDrag={{ cursor: "grabbing" }} // Change cursor while dragging
        >
          {/* Individual Activity Items */}
          {duplicatedActivities.map((activity, index) => (
            <motion.div
              key={`${activity.name}-${activity.time}-${index}`} // Unique key for each item
              className="flex items-center gap-2 px-3 py-1 mx-1 min-w-fit whitespace-nowrap rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10 shadow-sm backdrop-blur-sm" // Compact styling, no background/border
              whileHover={{ scale: 1.02, y: -1 }} // Subtle hover animation
              transition={{ type: "spring", stiffness: 400, damping: 25 }} // Smooth spring transition
            >
              {/* Avatar */}
              {/* Displays user avatar or a fallback initial */}
              {activity.avatar ? (
                <img
                  src={activity.avatar || "/placeholder.svg"}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-purple-500/25"
                  alt={activity.name}
                />
              ) : (
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  {activity.name?.charAt(0).toUpperCase() || "?"}
                </div>
              )}

              {/* Combined Activity Text */}
              {/* Displays a concise summary of the activity */}
              <div className="text-xs lg:text-sm text-foreground">
                <span className="font-medium">{activity.name}</span>{" "}
                <span className="text-muted-foreground">{activity.action.toLowerCase()}</span>{" "}
                <span className="font-semibold text-purple-500">{activity.count}</span>{" "}
                <span className="text-muted-foreground">{activity.product}</span>{" "}
                <span className="text-muted-foreground/70 ml-1">{activity.time}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Default export for compatibility with existing imports
export default RecentActivity
