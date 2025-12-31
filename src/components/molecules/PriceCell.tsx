"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { PriceText } from "@/components/atoms/PriceText";
import { Tooltip } from "@/components/atoms/Tooltip";
import { TrendIcon } from "@/components/atoms/Icon";
import { formatPrice, formatCompact } from "@/lib/utils";

interface PriceCellProps {
  price: number;
  priceChange: number;
  className?: string;
  showTrendIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Price cell displaying current price and percentage change
 * Used in table rows for token price display
 */
export const PriceCell = memo(function PriceCell({
  price,
  priceChange,
  className,
  showTrendIcon = false,
  size = "md",
}: PriceCellProps) {
  const sizeConfig = {
    sm: { price: "text-xs", change: "text-[10px]" },
    md: { price: "text-sm", change: "text-xs" },
    lg: { price: "text-base", change: "text-sm" },
  };

  const config = sizeConfig[size];

  return (
    <Tooltip
      content={
        <div className="text-xs">
          <div>Price: ${price.toFixed(8)}</div>
          <div>24h Change: {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%</div>
        </div>
      }
    >
      <div className={cn("flex flex-col items-end", className)}>
        <div className="flex items-center gap-1">
          {showTrendIcon && <TrendIcon value={priceChange} className="h-3 w-3" />}
          <span className={cn("font-mono text-text-primary", config.price)}>
            ${formatPrice(price)}
          </span>
        </div>
        <PriceText
          value={priceChange}
          isPercentage
          className={config.change}
        />
      </div>
    </Tooltip>
  );
});

/**
 * Market cap cell with formatted display
 */
export const MarketCapCell = memo(function MarketCapCell({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <Tooltip content={`$${value.toLocaleString()}`}>
      <span className={cn("font-mono text-sm text-text-primary", className)}>
        ${formatCompact(value)}
      </span>
    </Tooltip>
  );
});

/**
 * Volume cell with formatted display
 */
export const VolumeCell = memo(function VolumeCell({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <Tooltip content={`$${value.toLocaleString()}`}>
      <span className={cn("font-mono text-sm text-text-secondary", className)}>
        ${formatCompact(value)}
      </span>
    </Tooltip>
  );
});

/**
 * Liquidity cell with formatted display
 */
export const LiquidityCell = memo(function LiquidityCell({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <Tooltip content={`$${value.toLocaleString()} liquidity`}>
      <span className={cn("font-mono text-sm text-text-secondary", className)}>
        ${formatCompact(value)}
      </span>
    </Tooltip>
  );
});
