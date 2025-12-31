"use client";

import { useState, useCallback, type ReactNode } from "react";
import { SkeletonTable, SkeletonColumn, InlineLoader, EmptyState } from "@/components/atoms/SkeletonTable";
import { ErrorBoundaryEnhanced, InlineError } from "./ErrorBoundaryEnhanced";
import { ShimmerBar } from "@/components/atoms/Shimmer";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  /** Current loading state */
  isLoading: boolean;
  /** Error state */
  error?: Error | null;
  /** Whether data is empty (after loading) */
  isEmpty?: boolean;
  /** Loading progress (0-100) */
  progress?: number;
  /** Children to render when loaded */
  children: ReactNode;
  /** Skeleton variant to show while loading */
  variant?: "table" | "column" | "inline" | "custom";
  /** Number of skeleton rows */
  skeletonRows?: number;
  /** Custom skeleton component */
  customSkeleton?: ReactNode;
  /** Retry function for error state */
  onRetry?: () => void;
  /** Empty state configuration */
  emptyState?: {
    title: string;
    description?: string;
    action?: ReactNode;
  };
  /** Additional class name */
  className?: string;
}

/**
 * Unified loading state wrapper with skeleton, error, and empty states
 */
export function LoadingState({
  isLoading,
  error,
  isEmpty = false,
  progress,
  children,
  variant = "table",
  skeletonRows = 5,
  customSkeleton,
  onRetry,
  emptyState,
  className,
}: LoadingStateProps) {
  // Error state
  if (error) {
    return (
      <div className={className}>
        <InlineError message={error.message} onRetry={onRetry} />
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={className}>
        {/* Progress bar if available */}
        {typeof progress === "number" && progress < 100 && (
          <div className="mb-2">
            <ShimmerBar width={`${progress}%`} height={2} />
          </div>
        )}

        {/* Skeleton content */}
        {customSkeleton ? (
          customSkeleton
        ) : variant === "table" ? (
          <SkeletonTable rows={skeletonRows} />
        ) : variant === "column" ? (
          <SkeletonColumn rows={skeletonRows} />
        ) : variant === "inline" ? (
          <InlineLoader />
        ) : null}
      </div>
    );
  }

  // Empty state
  if (isEmpty && emptyState) {
    return (
      <div className={className}>
        <EmptyState
          title={emptyState.title}
          description={emptyState.description}
          action={emptyState.action}
        />
      </div>
    );
  }

  // Loaded content
  return <div className={className}>{children}</div>;
}

interface AsyncBoundaryProps {
  children: ReactNode;
  /** Fallback on error */
  errorFallback?: ReactNode;
  /** Reset key for error boundary */
  resetKey?: string | number;
  className?: string;
}

/**
 * Combines ErrorBoundary with loading states for async components
 */
export function AsyncBoundary({
  children,
  errorFallback,
  resetKey,
  className,
}: AsyncBoundaryProps) {
  return (
    <ErrorBoundaryEnhanced fallback={errorFallback} resetKey={resetKey}>
      <div className={className}>{children}</div>
    </ErrorBoundaryEnhanced>
  );
}

interface OptimisticUpdateProps<T> {
  /** Current data */
  data: T;
  /** Optimistic/pending data */
  optimisticData?: T;
  /** Whether an update is pending */
  isPending: boolean;
  /** Render function */
  children: (data: T, isPending: boolean) => ReactNode;
  className?: string;
}

/**
 * Wrapper for optimistic UI updates with pending indicator
 */
export function OptimisticUpdate<T>({
  data,
  optimisticData,
  isPending,
  children,
  className,
}: OptimisticUpdateProps<T>) {
  const displayData = isPending && optimisticData ? optimisticData : data;

  return (
    <div className={cn(isPending && "opacity-70", className)}>
      {children(displayData, isPending)}
    </div>
  );
}

/**
 * Hook for managing async operations with loading/error states
 */
export function useAsyncState<T>() {
  const [state, setState] = useState<{
    data: T | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await asyncFn();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setState((prev) => ({ ...prev, isLoading: false, error }));
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

/**
 * Transition wrapper for smooth content changes
 */
export function ContentTransition({
  children,
  isVisible,
  className,
}: {
  children: ReactNode;
  isVisible: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
    >
      {children}
    </div>
  );
}
