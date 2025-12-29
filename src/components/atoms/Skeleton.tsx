import { cn } from "@/lib/utils";
import type { SkeletonVariant } from "@/lib/types";

interface SkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  /** Number of skeleton items to render */
  count?: number;
}

/**
 * Skeleton loading placeholder with shimmer animation
 * Used for content loading states to prevent layout shifts
 */
export function Skeleton({
  className,
  variant = "rect",
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseStyles = "animate-shimmer bg-bg-tertiary";

  const variantStyles: Record<SkeletonVariant, string> = {
    line: "h-4 w-full rounded",
    circle: "rounded-full aspect-square",
    rect: "rounded-lg",
  };

  const style: React.CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (count > 1) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(baseStyles, variantStyles[variant], className)}
            style={style}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton specifically for table rows
 */
export function SkeletonRow({ columns = 6 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-3 p-3 border-b border-border-primary">
      <Skeleton variant="circle" width={32} height={32} />
      <div className="flex-1 space-y-1">
        <Skeleton variant="line" width="60%" height={14} />
        <Skeleton variant="line" width="40%" height={12} />
      </div>
      {Array.from({ length: columns - 1 }).map((_, i) => (
        <Skeleton key={i} variant="line" width={60} height={14} />
      ))}
    </div>
  );
}

/**
 * Skeleton for token card in mobile view
 */
export function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg border border-border-primary bg-bg-secondary space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-1">
          <Skeleton variant="line" width="50%" height={16} />
          <Skeleton variant="line" width="30%" height={12} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton variant="rect" height={40} />
        <Skeleton variant="rect" height={40} />
        <Skeleton variant="rect" height={40} />
        <Skeleton variant="rect" height={40} />
      </div>
      <Skeleton variant="rect" height={8} className="rounded-full" />
    </div>
  );
}
