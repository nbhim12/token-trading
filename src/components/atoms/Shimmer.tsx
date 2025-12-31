"use client";

import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
  /** Whether to show the shimmer overlay */
  isLoading?: boolean;
  children?: React.ReactNode;
}

/**
 * Shimmer overlay effect for loading states
 * Can wrap content to add a shimmer effect while loading
 */
export function Shimmer({ className, isLoading = true, children }: ShimmerProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Pulse animation wrapper for subtle loading indication
 */
export function Pulse({
  className,
  isLoading = true,
  children,
}: ShimmerProps) {
  return (
    <div
      className={cn(
        isLoading && "animate-pulse",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Skeleton shimmer bar - horizontal loading indicator
 */
export function ShimmerBar({
  className,
  width = "100%",
  height = 4,
}: {
  className?: string;
  width?: string | number;
  height?: number;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full bg-bg-tertiary",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
      }}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

/**
 * Loading dots animation
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[bounce_1s_infinite_0ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[bounce_1s_infinite_200ms]" />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-[bounce_1s_infinite_400ms]" />
    </span>
  );
}

/**
 * Spinner loading indicator
 */
export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
