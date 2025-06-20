"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn("bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded", className)}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
export { Button }
