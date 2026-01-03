"use client";

import { useEffect, useCallback, useState, useRef } from "react";

/**
 * Announce message to screen readers via live region
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  // Find or create the live region
  let liveRegion = document.getElementById("sr-live-region");
  
  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "sr-live-region";
    liveRegion.setAttribute("role", "status");
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    liveRegion.style.cssText =
      "position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;";
    document.body.appendChild(liveRegion);
  } else {
    liveRegion.setAttribute("aria-live", priority);
  }

  // Clear and set the message (this triggers the announcement)
  liveRegion.textContent = "";
  requestAnimationFrame(() => {
    liveRegion!.textContent = message;
  });
}

/**
 * Hook for managing screen reader announcements
 */
export function useAnnounce() {
  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      announceToScreenReader(message, priority);
    },
    []
  );

  const announcePolite = useCallback((message: string) => {
    announce(message, "polite");
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, "assertive");
  }, [announce]);

  return { announce, announcePolite, announceAssertive };
}

/**
 * Hook for reduced motion preference
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook for managing focus visibility (keyboard vs mouse)
 */
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const hadKeyboardEventRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        hadKeyboardEventRef.current = true;
      }
    };

    const handleMouseDown = () => {
      hadKeyboardEventRef.current = false;
    };

    const handleFocus = () => {
      setIsFocusVisible(hadKeyboardEventRef.current);
    };

    const handleBlur = () => {
      setIsFocusVisible(false);
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("mousedown", handleMouseDown, true);
    document.addEventListener("focus", handleFocus, true);
    document.addEventListener("blur", handleBlur, true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("mousedown", handleMouseDown, true);
      document.removeEventListener("focus", handleFocus, true);
      document.removeEventListener("blur", handleBlur, true);
    };
  }, []);

  return isFocusVisible;
}

/**
 * Generate unique IDs for ARIA relationships
 */
let idCounter = 0;
export function useId(prefix = "id"): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}

/**
 * Hook for managing ARIA expanded state
 */
export function useAriaExpanded(initialExpanded = false) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const controlId = useId("control");
  const contentId = useId("content");

  const toggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const close = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const triggerProps = {
    "aria-expanded": isExpanded,
    "aria-controls": contentId,
    id: controlId,
  };

  const contentProps = {
    id: contentId,
    "aria-labelledby": controlId,
    hidden: !isExpanded,
  };

  return {
    isExpanded,
    toggle,
    open,
    close,
    triggerProps,
    contentProps,
  };
}

/**
 * Hook for table accessibility
 */
export function useTableAccessibility({
  caption,
  sortColumn,
  sortDirection,
  totalRows,
  selectedRows = 0,
}: {
  caption: string;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  totalRows: number;
  selectedRows?: number;
}) {
  const { announce } = useAnnounce();

  // Announce sort changes
  useEffect(() => {
    if (sortColumn && sortDirection) {
      const direction = sortDirection === "asc" ? "ascending" : "descending";
      announce(`Table sorted by ${sortColumn}, ${direction}`);
    }
  }, [sortColumn, sortDirection, announce]);

  // Announce selection changes
  useEffect(() => {
    if (selectedRows > 0) {
      announce(`${selectedRows} of ${totalRows} rows selected`);
    }
  }, [selectedRows, totalRows, announce]);

  const tableProps = {
    role: "table" as const,
    "aria-label": caption,
    "aria-rowcount": totalRows,
  };

  const getSortButtonProps = (column: string) => ({
    "aria-sort":
      sortColumn === column
        ? sortDirection === "asc"
          ? ("ascending" as const)
          : ("descending" as const)
        : ("none" as const),
  });

  return {
    tableProps,
    getSortButtonProps,
    announce,
  };
}

/**
 * Hook for managing loading state announcements
 */
export function useLoadingAnnouncement(isLoading: boolean, loadingMessage = "Loading") {
  const { announcePolite } = useAnnounce();
  const prevLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (isLoading && !prevLoadingRef.current) {
      announcePolite(loadingMessage);
    } else if (!isLoading && prevLoadingRef.current) {
      announcePolite("Loading complete");
    }
    prevLoadingRef.current = isLoading;
  }, [isLoading, loadingMessage, announcePolite]);
}
