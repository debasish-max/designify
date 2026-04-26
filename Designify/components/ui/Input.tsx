"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <input
          type={type}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition",
            "focus:ring-2 focus:ring-primary",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300",
            "disabled:bg-gray-100 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }