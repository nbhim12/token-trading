"use client";

import { memo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { SortIcon } from "@/components/atoms/Icon";
import { Tooltip } from "@/components/atoms/Tooltip";
import type { SortDirection } from "@/lib/types";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey: string | null;
  currentDirection: SortDirection;
  onSort: (key: string) => void;
  className?: string;
  align?: "left" | "center" | "right";
  tooltip?: string;
}

/**
 * Sortable table header cell
 * Displays sort indicator and handles click to sort
 */
export const SortableHeader = memo(function SortableHeader({
  label,
  sortKey,
  currentSortKey,
  currentDirection,
  onSort,
  className,
  align = "left",
  tooltip,
}: SortableHeaderProps) {
  const isActive = currentSortKey === sortKey;
  const direction = isActive ? currentDirection : null;

  const handleClick = useCallback(() => {
    onSort(sortKey);
  }, [onSort, sortKey]);

  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const content = (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-1 text-xs font-medium uppercase tracking-wider",
        "text-text-tertiary hover:text-text-secondary transition-colors",
        isActive && "text-text-primary",
        alignmentClass[align],
        className
      )}
    >
      <span>{label}</span>
      <SortIcon direction={direction} className="h-3.5 w-3.5" />
    </button>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
});

/**
 * Non-sortable table header
 */
export const TableHeader = memo(function TableHeader({
  label,
  className,
  align = "left",
  tooltip,
}: {
  label: string;
  className?: string;
  align?: "left" | "center" | "right";
  tooltip?: string;
}) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const content = (
    <span
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-text-tertiary",
        alignmentClass[align],
        className
      )}
    >
      {label}
    </span>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
});

/**
 * Table header row container
 */
export const TableHeaderRow = memo(function TableHeaderRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center px-4 py-2 border-b border-border-primary bg-bg-secondary/50",
        "sticky top-0 z-10 backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
});
