"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseProgressiveLoadOptions<T> {
  /** Initial data to show immediately */
  initialData?: T[];
  /** Function to fetch data */
  fetchFn: () => Promise<T[]>;
  /** Batch size for progressive loading */
  batchSize?: number;
  /** Delay between batches in ms */
  batchDelay?: number;
  /** Whether to start loading immediately */
  autoStart?: boolean;
  /** Callback when all data is loaded */
  onComplete?: () => void;
}

interface UseProgressiveLoadResult<T> {
  /** Currently loaded data */
  data: T[];
  /** Whether initial loading is in progress */
  isLoading: boolean;
  /** Whether more batches are being loaded */
  isLoadingMore: boolean;
  /** Total number of items expected */
  total: number;
  /** Current progress (0-100) */
  progress: number;
  /** Any error that occurred */
  error: Error | null;
  /** Manually trigger a reload */
  reload: () => void;
  /** Whether all data has been loaded */
  isComplete: boolean;
}

/**
 * Hook for progressive data loading with batched rendering
 * Prevents UI blocking by loading data in chunks
 */
export function useProgressiveLoad<T>({
  initialData = [],
  fetchFn,
  batchSize = 10,
  batchDelay = 50,
  autoStart = true,
  onComplete,
}: UseProgressiveLoadOptions<T>): UseProgressiveLoadResult<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [allData, setAllData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(autoStart);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const batchIndexRef = useRef(0);
  const isMountedRef = useRef(true);

  // Calculate progress
  const total = allData.length;
  const progress = total > 0 ? Math.round((data.length / total) * 100) : 0;

  // Load data in batches
  const loadBatches = useCallback(
    async (items: T[]) => {
      if (items.length === 0) {
        setIsComplete(true);
        onComplete?.();
        return;
      }

      setIsLoadingMore(true);
      batchIndexRef.current = 0;

      const loadNextBatch = () => {
        if (!isMountedRef.current) return;

        const start = batchIndexRef.current * batchSize;
        const end = Math.min(start + batchSize, items.length);
        const batch = items.slice(0, end);

        setData(batch);
        batchIndexRef.current++;

        if (end < items.length) {
          setTimeout(loadNextBatch, batchDelay);
        } else {
          setIsLoadingMore(false);
          setIsComplete(true);
          onComplete?.();
        }
      };

      // Start loading batches
      loadNextBatch();
    },
    [batchSize, batchDelay, onComplete]
  );

  // Initial fetch
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsComplete(false);
    setError(null);
    setData([]);

    try {
      const result = await fetchFn();
      if (isMountedRef.current) {
        setAllData(result);
        setIsLoading(false);
        await loadBatches(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error("Failed to load data"));
        setIsLoading(false);
      }
    }
  }, [fetchFn, loadBatches]);

  // Reload function
  const reload = useCallback(() => {
    batchIndexRef.current = 0;
    fetchData();
  }, [fetchData]);

  // Auto-start on mount
  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      fetchData();
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [autoStart, fetchData]);

  return {
    data,
    isLoading,
    isLoadingMore,
    total,
    progress,
    error,
    reload,
    isComplete,
  };
}

/**
 * Hook for staggered item rendering with intersection observer
 */
export function useStaggeredRender<T>(
  items: T[],
  options: {
    initialCount?: number;
    incrementBy?: number;
    delay?: number;
  } = {}
) {
  const { initialCount = 5, incrementBy = 5, delay = 100 } = options;
  const [visibleCount, setVisibleCount] = useState(initialCount);

  useEffect(() => {
    if (visibleCount >= items.length) return;

    const timer = setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + incrementBy, items.length));
    }, delay);

    return () => clearTimeout(timer);
  }, [visibleCount, items.length, incrementBy, delay]);

  // Reset when items change significantly
  useEffect(() => {
    setVisibleCount(Math.min(initialCount, items.length));
  }, [items.length, initialCount]);

  return {
    visibleItems: items.slice(0, visibleCount),
    visibleCount,
    totalCount: items.length,
    isComplete: visibleCount >= items.length,
    progress: items.length > 0 ? (visibleCount / items.length) * 100 : 100,
  };
}

/**
 * Simple loading state hook with minimum display time
 */
export function useLoadingState(minDisplayTime = 500) {
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (startTimeRef.current === null) {
      setIsLoading(false);
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    if (remaining > 0) {
      setTimeout(() => setIsLoading(false), remaining);
    } else {
      setIsLoading(false);
    }

    startTimeRef.current = null;
  }, [minDisplayTime]);

  return { isLoading, startLoading, stopLoading };
}
