"use client";

import { Skeleton } from "./Skeleton";
import { Shimmer, ShimmerBar } from "./Shimmer";
import { cn } from "@/lib/utils";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

/**
 * Skeleton loader for token table - matches TokenTable layout
 */
export function SkeletonTable({
  rows = 5,
  columns = 6,
  showHeader = true,
  className,
  variant = "default",
}: SkeletonTableProps) {
  const columnWidths = ["120px", "80px", "100px", "80px", "60px", "100px"];

  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="flex items-center gap-4 px-4 py-3 border-b border-border-primary bg-bg-secondary/50">
          <Skeleton variant="rect" width={32} height={32} className="opacity-0" />
          <div className="flex-1">
            <Skeleton variant="line" width={60} height={12} />
          </div>
          {columnWidths.slice(1).map((width, i) => (
            <Skeleton key={i} variant="line" width={width} height={12} />
          ))}
        </div>
      )}

      <Shimmer isLoading>
        <div className="divide-y divide-border-primary">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <SkeletonTableRow
              key={rowIndex}
              columns={columns}
              variant={variant}
              delay={rowIndex * 100}
            />
          ))}
        </div>
      </Shimmer>
    </div>
  );
}

/**
 * Single skeleton table row with staggered animation
 */
function SkeletonTableRow({
  columns,
  variant,
  delay = 0,
}: {
  columns: number;
  variant: "default" | "compact" | "detailed";
  delay?: number;
}) {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

  return (
    <div
      className={cn(
        "flex items-center gap-4 px-4 animate-pulse",
        isCompact ? "py-2" : "py-3"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar */}
      <Skeleton
        variant="circle"
        width={isCompact ? 28 : 36}
        height={isCompact ? 28 : 36}
      />

      {/* Token name column */}
      <div className="flex-1 min-w-[120px] space-y-1.5">
        <Skeleton variant="line" width="70%" height={isCompact ? 12 : 14} />
        <Skeleton variant="line" width="50%" height={isCompact ? 10 : 11} className="opacity-60" />
      </div>

      {/* Price column */}
      <div className="w-20 space-y-1">
        <Skeleton variant="line" width="90%" height={14} />
        <Skeleton variant="line" width="60%" height={10} className="opacity-60" />
      </div>

      {/* Market cap / Stats */}
      <div className="w-24 space-y-1">
        <Skeleton variant="line" width="80%" height={14} />
        {isDetailed && (
          <Skeleton variant="line" width="50%" height={10} className="opacity-60" />
        )}
      </div>

      {/* Progress */}
      <div className="w-20">
        <Skeleton variant="rect" width="100%" height={6} className="rounded-full" />
      </div>

      {/* Age / Time */}
      <Skeleton variant="line" width={50} height={12} />

      {/* Action buttons */}
      {columns >= 6 && (
        <div className="flex gap-2">
          <Skeleton variant="rect" width={60} height={28} className="rounded-md" />
          <Skeleton variant="rect" width={28} height={28} className="rounded-md" />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton for column/card view - matches TokenColumn layout
 */
export function SkeletonColumn({
  rows = 5,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="circle" width={8} height={8} />
          <Skeleton variant="line" width={80} height={14} />
          <Skeleton variant="rect" width={24} height={18} className="rounded" />
        </div>
        <Skeleton variant="rect" width={60} height={24} className="rounded" />
      </div>

      {/* Rows */}
      <Shimmer isLoading>
        <div className="divide-y divide-border-primary">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonColumnRow key={i} delay={i * 80} />
          ))}
        </div>
      </Shimmer>
    </div>
  );
}

/**
 * Single skeleton column row
 */
function SkeletonColumnRow({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Avatar */}
      <Skeleton variant="circle" width={32} height={32} />

      {/* Token info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Skeleton variant="line" width={60} height={13} />
          <Skeleton variant="line" width={40} height={10} className="opacity-60" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton variant="line" width={50} height={11} />
          <Skeleton variant="line" width={40} height={11} />
        </div>
      </div>

      {/* Right side - price and progress */}
      <div className="text-right space-y-1">
        <Skeleton variant="line" width={55} height={13} className="ml-auto" />
        <div className="flex items-center gap-1.5 justify-end">
          <Skeleton variant="rect" width={40} height={4} className="rounded-full" />
          <Skeleton variant="line" width={30} height={10} />
        </div>
      </div>
    </div>
  );
}

/**
 * Full page loading skeleton with tabs
 */
export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-bg-primary p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton variant="rect" width={120} height={32} className="rounded-lg" />
          <Skeleton variant="circle" width={8} height={8} />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton variant="rect" width={100} height={32} className="rounded-lg" />
          <Skeleton variant="rect" width={32} height={32} className="rounded-lg" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rect" width={100} height={36} className="rounded-lg" />
        ))}
      </div>

      {/* Loading progress bar */}
      <ShimmerBar width="100%" height={2} />

      {/* Three columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SkeletonColumn rows={6} />
        <SkeletonColumn rows={6} />
        <SkeletonColumn rows={6} />
      </div>
    </div>
  );
}

/**
 * Inline loading state for refreshing data
 */
export function InlineLoader({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 text-text-secondary">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span className="text-sm">{message}</span>
    </div>
  );
}

/**
 * Empty state placeholder
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-4 text-text-tertiary">{icon}</div>}
      <h3 className="text-lg font-medium text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}
