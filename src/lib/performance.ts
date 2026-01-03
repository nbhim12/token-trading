/**
 * Performance utilities for optimizing React rendering
 */

/**
 * Creates a stable reference for callbacks that won't cause re-renders
 * but always calls the latest version of the callback
 */
export function createStableCallback<T extends (...args: unknown[]) => unknown>(
  callback: T
): T {
  let latestCallback = callback;
  
  const stableCallback = ((...args: Parameters<T>) => {
    return latestCallback(...args);
  }) as T;
  
  // Update the reference without changing the function identity
  const update = (newCallback: T) => {
    latestCallback = newCallback;
  };
  
  return Object.assign(stableCallback, { update });
}

/**
 * Simple memoization with size limit (LRU-like behavior)
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: { maxSize?: number; keyFn?: (...args: Parameters<T>) => string } = {}
): T {
  const { maxSize = 100, keyFn } = options;
  const cache = new Map<string, ReturnType<T>>();
  const keys: string[] = [];

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key) as ReturnType<T>;
    }

    const result = fn(...args) as ReturnType<T>;
    
    // Evict oldest entry if at capacity
    if (keys.length >= maxSize) {
      const oldestKey = keys.shift()!;
      cache.delete(oldestKey);
    }

    cache.set(key, result);
    keys.push(key);
    
    return result;
  }) as T;
}

/**
 * Throttle function execution
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Request animation frame debounce for smooth animations
 */
export function rafDebounce<T extends (...args: unknown[]) => unknown>(
  func: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;

  return (...args: Parameters<T>) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
      func(...args);
      rafId = null;
    });
  };
}

/**
 * Batch multiple updates into a single render cycle
 */
export function batchUpdates<T>(updates: (() => T)[]): T[] {
  // In React 18+, updates are automatically batched
  // This is a helper for explicit batching in edge cases
  return updates.map((update) => update());
}

/**
 * Check if an element is in the viewport
 */
export function isInViewport(element: HTMLElement, threshold = 0): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
  );
}

/**
 * Lazy load resources when element enters viewport
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: "50px",
    threshold: 0,
    ...options,
  });
}

/**
 * Measure component render time (development only)
 */
export function measureRender(componentName: string): () => void {
  if (process.env.NODE_ENV !== "development") {
    return () => {};
  }

  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    if (duration > 16) {
      console.warn(
        `[Performance] ${componentName} render took ${duration.toFixed(2)}ms (exceeds 16ms frame budget)`
      );
    }
  };
}

/**
 * Create a performance mark for profiling
 */
export function createPerfMark(name: string): { end: () => number } {
  const markName = `${name}-start`;
  const measureName = `${name}-measure`;
  
  if (typeof performance !== "undefined" && performance.mark) {
    performance.mark(markName);
  }
  
  return {
    end: () => {
      if (typeof performance !== "undefined" && performance.measure) {
        try {
          performance.measure(measureName, markName);
          const entries = performance.getEntriesByName(measureName);
          const duration = entries[entries.length - 1]?.duration ?? 0;
          performance.clearMarks(markName);
          performance.clearMeasures(measureName);
          return duration;
        } catch {
          return 0;
        }
      }
      return 0;
    },
  };
}
