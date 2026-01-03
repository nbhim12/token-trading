"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

interface UseVirtualListOptions<T> {
  /** Array of items to virtualize */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Number of items to render outside visible area */
  overscan?: number;
  /** Container height (if not using ref) */
  containerHeight?: number;
}

interface VirtualItem<T> {
  index: number;
  item: T;
  style: React.CSSProperties;
}

/**
 * Hook for virtualizing large lists
 * Only renders items that are visible in the viewport
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 3,
  containerHeight: fixedContainerHeight,
}: UseVirtualListOptions<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(fixedContainerHeight || 0);

  // Update container height on resize
  useEffect(() => {
    if (fixedContainerHeight) {
      setContainerHeight(fixedContainerHeight);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [fixedContainerHeight]);

  // Handle scroll events
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate visible range
  const { startIndex, endIndex, virtualItems, totalHeight } = useMemo(() => {
    const totalHeight = items.length * itemHeight;
    
    if (containerHeight === 0) {
      return { startIndex: 0, endIndex: 0, virtualItems: [], totalHeight };
    }

    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount, items.length);

    // Apply overscan
    const startIndex = Math.max(0, start - overscan);
    const endIndex = Math.min(items.length, end + overscan);

    const virtualItems: VirtualItem<T>[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      const item = items[i];
      if (item === undefined) continue;
      virtualItems.push({
        index: i,
        item,
        style: {
          position: "absolute",
          top: i * itemHeight,
          left: 0,
          right: 0,
          height: itemHeight,
        },
      });
    }

    return { startIndex, endIndex, virtualItems, totalHeight };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) return;

      const targetTop = index * itemHeight;
      container.scrollTo({ top: targetTop, behavior });
    },
    [itemHeight]
  );

  return {
    containerRef,
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    scrollToIndex,
    containerProps: {
      ref: containerRef,
      style: {
        overflow: "auto",
        position: "relative" as const,
      },
    },
    innerProps: {
      style: {
        height: totalHeight,
        position: "relative" as const,
      },
    },
  };
}

/**
 * Hook for infinite scrolling
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  threshold = 200,
  isLoading,
}: {
  onLoadMore: () => void;
  hasMore: boolean;
  threshold?: number;
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

      if (distanceFromBottom < threshold) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, threshold, onLoadMore]);

  return { containerRef };
}

/**
 * Hook for smooth scroll restoration
 */
export function useScrollRestoration(key: string) {
  const containerRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Map<string, number>>(new Map());

  // Save scroll position
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      scrollPositions.current.set(key, container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [key]);

  // Restore scroll position
  useEffect(() => {
    const container = containerRef.current;
    const savedPosition = scrollPositions.current.get(key);
    
    if (container && savedPosition !== undefined) {
      container.scrollTop = savedPosition;
    }
  }, [key]);

  return { containerRef };
}
