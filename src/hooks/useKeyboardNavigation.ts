"use client";

import { useCallback, useRef, useEffect, useState } from "react";

interface UseKeyboardNavigationOptions {
  /** Selector for navigable items */
  itemSelector: string;
  /** Container ref */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Wrap around when reaching edges */
  wrap?: boolean;
  /** Orientation of navigation */
  orientation?: "horizontal" | "vertical" | "both";
  /** Callback when item is selected (Enter key) */
  onSelect?: (element: HTMLElement, index: number) => void;
  /** Callback when focus changes */
  onFocusChange?: (element: HTMLElement, index: number) => void;
  /** Enable roving tabindex */
  rovingTabIndex?: boolean;
}

/**
 * Hook for keyboard navigation in lists/tables
 */
export function useKeyboardNavigation({
  itemSelector,
  containerRef,
  wrap = true,
  orientation = "vertical",
  onSelect,
  onFocusChange,
  rovingTabIndex = true,
}: UseKeyboardNavigationOptions) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemsRef = useRef<HTMLElement[]>([]);

  // Update items list when container changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateItems = () => {
      itemsRef.current = Array.from(container.querySelectorAll(itemSelector));
      
      // Apply roving tabindex
      if (rovingTabIndex) {
        itemsRef.current.forEach((item, index) => {
          item.setAttribute("tabindex", index === focusedIndex ? "0" : "-1");
        });
      }
    };

    updateItems();

    // Observe for DOM changes
    const observer = new MutationObserver(updateItems);
    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [containerRef, itemSelector, focusedIndex, rovingTabIndex]);

  const focusItem = useCallback(
    (index: number) => {
      const items = itemsRef.current;
      if (items.length === 0) return;

      let newIndex = index;
      if (wrap) {
        newIndex = ((index % items.length) + items.length) % items.length;
      } else {
        newIndex = Math.max(0, Math.min(index, items.length - 1));
      }

      const item = items[newIndex];
      if (item) {
        item.focus();
        setFocusedIndex(newIndex);
        onFocusChange?.(item, newIndex);
      }
    },
    [wrap, onFocusChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const items = itemsRef.current;
      if (items.length === 0) return;

      const currentIndex = focusedIndex >= 0 ? focusedIndex : 0;
      let newIndex = currentIndex;
      let handled = false;

      switch (event.key) {
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            newIndex = currentIndex - 1;
            handled = true;
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            newIndex = currentIndex + 1;
            handled = true;
          }
          break;
        case "Home":
          newIndex = 0;
          handled = true;
          break;
        case "End":
          newIndex = items.length - 1;
          handled = true;
          break;
        case "Enter":
        case " ": {
          const focusedItem = items[focusedIndex];
          if (focusedIndex >= 0 && focusedItem) {
            onSelect?.(focusedItem, focusedIndex);
            handled = true;
          }
          break;
        }
      }

      if (handled) {
        event.preventDefault();
        if (newIndex !== currentIndex) {
          focusItem(newIndex);
        }
      }
    },
    [focusedIndex, orientation, focusItem, onSelect]
  );

  const resetFocus = useCallback(() => {
    setFocusedIndex(-1);
  }, []);

  const focusFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);

  const focusLast = useCallback(() => {
    focusItem(itemsRef.current.length - 1);
  }, [focusItem]);

  return {
    focusedIndex,
    handleKeyDown,
    focusItem,
    focusFirst,
    focusLast,
    resetFocus,
    itemCount: itemsRef.current.length,
  };
}

/**
 * Hook for focus trap within a container
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>) {
  const firstFocusableRef = useRef<HTMLElement | null>(null);
  const lastFocusableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateFocusableElements = () => {
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector);
      
      firstFocusableRef.current = focusableElements[0] || null;
      lastFocusableRef.current = focusableElements[focusableElements.length - 1] || null;
    };

    updateFocusableElements();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableRef.current) {
          event.preventDefault();
          lastFocusableRef.current?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableRef.current) {
          event.preventDefault();
          firstFocusableRef.current?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef]);

  const focusFirst = useCallback(() => {
    firstFocusableRef.current?.focus();
  }, []);

  return { focusFirst };
}

/**
 * Hook for skip links (accessibility)
 */
export function useSkipLink(targetId: string) {
  const handleSkip = useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [targetId]
  );

  return { handleSkip };
}
