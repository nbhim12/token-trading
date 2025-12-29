"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { formatPrice, formatPercentage } from "@/lib/utils";

interface PriceTextProps {
  value: number;
  className?: string;
  /** Show as percentage */
  isPercentage?: boolean;
  /** Show positive/negative sign */
  showSign?: boolean;
  /** Previous value for flash animation comparison */
  prevValue?: number;
  /** Custom formatter function */
  formatter?: (value: number) => string;
}

/**
 * PriceText component with color-coded display and flash animations
 * Automatically colors based on positive/negative values
 * Pass prevValue prop to enable flash animation on change
 */
export const PriceText = memo(function PriceText({
  value,
  className,
  isPercentage = false,
  showSign = false,
  prevValue,
  formatter,
}: PriceTextProps) {
  // Determine color based on value
  const colorClass =
    value > 0
      ? "text-success"
      : value < 0
        ? "text-danger"
        : "text-text-secondary";

  // Format the display value
  const displayValue = formatter
    ? formatter(value)
    : isPercentage
      ? formatPercentage(value)
      : showSign
        ? `${value >= 0 ? "+" : ""}${formatPrice(value)}`
        : formatPrice(value);

  // Determine flash animation class
  const flashClass =
    prevValue !== undefined && prevValue !== value
      ? value > prevValue
        ? "animate-pulse-green"
        : "animate-pulse-red"
      : "";

  return (
    <span
      className={cn(
        "font-mono tabular-nums transition-colors duration-150",
        colorClass,
        flashClass,
        className
      )}
    >
      {displayValue}
    </span>
  );
});

/**
 * Price display with both price and change percentage
 */
export const PriceWithChange = memo(function PriceWithChange({
  price,
  change,
  className,
}: {
  price: number;
  change: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-end", className)}>
      <PriceText value={price} className="text-sm" />
      <PriceText
        value={change}
        isPercentage
        className="text-xs"
      />
    </div>
  );
});

/**
 * Large price display for modals/details
 */
export const PriceLarge = memo(function PriceLarge({
  price,
  change,
  className,
}: {
  price: number;
  change: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="text-2xl font-bold text-text-primary font-mono tabular-nums">
        ${formatPrice(price)}
      </span>
      <PriceText value={change} isPercentage className="text-sm" />
    </div>
  );
});
