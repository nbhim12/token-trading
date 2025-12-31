"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { PriceText } from "@/components/atoms/PriceText";
import { Tooltip } from "@/components/atoms/Tooltip";
import { TrendIcon } from "@/components/atoms/Icon";
import { formatPrice } from "@/lib/utils";
import { useTokenPrice } from "@/hooks/useRealtimeTokens";

interface RealtimePriceCellProps {
  tokenId: string;
  className?: string;
  showTrendIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Real-time price cell that subscribes to Redux for live updates
 * Shows flash animation when price changes
 */
export const RealtimePriceCell = memo(function RealtimePriceCell({
  tokenId,
  className,
  showTrendIcon = true,
  size = "md",
}: RealtimePriceCellProps) {
  const { price, priceChange, direction, isFlashing } = useTokenPrice(tokenId);

  const sizeConfig = {
    sm: { price: "text-xs", change: "text-[10px]", icon: "h-3 w-3" },
    md: { price: "text-sm", change: "text-xs", icon: "h-3.5 w-3.5" },
    lg: { price: "text-base", change: "text-sm", icon: "h-4 w-4" },
  };

  const config = sizeConfig[size];

  // Use direction from hook directly for flash class
  const flashClass = isFlashing && direction === "up"
    ? "animate-pulse-green"
    : isFlashing && direction === "down"
      ? "animate-pulse-red"
      : "";

  return (
    <Tooltip
      content={
        <div className="text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-text-tertiary">Price:</span>
            <span className="font-mono">${price.toFixed(8)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-tertiary">24h:</span>
            <span className={cn(
              "font-mono",
              priceChange >= 0 ? "text-success" : "text-danger"
            )}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      }
    >
      <div className={cn("flex flex-col items-end rounded-md px-1 py-0.5 transition-colors", flashClass, className)}>
        <div className="flex items-center gap-1">
          {showTrendIcon && direction !== "stable" && (
            <TrendIcon
              value={direction === "up" ? 1 : -1}
              className={cn(config.icon, "transition-transform", isFlashing && "scale-110")}
            />
          )}
          <span className={cn(
            "font-mono text-text-primary transition-colors",
            config.price,
            isFlashing && direction === "up" && "text-success",
            isFlashing && direction === "down" && "text-danger"
          )}>
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
 * Inline price display with flash animation
 */
export const RealtimePriceInline = memo(function RealtimePriceInline({
  tokenId,
  className,
  showChange = true,
}: {
  tokenId: string;
  className?: string;
  showChange?: boolean;
}) {
  const { price, priceChange, direction, isFlashing } = useTokenPrice(tokenId);

  const flashClass = isFlashing
    ? direction === "up"
      ? "text-success"
      : direction === "down"
        ? "text-danger"
        : ""
    : "";

  return (
    <span className={cn("font-mono tabular-nums inline-flex items-center gap-1.5", className)}>
      <span className={cn("transition-colors", flashClass)}>
        ${formatPrice(price)}
      </span>
      {showChange && (
        <span className={cn(
          "text-xs",
          priceChange >= 0 ? "text-success" : "text-danger"
        )}>
          {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
        </span>
      )}
    </span>
  );
});
