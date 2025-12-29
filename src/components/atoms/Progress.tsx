"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  /** Progress value from 0-100 */
  value?: number;
  /** Show value label */
  showLabel?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Color variant based on progress */
  colorByProgress?: boolean;
}

/**
 * Progress bar component for displaying bonding curve progress
 * Supports color coding based on progress percentage
 */
export const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      showLabel = false,
      size = "md",
      colorByProgress = true,
      ...props
    },
    ref
  ) => {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    // Determine color based on progress
    const getProgressColor = () => {
      if (!colorByProgress) return "bg-accent-primary";
      if (clampedValue >= 90) return "bg-success";
      if (clampedValue >= 70) return "bg-yellow-500";
      if (clampedValue >= 50) return "bg-orange-500";
      return "bg-accent-primary";
    };

    const sizeStyles = {
      sm: "h-1",
      md: "h-2",
      lg: "h-3",
    };

    return (
      <div className="w-full">
        {showLabel && (
          <div className="flex justify-between mb-1">
            <span className="text-xs text-text-secondary">Progress</span>
            <span className="text-xs text-text-primary font-mono">
              {clampedValue.toFixed(1)}%
            </span>
          </div>
        )}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-bg-tertiary",
            sizeStyles[size],
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full transition-all duration-300 ease-out rounded-full",
              getProgressColor()
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = "Progress";

/**
 * Bonding curve progress with milestone markers
 */
export function BondingProgress({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      <div className="relative">
        <Progress value={clampedValue} size="sm" />
        {/* Milestone markers */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          {[25, 50, 75].map((milestone) => (
            <div
              key={milestone}
              className="w-px h-full bg-bg-primary/50"
              style={{ marginLeft: `${milestone}%` }}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-text-muted">0%</span>
        <span
          className={cn(
            "text-[10px] font-mono",
            clampedValue >= 90 ? "text-success" : "text-text-secondary"
          )}
        >
          {clampedValue.toFixed(1)}%
        </span>
        <span className="text-[10px] text-text-muted">100%</span>
      </div>
    </div>
  );
}
