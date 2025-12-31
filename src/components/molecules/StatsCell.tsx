"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/atoms/Tooltip";
import { Users, Clock, Droplet } from "@/components/atoms/Icon";
import { formatCompact, formatTimeAgo } from "@/lib/utils";

interface StatsCellProps {
  value: number | Date;
  type: "holders" | "age" | "liquidity" | "volume";
  className?: string;
  showIcon?: boolean;
}

/**
 * Generic stats cell for various token metrics
 */
export const StatsCell = memo(function StatsCell({
  value,
  type,
  className,
  showIcon = false,
}: StatsCellProps) {
  const formatValue = () => {
    if (type === "age" && value instanceof Date) {
      return formatTimeAgo(value);
    }
    if (typeof value === "number") {
      if (type === "liquidity" || type === "volume") {
        return `$${formatCompact(value)}`;
      }
      return formatCompact(value);
    }
    return String(value);
  };

  const getTooltip = () => {
    if (type === "age" && value instanceof Date) {
      return value.toLocaleString();
    }
    if (typeof value === "number") {
      if (type === "liquidity" || type === "volume") {
        return `$${value.toLocaleString()}`;
      }
      return value.toLocaleString();
    }
    return String(value);
  };

  const getIcon = () => {
    switch (type) {
      case "holders":
        return <Users className="h-3 w-3 text-text-tertiary" />;
      case "age":
        return <Clock className="h-3 w-3 text-text-tertiary" />;
      case "liquidity":
        return <Droplet className="h-3 w-3 text-text-tertiary" />;
      default:
        return null;
    }
  };

  return (
    <Tooltip content={getTooltip()}>
      <span
        className={cn(
          "inline-flex items-center gap-1 font-mono text-sm text-text-secondary",
          className
        )}
      >
        {showIcon && getIcon()}
        {formatValue()}
      </span>
    </Tooltip>
  );
});

/**
 * Holders count cell with icon
 */
export const HoldersCell = memo(function HoldersCell({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <Tooltip content={`${count.toLocaleString()} holders`}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-text-secondary",
          className
        )}
      >
        <Users className="h-3.5 w-3.5 text-text-tertiary" />
        <span className="font-mono">{formatCompact(count)}</span>
      </span>
    </Tooltip>
  );
});

/**
 * Age cell showing time since creation
 */
export const AgeCell = memo(function AgeCell({
  createdAt,
  className,
}: {
  createdAt: Date;
  className?: string;
}) {
  return (
    <Tooltip content={createdAt.toLocaleString()}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-text-secondary",
          className
        )}
      >
        <Clock className="h-3.5 w-3.5 text-text-tertiary" />
        <span className="font-mono">{formatTimeAgo(createdAt)}</span>
      </span>
    </Tooltip>
  );
});

/**
 * Combined stats row for mobile view
 */
export const StatsRow = memo(function StatsRow({
  holders,
  liquidity,
  createdAt,
  className,
}: {
  holders: number;
  liquidity: number;
  createdAt: Date;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 text-xs text-text-tertiary",
        className
      )}
    >
      <span className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {formatCompact(holders)}
      </span>
      <span className="flex items-center gap-1">
        <Droplet className="h-3 w-3" />
        ${formatCompact(liquidity)}
      </span>
      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {formatTimeAgo(createdAt)}
      </span>
    </div>
  );
});
