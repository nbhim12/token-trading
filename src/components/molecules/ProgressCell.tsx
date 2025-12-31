"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Progress, BondingProgress } from "@/components/atoms/Progress";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Zap } from "@/components/atoms/Icon";

interface ProgressCellProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "compact" | "detailed";
}

/**
 * Progress cell for bonding curve display
 * Shows how close a token is to migration
 */
export const ProgressCell = memo(function ProgressCell({
  value,
  className,
  showLabel = false,
  variant = "default",
}: ProgressCellProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  if (variant === "compact") {
    return (
      <Tooltip content={`${clampedValue.toFixed(1)}% bonding progress`}>
        <div className={cn("w-16", className)}>
          <Progress value={clampedValue} size="sm" />
        </div>
      </Tooltip>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={cn("w-24", className)}>
        <BondingProgress value={clampedValue} />
      </div>
    );
  }

  return (
    <Tooltip
      content={
        <div className="text-xs">
          <div className="font-medium mb-1">Bonding Curve Progress</div>
          <div>{clampedValue.toFixed(2)}% complete</div>
          {clampedValue >= 90 && (
            <div className="text-success mt-1">🚀 Almost migrated!</div>
          )}
        </div>
      }
    >
      <div className={cn("flex items-center gap-2", className)}>
        <Progress value={clampedValue} size="sm" className="w-16" />
        {showLabel && (
          <span className="text-xs font-mono text-text-secondary">
            {clampedValue.toFixed(0)}%
          </span>
        )}
      </div>
    </Tooltip>
  );
});

/**
 * Migration status indicator
 */
export const MigrationStatus = memo(function MigrationStatus({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  const status =
    progress >= 100
      ? { label: "Migrated", color: "text-success", bg: "bg-success/10" }
      : progress >= 90
        ? { label: "Final Stretch", color: "text-yellow-400", bg: "bg-yellow-400/10" }
        : progress >= 50
          ? { label: "Halfway", color: "text-orange-400", bg: "bg-orange-400/10" }
          : { label: "Early", color: "text-blue-400", bg: "bg-blue-400/10" };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
          status.bg,
          status.color
        )}
      >
        <Zap className="h-3 w-3" />
        {status.label}
      </div>
      <span className="text-xs font-mono text-text-tertiary">
        {progress.toFixed(1)}%
      </span>
    </div>
  );
});
